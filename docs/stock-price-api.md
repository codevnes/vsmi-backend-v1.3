# Stock Price API Documentation

## Giới thiệu

API quản lý StockPrice (Dữ liệu giá chứng khoán) cung cấp các endpoint để thực hiện các thao tác CRUD (Create, Read, Update, Delete) với dữ liệu giá chứng khoán. API này cho phép:

- Lấy lịch sử giá của một mã chứng khoán với phân trang và lọc theo thời gian
- Xem giá của một mã chứng khoán theo ngày cụ thể
- Lấy giá mới nhất của một mã chứng khoán
- Tạo dữ liệu giá mới cho một mã chứng khoán (chỉ dành cho Admin)
- Cập nhật dữ liệu giá của một mã chứng khoán (chỉ dành cho Admin)
- Xóa dữ liệu giá của một mã chứng khoán (chỉ dành cho Admin)
- Nhập dữ liệu giá hàng loạt (chỉ dành cho Admin)

## Xác thực (Authentication)

Để thực hiện các thao tác thêm, sửa, xóa dữ liệu, người dùng cần được xác thực và có quyền Admin. Để xác thực, bạn cần gửi JWT token trong header của request:

```
Authorization: Bearer <your_jwt_token>
```

Các thao tác lấy dữ liệu giá không yêu cầu xác thực.

## Base URL

```
/api/stock-prices
```

## Endpoints

### 1. Lấy lịch sử giá của một mã chứng khoán

**Endpoint:** `GET /api/stock-prices/symbol/:symbol`

**Parameters:**

| Tham số    | Kiểu dữ liệu | Mô tả                                           | Bắt buộc |
|------------|--------------|--------------------------------------------------|----------|
| symbol     | String       | Mã của chứng khoán                              | Có       |
| startDate  | String       | Ngày bắt đầu (định dạng YYYY-MM-DD)             | Không    |
| endDate    | String       | Ngày kết thúc (định dạng YYYY-MM-DD)            | Không    |
| page       | Number       | Số trang (mặc định: 1)                          | Không    |
| limit      | Number       | Số lượng item trên mỗi trang (mặc định: 30)     | Không    |

**Ví dụ Request:**

```
GET /api/stock-prices/symbol/VNM?startDate=2023-01-01&endDate=2023-01-31&page=1&limit=10
```

**Response Success (200):**

```json
{
  "message": "Stock prices retrieved successfully",
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "symbol": "VNM",
      "date": "2023-01-31",
      "open": 80000.0000,
      "high": 82000.0000,
      "low": 79500.0000,
      "close": 81500.0000,
      "volume": 1500000,
      "trendQ": 0.8500,
      "fq": 0.7200,
      "bandDown": 78000.0000,
      "bandUp": 85000.0000,
      "createdAt": "2023-01-31T00:00:00.000Z",
      "updatedAt": "2023-01-31T00:00:00.000Z"
    },
    // ... other price data
  ],
  "pagination": {
    "total": 22,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

### 2. Lấy giá của một mã chứng khoán theo ngày

**Endpoint:** `GET /api/stock-prices/symbol/:symbol/date/:date`

**Parameters:**

| Tham số | Kiểu dữ liệu | Mô tả                             | Bắt buộc |
|---------|--------------|----------------------------------|----------|
| symbol  | String       | Mã của chứng khoán               | Có       |
| date    | String       | Ngày cụ thể (định dạng YYYY-MM-DD) | Có       |

**Ví dụ Request:**

```
GET /api/stock-prices/symbol/VNM/date/2023-01-15
```

**Response Success (200):**

```json
{
  "message": "Stock price retrieved successfully",
  "stockPrice": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "symbol": "VNM",
    "date": "2023-01-15",
    "open": 80000.0000,
    "high": 82000.0000,
    "low": 79500.0000,
    "close": 81500.0000,
    "volume": 1500000,
    "trendQ": 0.8500,
    "fq": 0.7200,
    "bandDown": 78000.0000,
    "bandUp": 85000.0000,
    "createdAt": "2023-01-15T00:00:00.000Z",
    "updatedAt": "2023-01-15T00:00:00.000Z"
  }
}
```

**Response Error (404):**

```json
{
  "message": "Stock price not found for the specified date"
}
```

### 3. Lấy giá mới nhất của một mã chứng khoán

**Endpoint:** `GET /api/stock-prices/symbol/:symbol/latest`

**Parameters:**

| Tham số | Kiểu dữ liệu | Mô tả                | Bắt buộc |
|---------|--------------|---------------------|----------|
| symbol  | String       | Mã của chứng khoán  | Có       |

**Ví dụ Request:**

```
GET /api/stock-prices/symbol/VNM/latest
```

**Response Success (200):**

```json
{
  "message": "Stock price retrieved successfully",
  "stockPrice": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "symbol": "VNM",
    "date": "2023-02-15",
    "open": 82000.0000,
    "high": 83500.0000,
    "low": 81500.0000,
    "close": 83000.0000,
    "volume": 1600000,
    "trendQ": 0.8700,
    "fq": 0.7500,
    "bandDown": 79000.0000,
    "bandUp": 87000.0000,
    "createdAt": "2023-02-15T00:00:00.000Z",
    "updatedAt": "2023-02-15T00:00:00.000Z"
  }
}
```

**Response Error (404):**

```json
{
  "message": "No stock prices found for this symbol"
}
```

### 4. Tạo dữ liệu giá mới cho một mã chứng khoán

**Endpoint:** `POST /api/stock-prices`

**Authentication:** Yêu cầu JWT token và quyền Admin

**Request Body:**

```json
{
  "symbol": "VNM",
  "date": "2023-02-16",
  "open": 83000.0000,
  "high": 85000.0000,
  "low": 82500.0000,
  "close": 84500.0000,
  "volume": 1700000,
  "trendQ": 0.8800,
  "fq": 0.7600,
  "bandDown": 80000.0000,
  "bandUp": 88000.0000
}
```

**Các trường bắt buộc:**
- symbol
- date
- open
- high
- low
- close

**Response Success (201):**

```json
{
  "message": "Stock price created successfully",
  "stockPrice": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "symbol": "VNM",
    "date": "2023-02-16",
    "open": 83000.0000,
    "high": 85000.0000,
    "low": 82500.0000,
    "close": 84500.0000,
    "volume": 1700000,
    "trendQ": 0.8800,
    "fq": 0.7600,
    "bandDown": 80000.0000,
    "bandUp": 88000.0000,
    "createdAt": "2023-02-16T00:00:00.000Z",
    "updatedAt": "2023-02-16T00:00:00.000Z"
  }
}
```

**Response Error (409):**

```json
{
  "message": "Stock price for this date already exists"
}
```

**Response Error (404):**

```json
{
  "message": "Stock not found"
}
```

### 5. Cập nhật dữ liệu giá của một mã chứng khoán

**Endpoint:** `PUT /api/stock-prices/symbol/:symbol/date/:date`

**Authentication:** Yêu cầu JWT token và quyền Admin

**Parameters:**

| Tham số | Kiểu dữ liệu | Mô tả                             | Bắt buộc |
|---------|--------------|----------------------------------|----------|
| symbol  | String       | Mã của chứng khoán               | Có       |
| date    | String       | Ngày cụ thể (định dạng YYYY-MM-DD) | Có       |

**Request Body:**

```json
{
  "open": 83500.0000,
  "high": 86000.0000,
  "low": 83000.0000,
  "close": 85500.0000,
  "volume": 1750000,
  "trendQ": 0.8900,
  "fq": 0.7700,
  "bandDown": 81000.0000,
  "bandUp": 89000.0000
}
```

**Response Success (200):**

```json
{
  "message": "Stock price updated successfully",
  "stockPrice": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "symbol": "VNM",
    "date": "2023-02-16",
    "open": 83500.0000,
    "high": 86000.0000,
    "low": 83000.0000,
    "close": 85500.0000,
    "volume": 1750000,
    "trendQ": 0.8900,
    "fq": 0.7700,
    "bandDown": 81000.0000,
    "bandUp": 89000.0000,
    "createdAt": "2023-02-16T00:00:00.000Z",
    "updatedAt": "2023-02-16T10:30:00.000Z"
  }
}
```

**Response Error (404):**

```json
{
  "message": "Stock price not found for the specified date"
}
```

### 6. Xóa dữ liệu giá của một mã chứng khoán

**Endpoint:** `DELETE /api/stock-prices/symbol/:symbol/date/:date`

**Authentication:** Yêu cầu JWT token và quyền Admin

**Parameters:**

| Tham số | Kiểu dữ liệu | Mô tả                             | Bắt buộc |
|---------|--------------|----------------------------------|----------|
| symbol  | String       | Mã của chứng khoán               | Có       |
| date    | String       | Ngày cụ thể (định dạng YYYY-MM-DD) | Có       |

**Ví dụ Request:**

```
DELETE /api/stock-prices/symbol/VNM/date/2023-02-16
```

**Response Success (200):**

```json
{
  "message": "Stock price deleted successfully"
}
```

**Response Error (404):**

```json
{
  "message": "Stock price not found for the specified date"
}
```

### 7. Nhập dữ liệu giá hàng loạt

**Endpoint:** `POST /api/stock-prices/bulk`

**Authentication:** Yêu cầu JWT token và quyền Admin

**Request Body:**

```json
{
  "stockPrices": [
    {
      "symbol": "VNM",
      "date": "2023-02-17",
      "open": 85000.0000,
      "high": 87000.0000,
      "low": 84500.0000,
      "close": 86500.0000,
      "volume": 1800000,
      "trendQ": 0.9000,
      "fq": 0.7800,
      "bandDown": 82000.0000,
      "bandUp": 90000.0000
    },
    {
      "symbol": "VNM",
      "date": "2023-02-18",
      "open": 86500.0000,
      "high": 88000.0000,
      "low": 86000.0000,
      "close": 87500.0000,
      "volume": 1900000,
      "trendQ": 0.9100,
      "fq": 0.7900,
      "bandDown": 83000.0000,
      "bandUp": 91000.0000
    }
    // ... Có thể thêm nhiều dữ liệu giá khác
  ]
}
```

**Response Success (201):**

```json
{
  "message": "Stock price data processed successfully",
  "count": 2
}
```

**Response Error (400):**

```json
{
  "message": "Invalid stock price data"
}
```

## Mã lỗi

| Mã lỗi | Mô tả                                |
|--------|--------------------------------------|
| 200    | Thành công                           |
| 201    | Tạo thành công                       |
| 400    | Yêu cầu không hợp lệ                 |
| 401    | Chưa xác thực                        |
| 403    | Không có quyền                       |
| 404    | Không tìm thấy                       |
| 409    | Xung đột (dữ liệu đã tồn tại)        |
| 500    | Lỗi server                           |

## Cấu trúc dữ liệu

### StockPrice

| Trường      | Kiểu dữ liệu | Mô tả                                 |
|-------------|--------------|--------------------------------------|
| id          | String (UUID) | ID duy nhất                          |
| symbol      | String       | Mã chứng khoán                       |
| date        | Date         | Ngày giao dịch                       |
| open        | Decimal      | Giá mở cửa                           |
| high        | Decimal      | Giá cao nhất                         |
| low         | Decimal      | Giá thấp nhất                        |
| close       | Decimal      | Giá đóng cửa                         |
| volume      | BigInt       | Khối lượng giao dịch                  |
| trendQ      | Decimal      | Chỉ báo xu hướng (tùy chọn)          |
| fq          | Decimal      | Chỉ báo fq (tùy chọn)                |
| bandDown    | Decimal      | Dải dưới Bollinger Band (tùy chọn)    |
| bandUp      | Decimal      | Dải trên Bollinger Band (tùy chọn)    |
| createdAt   | DateTime     | Thời gian tạo bản ghi                |
| updatedAt   | DateTime     | Thời gian cập nhật bản ghi           | 