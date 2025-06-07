# Tài liệu Stock API

## Giới thiệu

Chào mừng bạn đến với tài liệu API quản lý Stock (Mã chứng khoán) và StockPrice (Giá chứng khoán). Bộ tài liệu này cung cấp thông tin chi tiết về cách sử dụng và tích hợp API quản lý chứng khoán vào ứng dụng của bạn.

## Nội dung

Bộ tài liệu này bao gồm:

1. [**Stock API Documentation**](./stock-api.md) - Chi tiết về các endpoint API Stock, tham số, request/response format
2. [**StockPrice API Documentation**](./stock-price-api.md) - Chi tiết về các endpoint API StockPrice, tham số, request/response format
3. [**Module Structure**](./stock-module.md) - Cấu trúc module và cách nó hoạt động
4. [**Testing Guide**](./stock-api-testing.md) - Hướng dẫn sử dụng Postman để kiểm thử API
5. [**Financial Metrics API Documentation**](./financial-metrics-api.md) - Chi tiết về các endpoint API Financial Metrics, tham số, request/response format

## Đối tượng sử dụng

- **Developers**: Sử dụng API để tích hợp vào ứng dụng
- **Testers**: Kiểm thử các endpoint API
- **Admin**: Quản lý dữ liệu chứng khoán và giá chứng khoán

## Các tính năng chính

### Stock API
- Quản lý danh sách mã chứng khoán
- Lấy thông tin chi tiết mã chứng khoán
- Thêm, sửa, xóa mã chứng khoán (yêu cầu quyền Admin)
- Tìm kiếm và lọc dữ liệu chứng khoán

### StockPrice API
- Quản lý lịch sử giá của chứng khoán
- Xem giá theo ngày cụ thể
- Xem giá mới nhất của mã chứng khoán
- Thêm, sửa, xóa dữ liệu giá (yêu cầu quyền Admin)
- Nhập dữ liệu giá hàng loạt (yêu cầu quyền Admin)

## Bắt đầu nhanh

### Xem danh sách chứng khoán

```
GET /api/stocks?page=1&limit=10
```

### Xem chi tiết chứng khoán

```
GET /api/stocks/VNM
```

### Xem lịch sử giá của một chứng khoán

```
GET /api/stock-prices/symbol/VNM?startDate=2023-01-01&endDate=2023-01-31
```

### Xem giá mới nhất của một chứng khoán

```
GET /api/stock-prices/symbol/VNM/latest
```

### Tạo dữ liệu giá mới (yêu cầu quyền Admin)

```
POST /api/stock-prices
Content-Type: application/json
Authorization: Bearer <token>

{
  "symbol": "VNM",
  "date": "2023-02-16",
  "open": 83000,
  "high": 85000,
  "low": 82500,
  "close": 84500,
  "volume": 1700000
}
```

## Hỗ trợ

Nếu bạn có bất kỳ câu hỏi hoặc gặp vấn đề khi sử dụng API, vui lòng liên hệ team phát triển.

## Phiên bản

Phiên bản hiện tại: 1.1.0 