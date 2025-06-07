# Tài liệu API Stock Profiles (Thông tin mã chứng khoán)

## Tổng quan

API Stock Profiles cho phép quản lý các thông tin chi tiết của mã chứng khoán như giá, lợi nhuận, khối lượng giao dịch, các chỉ số P/E, EPS, ROA, ROE. API này hỗ trợ các thao tác CRUD (Thêm, Đọc, Cập nhật, Xóa) cho dữ liệu Stock Profile.

## URL Cơ sở

```
/api/stock-profiles
```

## Xác thực

- Các endpoint `GET` có thể truy cập công khai
- Các endpoint `POST`, `PUT`, `DELETE` yêu cầu quyền admin (JWT token hợp lệ + quyền admin)

## Endpoints

### 1. Lấy danh sách Stock Profiles

**Endpoint:** `GET /api/stock-profiles`

**Truy cập:** Công khai

**Tham số truy vấn:**
- `page`: Số trang (mặc định: 1)
- `limit`: Số lượng kết quả mỗi trang (mặc định: 10)
- `search`: Tìm kiếm theo mã hoặc tên chứng khoán

**Phản hồi thành công (200):**
```json
{
  "message": "Successfully retrieved stock profiles",
  "data": [
    {
      "id": "uuid-here",
      "symbol": "VIC",
      "price": 50000,
      "profit": 10000000000,
      "volume": 5000000,
      "pe": 15.5,
      "eps": 3200,
      "roa": 0.08,
      "roe": 0.21,
      "createdAt": "2023-07-20T08:00:00.000Z",
      "updatedAt": "2023-07-20T08:00:00.000Z",
      "stock": {
        "symbol": "VIC",
        "name": "Tập đoàn Vingroup",
        "exchange": "HOSE",
        "industry": "Bất động sản"
      }
    },
    // ...các profile khác
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

**Phản hồi lỗi (500):**
```json
{
  "message": "Error retrieving stock profiles"
}
```

### 2. Lấy Stock Profile theo mã chứng khoán

**Endpoint:** `GET /api/stock-profiles/:symbol`

**Truy cập:** Công khai

**Tham số đường dẫn:**
- `symbol`: Mã chứng khoán (VD: VIC)

**Phản hồi thành công (200):**
```json
{
  "message": "Successfully retrieved stock profile",
  "data": {
    "id": "uuid-here",
    "symbol": "VIC",
    "price": 50000,
    "profit": 10000000000,
    "volume": 5000000,
    "pe": 15.5,
    "eps": 3200,
    "roa": 0.08,
    "roe": 0.21,
    "createdAt": "2023-07-20T08:00:00.000Z",
    "updatedAt": "2023-07-20T08:00:00.000Z",
    "stock": {
      "symbol": "VIC",
      "name": "Tập đoàn Vingroup",
      "exchange": "HOSE",
      "industry": "Bất động sản"
    }
  }
}
```

**Phản hồi lỗi (404):**
```json
{
  "message": "Stock profile not found"
}
```

**Phản hồi lỗi (500):**
```json
{
  "message": "Error retrieving stock profile"
}
```

### 3. Tạo Stock Profile mới

**Endpoint:** `POST /api/stock-profiles`

**Truy cập:** Chỉ Admin

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Body:**
```json
{
  "symbol": "VIC",
  "price": 50000,
  "profit": 10000000000,
  "volume": 5000000,
  "pe": 15.5,
  "eps": 3200,
  "roa": 0.08,
  "roe": 0.21
}
```

**Phản hồi thành công (201):**
```json
{
  "message": "Stock profile created successfully",
  "data": {
    "id": "uuid-here",
    "symbol": "VIC",
    "price": 50000,
    "profit": 10000000000,
    "volume": 5000000,
    "pe": 15.5,
    "eps": 3200,
    "roa": 0.08,
    "roe": 0.21,
    "createdAt": "2023-07-20T08:00:00.000Z",
    "updatedAt": "2023-07-20T08:00:00.000Z",
    "stock": {
      "symbol": "VIC",
      "name": "Tập đoàn Vingroup",
      "exchange": "HOSE",
      "industry": "Bất động sản"
    }
  }
}
```

**Phản hồi lỗi (400):**
```json
{
  "message": "Symbol is required"
}
```

**Phản hồi lỗi (404):**
```json
{
  "message": "Stock not found"
}
```

**Phản hồi lỗi (409):**
```json
{
  "message": "Stock profile already exists"
}
```

**Phản hồi lỗi (500):**
```json
{
  "message": "Error creating stock profile"
}
```

### 4. Cập nhật Stock Profile

**Endpoint:** `PUT /api/stock-profiles/:symbol`

**Truy cập:** Chỉ Admin

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Tham số đường dẫn:**
- `symbol`: Mã chứng khoán (VD: VIC)

**Body:**
```json
{
  "price": 55000,
  "profit": 11000000000,
  "volume": 6000000,
  "pe": 16.2,
  "eps": 3400,
  "roa": 0.09,
  "roe": 0.22
}
```

**Phản hồi thành công (200):**
```json
{
  "message": "Stock profile updated successfully",
  "data": {
    "id": "uuid-here",
    "symbol": "VIC",
    "price": 55000,
    "profit": 11000000000,
    "volume": 6000000,
    "pe": 16.2,
    "eps": 3400,
    "roa": 0.09,
    "roe": 0.22,
    "createdAt": "2023-07-20T08:00:00.000Z",
    "updatedAt": "2023-08-15T10:30:00.000Z",
    "stock": {
      "symbol": "VIC",
      "name": "Tập đoàn Vingroup",
      "exchange": "HOSE",
      "industry": "Bất động sản"
    }
  }
}
```

**Phản hồi lỗi (404):**
```json
{
  "message": "Stock profile not found"
}
```

**Phản hồi lỗi (500):**
```json
{
  "message": "Error updating stock profile"
}
```

### 5. Xóa Stock Profile

**Endpoint:** `DELETE /api/stock-profiles/:symbol`

**Truy cập:** Chỉ Admin

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Tham số đường dẫn:**
- `symbol`: Mã chứng khoán (VD: VIC)

**Phản hồi thành công (200):**
```json
{
  "message": "Stock profile deleted successfully"
}
```

**Phản hồi lỗi (404):**
```json
{
  "message": "Stock profile not found"
}
```

**Phản hồi lỗi (500):**
```json
{
  "message": "Error deleting stock profile"
}
```

### 6. Upsert Stock Profile (Tạo mới hoặc cập nhật)

**Endpoint:** `POST /api/stock-profiles/upsert`

**Truy cập:** Chỉ Admin

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Body:**
```json
{
  "symbol": "VIC",
  "price": 58000,
  "profit": 12000000000,
  "volume": 7000000,
  "pe": 17.0,
  "eps": 3500,
  "roa": 0.095,
  "roe": 0.23
}
```

**Phản hồi thành công (200):**
```json
{
  "message": "Stock profile upserted successfully",
  "data": {
    "id": "uuid-here",
    "symbol": "VIC",
    "price": 58000,
    "profit": 12000000000,
    "volume": 7000000,
    "pe": 17.0,
    "eps": 3500,
    "roa": 0.095,
    "roe": 0.23,
    "createdAt": "2023-07-20T08:00:00.000Z",
    "updatedAt": "2023-09-01T14:45:00.000Z",
    "stock": {
      "symbol": "VIC",
      "name": "Tập đoàn Vingroup",
      "exchange": "HOSE",
      "industry": "Bất động sản"
    }
  }
}
```

**Phản hồi lỗi (400):**
```json
{
  "message": "Symbol is required"
}
```

**Phản hồi lỗi (404):**
```json
{
  "message": "Stock not found"
}
```

**Phản hồi lỗi (500):**
```json
{
  "message": "Error upserting stock profile"
}
```

## Cấu trúc dữ liệu

### Stock Profile

| Trường    | Kiểu dữ liệu | Mô tả                                            |
|-----------|--------------|--------------------------------------------------|
| id        | UUID         | Định danh duy nhất của profile                   |
| symbol    | String       | Mã chứng khoán                                   |
| price     | Float        | Giá cổ phiếu (VD: giá đóng cửa gần nhất)        |
| profit    | Float        | Lợi nhuận ròng                                   |
| volume    | Float        | Khối lượng giao dịch                             |
| pe        | Float        | Tỷ lệ P/E (Price to Earnings)                    |
| eps       | Float        | Thu nhập trên mỗi cổ phiếu (Earnings Per Share)  |
| roa       | Float        | Tỷ suất lợi nhuận trên tài sản (Return on Assets)|
| roe       | Float        | Tỷ suất lợi nhuận trên vốn chủ sở hữu (Return on Equity) |
| createdAt | DateTime     | Thời điểm tạo                                    |
| updatedAt | DateTime     | Thời điểm cập nhật gần nhất                      |

## Lỗi thường gặp

| Mã lỗi | Mô tả                                           |
|--------|------------------------------------------------|
| 400    | Dữ liệu đầu vào không hợp lệ hoặc thiếu        |
| 401    | Không được xác thực hoặc token không hợp lệ     |
| 403    | Không có quyền truy cập tài nguyên              |
| 404    | Không tìm thấy tài nguyên                       |
| 409    | Xung đột dữ liệu (VD: bản ghi đã tồn tại)       |
| 500    | Lỗi máy chủ nội bộ                              | 