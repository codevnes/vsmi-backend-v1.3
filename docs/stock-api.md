# Stock API Documentation

## Giới thiệu

API quản lý Stock (Mã chứng khoán) cung cấp các endpoint để thực hiện các thao tác CRUD (Create, Read, Update, Delete) với dữ liệu chứng khoán. API này cho phép:

- Lấy danh sách các mã chứng khoán với phân trang, tìm kiếm và lọc
- Xem chi tiết thông tin của một mã chứng khoán
- Tạo mã chứng khoán mới (chỉ dành cho Admin)
- Cập nhật thông tin mã chứng khoán (chỉ dành cho Admin)
- Xóa mã chứng khoán (chỉ dành cho Admin)

## Xác thực (Authentication)

Để thực hiện các thao tác thêm, sửa, xóa dữ liệu, người dùng cần được xác thực và có quyền Admin. Để xác thực, bạn cần gửi JWT token trong header của request:

```
Authorization: Bearer <your_jwt_token>
```

Các thao tác lấy danh sách và xem chi tiết không yêu cầu xác thực.

## Base URL

```
/api/stocks
```

## Endpoints

### 1. Lấy danh sách chứng khoán

**Endpoint:** `GET /api/stocks`

**Parameters:**

| Tham số   | Kiểu dữ liệu | Mô tả                                             | Bắt buộc |
|-----------|--------------|---------------------------------------------------|----------|
| page      | Number       | Số trang (mặc định: 1)                            | Không    |
| limit     | Number       | Số lượng item trên mỗi trang (mặc định: 10)       | Không    |
| search    | String       | Tìm kiếm theo tên hoặc mã chứng khoán             | Không    |
| exchange  | String       | Lọc theo sàn giao dịch                            | Không    |
| industry  | String       | Lọc theo ngành                                    | Không    |

**Ví dụ Request:**

```
GET /api/stocks?page=1&limit=10&search=VN&exchange=HOSE&industry=Ngân%20hàng
```

**Response Success (200):**

```json
{
  "message": "Danh sách chứng khoán được tải thành công",
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "symbol": "VNM",
      "name": "CTCP Sữa Việt Nam",
      "exchange": "HOSE",
      "industry": "Thực phẩm",
      "description": "Công ty sản xuất sữa lớn nhất Việt Nam",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "profile": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "symbol": "VNM",
        "price": 80000,
        "profit": 1500,
        "volume": 1000000,
        "pe": 15.2
      }
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### 2. Lấy thông tin chi tiết chứng khoán

**Endpoint:** `GET /api/stocks/:symbol`

**Parameters:**

| Tham số | Kiểu dữ liệu | Mô tả               | Bắt buộc |
|---------|--------------|---------------------|----------|
| symbol  | String       | Mã của chứng khoán  | Có       |

**Ví dụ Request:**

```
GET /api/stocks/VNM
```

**Response Success (200):**

```json
{
  "message": "Thông tin chứng khoán được tải thành công",
  "stock": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "symbol": "VNM",
    "name": "CTCP Sữa Việt Nam",
    "exchange": "HOSE",
    "industry": "Thực phẩm",
    "description": "Công ty sản xuất sữa lớn nhất Việt Nam",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "profile": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "symbol": "VNM",
      "price": 80000,
      "profit": 1500,
      "volume": 1000000,
      "pe": 15.2
    },
    "financialMetrics": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "symbol": "VNM",
        "year": 2023,
        "quarter": 4,
        "eps": 5000,
        "pe": 16,
        "roe": 15.3,
        "roa": 12.1
      }
    ]
  }
}
```

### 3. Tạo mã chứng khoán mới

**Endpoint:** `POST /api/stocks`

**Authentication:** Yêu cầu JWT token và quyền Admin

**Request Body:**

```json
{
  "symbol": "ABC",
  "name": "Công ty ABC",
  "exchange": "HOSE",
  "industry": "Công nghệ",
  "description": "Mô tả về công ty ABC"
}
```

**Các trường bắt buộc:**
- symbol
- name

**Response Success (201):**

```json
{
  "message": "Chứng khoán đã được tạo thành công",
  "stock": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "symbol": "ABC",
    "name": "Công ty ABC",
    "exchange": "HOSE",
    "industry": "Công nghệ",
    "description": "Mô tả về công ty ABC",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 4. Cập nhật thông tin chứng khoán

**Endpoint:** `PUT /api/stocks/:symbol`

**Authentication:** Yêu cầu JWT token và quyền Admin

**Parameters:**

| Tham số | Kiểu dữ liệu | Mô tả               | Bắt buộc |
|---------|--------------|---------------------|----------|
| symbol  | String       | Mã của chứng khoán  | Có       |

**Request Body:**

```json
{
  "name": "Tên công ty đã cập nhật",
  "exchange": "HNX",
  "industry": "Ngân hàng",
  "description": "Mô tả mới về công ty"
}
```

**Response Success (200):**

```json
{
  "message": "Chứng khoán đã được cập nhật thành công",
  "stock": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "symbol": "ABC",
    "name": "Tên công ty đã cập nhật",
    "exchange": "HNX",
    "industry": "Ngân hàng",
    "description": "Mô tả mới về công ty",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 5. Xóa chứng khoán

**Endpoint:** `DELETE /api/stocks/:symbol`

**Authentication:** Yêu cầu JWT token và quyền Admin

**Parameters:**

| Tham số | Kiểu dữ liệu | Mô tả               | Bắt buộc |
|---------|--------------|---------------------|----------|
| symbol  | String       | Mã của chứng khoán  | Có       |

**Response Success (200):**

```json
{
  "message": "Chứng khoán đã được xóa thành công"
}
```

## Mã lỗi và Phản hồi

| Mã HTTP | Mô tả                  | Phản hồi lỗi                                                      |
|---------|------------------------|-------------------------------------------------------------------|
| 400     | Bad Request            | `{ "message": "Các trường bắt buộc phải được cung cấp (symbol, name)" }` |
| 401     | Unauthorized           | `{ "message": "Thiếu token xác thực." }`                          |
| 403     | Forbidden              | `{ "message": "Bạn không có quyền thực hiện thao tác này." }`     |
| 404     | Not Found              | `{ "message": "Không tìm thấy chứng khoán" }`                     |
| 409     | Conflict               | `{ "message": "Chứng khoán với mã này đã tồn tại" }`              |
| 500     | Internal Server Error  | `{ "message": "Lỗi khi tải danh sách chứng khoán" }`              |

## Mô hình dữ liệu

### Stock

| Trường        | Kiểu dữ liệu | Mô tả                           |
|---------------|--------------|----------------------------------|
| id            | UUID         | ID duy nhất của chứng khoán      |
| symbol        | String       | Mã chứng khoán (unique)          |
| name          | String       | Tên công ty                      |
| exchange      | String       | Sàn giao dịch                    |
| industry      | String       | Ngành                            |
| description   | String       | Mô tả về công ty                 |
| createdAt     | DateTime     | Thời gian tạo                    |
| updatedAt     | DateTime     | Thời gian cập nhật               |

### StockProfile

| Trường        | Kiểu dữ liệu | Mô tả                                 |
|---------------|--------------|--------------------------------------|
| id            | UUID         | ID duy nhất của profile              |
| symbol        | String       | Mã chứng khoán (tham chiếu đến Stock) |
| price         | Float        | Giá cổ phiếu                         |
| profit        | Float        | Lợi nhuận ròng                       |
| volume        | Float        | Khối lượng giao dịch                 |
| pe            | Float        | Tỷ lệ P/E                           |

### FinancialMetrics

| Trường             | Kiểu dữ liệu | Mô tả                                 |
|--------------------|--------------|--------------------------------------|
| id                 | UUID         | ID duy nhất của chỉ số tài chính     |
| symbol             | String       | Mã chứng khoán (tham chiếu đến Stock) |
| year               | Integer      | Năm                                  |
| quarter            | Integer      | Quý (1-4)                            |
| eps                | Float        | Thu nhập trên mỗi cổ phiếu           |
| pe                 | Float        | Tỷ lệ P/E                           |
| roe                | Float        | Tỷ suất lợi nhuận trên vốn chủ sở hữu |
| roa                | Float        | Tỷ suất lợi nhuận trên tổng tài sản  | 