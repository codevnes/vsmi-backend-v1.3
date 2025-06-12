# Tài liệu API Cổ phiếu được Chọn (Selected Stocks)

## Tổng quan

API Cổ phiếu được Chọn cho phép bạn quản lý danh sách các cổ phiếu được chọn trong hệ thống. API này bao gồm các chức năng để lấy danh sách, tìm kiếm, tạo mới, cập nhật và xóa các cổ phiếu được chọn.

## Endpoints

### 1. Lấy danh sách tất cả cổ phiếu được chọn

Trả về danh sách tất cả cổ phiếu được chọn với phân trang, kèm theo thông tin chi tiết cổ phiếu và giá đóng cửa trong 3 tháng gần đây.

```
GET /selected-stocks
```

#### Tham số truy vấn

| Tham số | Loại  | Mặc định | Mô tả                                      |
| ------- | ------ | ------- | ------------------------------------------ |
| page    | number | 1       | Số trang                                   |
| limit   | number | 10      | Số lượng mục trên mỗi trang                |
| sort    | string | 'symbol'| Trường để sắp xếp (symbol, close, return, volume) |
| order   | string | 'asc'   | Thứ tự sắp xếp ('asc' hoặc 'desc')        |

#### Phản hồi

```json
{
  "message": "Lấy danh sách cổ phiếu được chọn thành công",
  "data": [
    {
      "id": "uuid-string",
      "symbol": "VNM",
      "close": 86000,
      "return": 0.05,
      "volume": 1200000,
      "createdAt": "2023-06-01T00:00:00.000Z",
      "updatedAt": "2023-06-01T00:00:00.000Z",
      "stockInfo": {
        "id": "uuid-string",
        "symbol": "VNM",
        "name": "Công ty Cổ phần Sữa Việt Nam",
        "exchange": "HOSE",
        "industry": "Thực phẩm và đồ uống"
      },
      "stockPrices": [
        {
          "date": "2023-06-01T00:00:00.000Z",
          "close": 86000
        },
        {
          "date": "2023-05-31T00:00:00.000Z",
          "close": 85500
        },
        // Các giá đóng cửa khác trong 3 tháng gần đây
      ]
    },
    // Các cổ phiếu khác
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 2. Lấy cổ phiếu được chọn theo mã chứng khoán

Trả về thông tin của cổ phiếu được chọn dựa trên mã chứng khoán, bao gồm thông tin chi tiết từ bảng stocks.

```
GET /selected-stocks/:symbol
```

#### Phản hồi

```json
{
  "message": "Lấy thông tin cổ phiếu được chọn thành công",
  "data": {
    "id": "uuid-string",
    "symbol": "VNM",
    "close": 86000,
    "return": 0.05,
    "volume": 1200000,
    "createdAt": "2023-06-01T00:00:00.000Z",
    "updatedAt": "2023-06-01T00:00:00.000Z",
    "stockInfo": {
      "id": "uuid-string",
      "symbol": "VNM",
      "name": "Công ty Cổ phần Sữa Việt Nam",
      "exchange": "HOSE",
      "industry": "Thực phẩm và đồ uống",
      "description": "Công ty hàng đầu trong lĩnh vực sản xuất sữa và các sản phẩm từ sữa tại Việt Nam",
      "profile": {
        "id": "uuid-string",
        "symbol": "VNM",
        "companyName": "Công ty Cổ phần Sữa Việt Nam",
        "marketCap": 179000000000000,
        "sector": "Hàng tiêu dùng"
        // Các trường khác của profile
      }
    }
  }
}
```

### 3. Lấy danh sách cổ phiếu hàng đầu theo tỷ suất sinh lợi

Trả về danh sách cổ phiếu được chọn có tỷ suất sinh lợi cao nhất, bao gồm thông tin cơ bản từ bảng stocks.

```
GET /selected-stocks/top
```

#### Tham số truy vấn

| Tham số | Loại  | Mặc định | Mô tả                        |
| ------- | ------ | ------- | ---------------------------- |
| limit   | number | 20      | Số lượng cổ phiếu muốn lấy   |

#### Phản hồi

```json
{
  "message": "Lấy danh sách cổ phiếu được chọn thành công",
  "data": [
    {
      "id": "uuid-string",
      "symbol": "VNM",
      "close": 86000,
      "return": 0.1,
      "volume": 1200000,
      "createdAt": "2023-06-01T00:00:00.000Z",
      "updatedAt": "2023-06-01T00:00:00.000Z",
      "stockInfo": {
        "id": "uuid-string",
        "symbol": "VNM",
        "name": "Công ty Cổ phần Sữa Việt Nam",
        "exchange": "HOSE",
        "industry": "Thực phẩm và đồ uống"
      }
    },
    // Các cổ phiếu khác
  ]
}
```

### 4. Lấy cổ phiếu được chọn theo ID

Trả về thông tin của cổ phiếu được chọn dựa trên ID, bao gồm thông tin chi tiết từ bảng stocks.

```
GET /selected-stocks/id/:id
```

#### Phản hồi

```json
{
  "message": "Lấy thông tin cổ phiếu được chọn thành công",
  "data": {
    "id": "uuid-string",
    "symbol": "VNM",
    "close": 86000,
    "return": 0.05,
    "volume": 1200000,
    "createdAt": "2023-06-01T00:00:00.000Z",
    "updatedAt": "2023-06-01T00:00:00.000Z",
    "stockInfo": {
      "id": "uuid-string",
      "symbol": "VNM",
      "name": "Công ty Cổ phần Sữa Việt Nam",
      "exchange": "HOSE",
      "industry": "Thực phẩm và đồ uống",
      "description": "Công ty hàng đầu trong lĩnh vực sản xuất sữa và các sản phẩm từ sữa tại Việt Nam",
      "profile": {
        "id": "uuid-string",
        "symbol": "VNM",
        "companyName": "Công ty Cổ phần Sữa Việt Nam",
        "marketCap": 179000000000000,
        "sector": "Hàng tiêu dùng"
        // Các trường khác của profile
      }
    }
  }
}
```

### 5. Tạo cổ phiếu được chọn mới

Tạo một cổ phiếu được chọn mới trong hệ thống.

```
POST /selected-stocks
```

#### Dữ liệu gửi đi

```json
{
  "symbol": "VNM",
  "close": 86000,
  "return": 0.05,
  "volume": 1200000
}
```

#### Phản hồi

```json
{
  "message": "Tạo cổ phiếu được chọn thành công",
  "data": {
    "id": "uuid-string",
    "symbol": "VNM",
    "close": 86000,
    "return": 0.05,
    "volume": 1200000,
    "createdAt": "2023-06-01T00:00:00.000Z",
    "updatedAt": "2023-06-01T00:00:00.000Z"
  }
}
```

### 6. Cập nhật cổ phiếu được chọn

Cập nhật thông tin của một cổ phiếu được chọn đã tồn tại.

```
PUT /selected-stocks/:id
```

#### Dữ liệu gửi đi

```json
{
  "symbol": "VNM",
  "close": 87000,
  "return": 0.06,
  "volume": 1300000
}
```

#### Phản hồi

```json
{
  "message": "Cập nhật cổ phiếu được chọn thành công",
  "data": {
    "id": "uuid-string",
    "symbol": "VNM",
    "close": 87000,
    "return": 0.06,
    "volume": 1300000,
    "createdAt": "2023-06-01T00:00:00.000Z",
    "updatedAt": "2023-06-02T00:00:00.000Z"
  }
}
```

### 7. Xóa cổ phiếu được chọn

Xóa một cổ phiếu được chọn khỏi hệ thống.

```
DELETE /selected-stocks/:id
```

#### Phản hồi

```json
{
  "message": "Xóa cổ phiếu được chọn thành công"
}
```

### 8. Xóa nhiều cổ phiếu được chọn

Xóa nhiều cổ phiếu được chọn cùng một lúc.

```
DELETE /selected-stocks
```

#### Dữ liệu gửi đi

```json
{
  "ids": ["uuid-string-1", "uuid-string-2", "uuid-string-3"]
}
```

#### Phản hồi

```json
{
  "message": "Xóa các cổ phiếu được chọn thành công",
  "count": 3
}
```

## Cập nhật mới

**Tính năng mới (Tháng 4, 2024):**
- Endpoint GET `/selected-stocks` giờ đây trả về thông tin cơ bản về cổ phiếu từ bảng `stocks` thông qua trường `stockInfo` (id, symbol, name, exchange, industry).
- Endpoint GET `/selected-stocks` giờ đây trả về chỉ dữ liệu ngày và giá đóng cửa (date, close) trong 3 tháng gần đây cho mỗi cổ phiếu được chọn thông qua trường `stockPrices`.
- Các endpoint `/selected-stocks/:symbol`, `/selected-stocks/top` và `/selected-stocks/id/:id` cũng trả về thông tin chi tiết về cổ phiếu.
- Các giá cổ phiếu được sắp xếp theo ngày giảm dần (mới nhất được hiển thị trước).
- Dữ liệu BigInt (như volume) đã được xử lý để tương thích với JSON.

## Mã lỗi và xử lý

| Mã lỗi | Mô tả                                        |
| ------ | -------------------------------------------- |
| 400    | Lỗi dữ liệu đầu vào không hợp lệ             |
| 404    | Không tìm thấy cổ phiếu được chọn            |
| 409    | Cổ phiếu với mã chứng khoán đã tồn tại       |
| 500    | Lỗi máy chủ                                  |

## Lưu ý

- Tất cả các truy vấn phân trang bắt đầu từ trang 1.
- Giá trị `null` được phép cho các trường `close`, `return` và `volume`.
- Trường `stockPrices` chỉ có sẵn trong endpoint GET `/selected-stocks` và chứa dữ liệu ngày và giá đóng cửa trong 3 tháng gần đây.
- Trường `stockInfo` chứa thông tin cơ bản từ bảng stocks và được trả về trong tất cả các endpoint GET.
- Mã chứng khoán (symbol) phải là duy nhất trong hệ thống. 