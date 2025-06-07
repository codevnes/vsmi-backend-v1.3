/**
 * Chuyển đổi một chuỗi thành slug URL thân thiện
 * Ví dụ: "Tiêu đề bài viết" -> "tieu-de-bai-viet"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD') // tách dấu thành các ký tự riêng
    .replace(/[\u0300-\u036f]/g, '') // loại bỏ các dấu
    .toLowerCase()
    .trim()
    .replace(/đ/g, 'd')
    .replace(/[^\w\s-]/g, '') // loại bỏ ký tự đặc biệt và dấu câu
    .replace(/[\s_-]+/g, '-') // thay thế khoảng trắng và gạch dưới bằng dấu gạch ngang
    .replace(/^-+|-+$/g, ''); // loại bỏ dấu gạch ngang ở đầu và cuối
}

/**
 * Convert a Prisma Decimal object to a Number
 * Decimal objects from Prisma have a structure like { s: 1, e: 2, d: [123, 4000] }
 * where s is sign (1 or -1), e is exponent, d is array of digits
 */
const decimalToNumber = (decimal: any): number => {
  if (!decimal || typeof decimal !== 'object') return decimal;
  
  // Check if it's a Decimal object (has s, e, d properties)
  if ('s' in decimal && 'e' in decimal && 'd' in decimal && Array.isArray(decimal.d)) {
    // Convert decimal object to number
    const sign = decimal.s;
    const exponent = decimal.e;
    const digits = decimal.d.join('');
    
    // Reconstruct the number
    if (exponent <= 0) {
      // Value is less than 1
      return sign * Number(`0.${'0'.repeat(Math.abs(exponent))}${digits}`);
    } else if (exponent >= digits.length) {
      // Value is an integer with trailing zeros
      return sign * Number(`${digits}${'0'.repeat(exponent - digits.length)}`);
    } else {
      // Value has digits on both sides of decimal point
      return sign * Number(`${digits.substring(0, exponent)}.${digits.substring(exponent)}`);
    }
  }
  
  return decimal;
};

/**
 * Helper function to stringify objects containing BigInt, Date, and Decimal values
 * Converts them to appropriate format for JSON serialization
 */
export const bigIntSerializer = (data: any): any => {
  if (data === null || data === undefined) {
    return data;
  }
  
  // Handle Date objects
  if (data instanceof Date) {
    return data.toISOString();
  }
  
  // Handle BigInt
  if (typeof data === 'bigint') {
    // If the number is within safe integer range, convert to number
    if (data <= BigInt(Number.MAX_SAFE_INTEGER) && data >= BigInt(Number.MIN_SAFE_INTEGER)) {
      return Number(data);
    }
    // Otherwise convert to string
    return data.toString();
  }
  
  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => bigIntSerializer(item));
  }
  
  // Handle objects
  if (typeof data === 'object') {
    // Handle empty objects that might be Date objects from Prisma
    if (Object.keys(data).length === 0) {
      // If it's an empty object coming from a Date field, return null
      return null;
    }
    
    // Check if this is a Decimal object from Prisma
    if ('s' in data && 'e' in data && 'd' in data && Array.isArray(data.d)) {
      return decimalToNumber(data);
    }
    
    const result: any = {};
    
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = bigIntSerializer(data[key]);
      }
    }
    
    return result;
  }
  
  // Return primitive values as is
  return data;
}; 