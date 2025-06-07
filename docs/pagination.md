# Quy tắc phân trang (Pagination)

Tài liệu này mô tả quy tắc phân trang được áp dụng trong các API trả về danh sách dữ liệu của hệ thống VSMI Backend.

## Tổng quan

Phân trang là cách để truy cập một phần của tập dữ liệu thông qua các tham số query. Thay vì trả về toàn bộ dữ liệu, API trả về một số lượng nhất định các mục dữ liệu trong một trang cụ thể.

## Tham số phân trang

Tất cả các API trả về danh sách đều hỗ trợ các tham số query sau:

| Tham số | Mô tả | Mặc định | Phạm vi |
| --- | --- | --- | --- |
| `page` | Trang hiện tại | 1 | Số nguyên dương |
| `limit` | Số lượng mục dữ liệu trên mỗi trang | 10 | 1-100 |
| `sort` | Trường để sắp xếp | `createdAt` | Phụ thuộc vào model |
| `order` | Thứ tự sắp xếp | `desc` | `asc`, `desc` |

### Ví dụ

```
GET /api/users?page=2&limit=20&sort=email&order=asc
```

Truy vấn trên sẽ trả về trang thứ 2 của danh sách người dùng, với 20 người dùng mỗi trang, sắp xếp theo email theo thứ tự tăng dần.

## Định dạng phản hồi

Khi sử dụng phân trang, phản hồi JSON sẽ có cấu trúc như sau:

```json
{
  "message": "Lấy dữ liệu thành công",
  "data": [...],  // Mảng dữ liệu của trang hiện tại
  "pagination": {
    "page": 2,           // Trang hiện tại
    "limit": 20,         // Số lượng mục dữ liệu trên mỗi trang
    "totalItems": 45,    // Tổng số mục dữ liệu
    "totalPages": 3,     // Tổng số trang
    "hasNextPage": true,  // Có trang tiếp theo hay không
    "hasPrevPage": true   // Có trang trước đó hay không
  }
}
```

## Triển khai với API Users

### Lấy danh sách người dùng có phân trang

- **URL**: `/api/users`
- **Method**: `GET`
- **Quyền truy cập**: Admin
- **Tham số Query**:
  - `page`: Số trang (mặc định: 1)
  - `limit`: Số lượng người dùng trên mỗi trang (mặc định: 10)
  - `sort`: Trường để sắp xếp (mặc định: createdAt)
  - `order`: Thứ tự sắp xếp (mặc định: desc)
- **Request Headers**:
  ```
  Authorization: Bearer <token>
  ```

- **Success Response**:
  - **Mã**: 200 OK
  - **Nội dung**:
    ```json
    {
      "message": "Lấy danh sách người dùng thành công.",
      "users": [
        {
          "id": "uuid-1",
          "email": "user1@example.com",
          "fullName": "Người Dùng 1",
          "phone": "0123456789",
          "role": "USER",
          "verified": false,
          "createdAt": "2023-01-01T00:00:00.000Z",
          "updatedAt": "2023-01-01T00:00:00.000Z"
        },
        // ... các người dùng khác
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "totalItems": 45,
        "totalPages": 5,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    }
    ```

### Tìm kiếm và lọc

Ngoài phân trang, API cũng hỗ trợ tìm kiếm và lọc dữ liệu. Các tham số query có thể được kết hợp với tham số phân trang:

| Tham số | Mô tả | Ví dụ |
| --- | --- | --- |
| `search` | Tìm kiếm theo từ khóa (sẽ tìm trong các trường fullName và email) | `?search=nguyễn` |
| `role` | Lọc theo vai trò | `?role=ADMIN` |
| `verified` | Lọc theo trạng thái xác thực | `?verified=true` |

### Ví dụ đầy đủ

```
GET /api/users?page=1&limit=20&sort=fullName&order=asc&search=nguyễn&role=USER
```

Truy vấn trên sẽ:
1. Trả về trang đầu tiên với 20 người dùng mỗi trang
2. Sắp xếp theo tên đầy đủ theo thứ tự tăng dần
3. Tìm kiếm người dùng có tên chứa từ "nguyễn"
4. Chỉ hiển thị người dùng có vai trò USER

## Triển khai trong mã nguồn

Để triển khai phân trang cho một API mới, các bước sau đây nên được thực hiện:

1. **Controller**: Trích xuất các tham số phân trang từ request
2. **Service**: Chuyển tham số phân trang đến repository
3. **Repository**: Thực hiện truy vấn với phân trang và trả về kết quả với metadata phân trang

### Ví dụ mã truy vấn với Prisma

```typescript
async findAll(options: {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  role?: Role;
}) {
  const {
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
    search = '',
    role
  } = options;
  
  const skip = (page - 1) * limit;
  
  // Build where clause
  const where: any = {
    deletedAt: null
  };
  
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  if (role) {
    where.role = role;
  }
  
  // Count total items
  const totalItems = await this.prisma.user.count({ where });
  
  // Get data with pagination
  const users = await this.prisma.user.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      [sort]: order
    }
  });
  
  return {
    users,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      hasNextPage: page < Math.ceil(totalItems / limit),
      hasPrevPage: page > 1
    }
  };
}
```

## Xử lý lỗi

Nếu tham số phân trang không hợp lệ, API sẽ trả về lỗi 400 Bad Request:

```json
{
  "message": "Tham số phân trang không hợp lệ."
}
```

Một số trường hợp lỗi phổ biến:
- `page` hoặc `limit` không phải là số
- `page` hoặc `limit` là số âm
- `limit` vượt quá giá trị tối đa cho phép (100)
- `sort` không phải là trường hợp lệ 