# StockPrice API Testing Guide

Tài liệu này hướng dẫn cách sử dụng Postman để kiểm thử API quản lý giá chứng khoán (StockPrice API).

## Chuẩn bị

1. **Công cụ kiểm thử:** Đảm bảo bạn đã cài đặt [Postman](https://www.postman.com/downloads/).
2. **API Token:** Để thực hiện các thao tác thêm, sửa, xóa, bạn cần có JWT token với quyền Admin.
3. **Mẫu dữ liệu:** Chuẩn bị sẵn dữ liệu kiểm thử.

## Thiết lập Postman

### Biến môi trường

Thiết lập các biến môi trường trong Postman để dễ dàng kiểm thử:

1. Tạo một môi trường mới, ví dụ: "Stock API Testing"
2. Thêm các biến sau:
   - `base_url`: URL cơ sở của API (ví dụ: http://localhost:3000/api)
   - `auth_token`: JWT token dùng cho xác thực
   - `symbol`: Mã chứng khoán mẫu (ví dụ: VNM)

### Collection

Tạo một collection mới cho StockPrice API:

1. Tạo collection tên "StockPrice API"
2. Thiết lập Authorization type là "Bearer Token" và sử dụng biến `{{auth_token}}`

## Các test case

### 1. Lấy lịch sử giá của một mã chứng khoán

**Request:**
- Method: GET
- URL: `{{base_url}}/stock-prices/symbol/{{symbol}}`
- Params:
  - startDate: 2023-01-01
  - endDate: 2023-01-31
  - page: 1
  - limit: 10

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has data array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('data');
    pm.expect(jsonData.data).to.be.an('array');
});

pm.test("Response has pagination", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('pagination');
    pm.expect(jsonData.pagination).to.have.property('total');
    pm.expect(jsonData.pagination).to.have.property('page');
    pm.expect(jsonData.pagination).to.have.property('limit');
    pm.expect(jsonData.pagination).to.have.property('totalPages');
});
```

### 2. Lấy giá của một mã chứng khoán theo ngày

**Request:**
- Method: GET
- URL: `{{base_url}}/stock-prices/symbol/{{symbol}}/date/2023-01-15`

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has stockPrice object", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('stockPrice');
    pm.expect(jsonData.stockPrice).to.have.property('symbol');
    pm.expect(jsonData.stockPrice).to.have.property('date');
    pm.expect(jsonData.stockPrice).to.have.property('open');
    pm.expect(jsonData.stockPrice).to.have.property('high');
    pm.expect(jsonData.stockPrice).to.have.property('low');
    pm.expect(jsonData.stockPrice).to.have.property('close');
});
```

### 3. Lấy giá mới nhất của một mã chứng khoán

**Request:**
- Method: GET
- URL: `{{base_url}}/stock-prices/symbol/{{symbol}}/latest`

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has stockPrice object", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('stockPrice');
    pm.expect(jsonData.stockPrice).to.have.property('symbol');
    pm.expect(jsonData.stockPrice).to.have.property('date');
});
```

### 4. Tạo dữ liệu giá mới cho một mã chứng khoán

**Request:**
- Method: POST
- URL: `{{base_url}}/stock-prices`
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer {{auth_token}}
- Body:
```json
{
  "symbol": "{{symbol}}",
  "date": "2023-02-16",
  "open": 83000,
  "high": 85000,
  "low": 82500,
  "close": 84500,
  "volume": 1700000,
  "trendQ": 0.88,
  "fq": 0.76,
  "bandDown": 80000,
  "bandUp": 88000
}
```

**Tests:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has stockPrice object", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('stockPrice');
    pm.expect(jsonData.stockPrice.symbol).to.eql(pm.environment.get("symbol"));
    pm.expect(jsonData.stockPrice.open).to.eql(83000);
    pm.expect(jsonData.stockPrice.high).to.eql(85000);
    pm.expect(jsonData.stockPrice.low).to.eql(82500);
    pm.expect(jsonData.stockPrice.close).to.eql(84500);
});
```

### 5. Cập nhật dữ liệu giá của một mã chứng khoán

**Request:**
- Method: PUT
- URL: `{{base_url}}/stock-prices/symbol/{{symbol}}/date/2023-02-16`
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer {{auth_token}}
- Body:
```json
{
  "open": 83500,
  "high": 86000,
  "low": 83000,
  "close": 85500,
  "volume": 1750000
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has updated stockPrice object", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('stockPrice');
    pm.expect(jsonData.stockPrice.symbol).to.eql(pm.environment.get("symbol"));
    pm.expect(jsonData.stockPrice.open).to.eql(83500);
    pm.expect(jsonData.stockPrice.high).to.eql(86000);
    pm.expect(jsonData.stockPrice.low).to.eql(83000);
    pm.expect(jsonData.stockPrice.close).to.eql(85500);
    pm.expect(jsonData.stockPrice.volume).to.eql(1750000);
});
```

### 6. Xóa dữ liệu giá của một mã chứng khoán

**Request:**
- Method: DELETE
- URL: `{{base_url}}/stock-prices/symbol/{{symbol}}/date/2023-02-16`
- Headers:
  - Authorization: Bearer {{auth_token}}

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success message", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('message');
    pm.expect(jsonData.message).to.eql('Stock price deleted successfully');
});
```

### 7. Nhập dữ liệu giá hàng loạt

**Request:**
- Method: POST
- URL: `{{base_url}}/stock-prices/bulk`
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer {{auth_token}}
- Body:
```json
{
  "stockPrices": [
    {
      "symbol": "{{symbol}}",
      "date": "2023-02-17",
      "open": 85000,
      "high": 87000,
      "low": 84500,
      "close": 86500,
      "volume": 1800000,
      "trendQ": 0.90,
      "fq": 0.78,
      "bandDown": 82000,
      "bandUp": 90000
    },
    {
      "symbol": "{{symbol}}",
      "date": "2023-02-18",
      "open": 86500,
      "high": 88000,
      "low": 86000,
      "close": 87500,
      "volume": 1900000,
      "trendQ": 0.91,
      "fq": 0.79,
      "bandDown": 83000,
      "bandUp": 91000
    }
  ]
}
```

**Tests:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has count property", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('count');
    pm.expect(jsonData.count).to.eql(2);
});
```

## Kịch bản kiểm thử

### Kịch bản đầy đủ

1. Tạo một mã chứng khoán (sử dụng Stock API)
2. Tạo dữ liệu giá mới cho mã chứng khoán đó
3. Kiểm tra lịch sử giá
4. Cập nhật dữ liệu giá
5. Xem giá theo ngày
6. Xem giá mới nhất
7. Nhập dữ liệu giá hàng loạt
8. Xóa dữ liệu giá
9. Kiểm tra lại để đảm bảo đã xóa thành công

### Kịch bản kiểm thử lỗi

1. **Tạo dữ liệu giá với mã chứng khoán không tồn tại**
   - Kỳ vọng: Status code 404, thông báo "Stock not found"

2. **Tạo dữ liệu giá trùng lặp (cùng mã và ngày)**
   - Kỳ vọng: Status code 409, thông báo "Stock price for this date already exists"

3. **Cập nhật dữ liệu giá không tồn tại**
   - Kỳ vọng: Status code 404, thông báo "Stock price not found for the specified date"

4. **Xem giá của mã chứng khoán không tồn tại**
   - Kỳ vọng: Status code 404, thông báo "Stock price not found for the specified date"

## Lưu ý

- Đảm bảo API đang chạy trước khi tiến hành kiểm thử
- Kiểm tra token xác thực có hiệu lực và có đủ quyền truy cập
- Sao lưu dữ liệu trước khi thực hiện các kiểm thử có thể ảnh hưởng đến dữ liệu thật 