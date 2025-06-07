# Stock and StockPrice Modules

## Tổng quan

### Stock Module
Module Stock được phát triển để quản lý dữ liệu về các mã chứng khoán. Module này bao gồm các thành phần cơ bản:

- **Controller**: Xử lý các HTTP request và response
- **Service**: Xử lý logic nghiệp vụ
- **Routes**: Định nghĩa các endpoint API
- **Models**: Định nghĩa cấu trúc dữ liệu (thông qua Prisma schema)

### StockPrice Module
Module StockPrice được phát triển để quản lý dữ liệu về giá chứng khoán theo thời gian. Module này bao gồm:

- **Controller**: Xử lý các HTTP request và response liên quan đến giá chứng khoán
- **Service**: Xử lý logic nghiệp vụ cho dữ liệu giá
- **Routes**: Định nghĩa các endpoint API cho quản lý giá
- **Models**: Sử dụng mô hình StockPrice từ Prisma schema

## Cấu trúc thư mục

```
src/
├── controllers/
│   ├── stock.controller.ts     # Xử lý request/response cho Stock
│   └── stockPrice.controller.ts # Xử lý request/response cho StockPrice
│
├── services/
│   ├── stock.service.ts        # Xử lý logic nghiệp vụ cho Stock
│   └── stockPrice.service.ts   # Xử lý logic nghiệp vụ cho StockPrice
│
├── routes/
│   ├── stock.ts                # Định nghĩa các endpoint cho Stock
│   └── stockPrice.ts           # Định nghĩa các endpoint cho StockPrice
│
├── utils/
│   ├── constants.ts            # Chứa các thông báo lỗi/thành công cho Stock
│   └── stockPrice.constants.ts # Chứa các thông báo lỗi/thành công cho StockPrice
│
└── prisma/
    └── schema.prisma           # Định nghĩa mô hình dữ liệu
```

## Mô hình dữ liệu

### Stock
Mô hình dữ liệu Stock bao gồm:

- **Stock**: Thông tin cơ bản về mã chứng khoán
- **StockProfile**: Thông tin hiện tại về giá, khối lượng, v.v.
- **FinancialMetrics**: Các chỉ số tài chính theo quý/năm

### StockPrice
Mô hình dữ liệu StockPrice bao gồm:

- **symbol**: Mã chứng khoán (liên kết với bảng Stock)
- **date**: Ngày giao dịch
- **open**: Giá mở cửa
- **high**: Giá cao nhất
- **low**: Giá thấp nhất
- **close**: Giá đóng cửa
- **volume**: Khối lượng giao dịch
- **trendQ**: Chỉ báo xu hướng (tùy chọn)
- **fq**: Chỉ số FQ (tùy chọn)
- **bandDown**: Dải dưới Bollinger Band (tùy chọn)
- **bandUp**: Dải trên Bollinger Band (tùy chọn)

## Tính năng chính

### Stock Module
1. **Quản lý danh sách chứng khoán**:
   - Xem danh sách với phân trang, tìm kiếm, lọc
   - Xem chi tiết thông tin của một mã chứng khoán

2. **Quản trị chứng khoán** (yêu cầu quyền Admin):
   - Thêm mã chứng khoán mới
   - Cập nhật thông tin chứng khoán
   - Xóa mã chứng khoán

### StockPrice Module
1. **Xem dữ liệu giá**:
   - Lấy lịch sử giá với phân trang và lọc theo thời gian
   - Xem giá theo ngày cụ thể
   - Xem giá mới nhất

2. **Quản lý dữ liệu giá** (yêu cầu quyền Admin):
   - Thêm dữ liệu giá mới
   - Cập nhật dữ liệu giá
   - Xóa dữ liệu giá
   - Nhập dữ liệu giá hàng loạt

## Quy trình hoạt động

1. **Request đến từ client** → Routes
2. Routes → **Controller** (xử lý request, validate dữ liệu)
3. Controller → **Service** (xử lý logic nghiệp vụ)
4. Service → **Prisma Client** (truy vấn database)
5. **Response trả về client** ← Controller

## Xác thực và Phân quyền

- Các endpoint GET không yêu cầu xác thực
- Các endpoint POST, PUT, DELETE yêu cầu JWT token và quyền Admin
- Sử dụng middleware `verifyToken` và `isAdmin` để kiểm tra

## Xử lý lỗi

Các module đã được xử lý các tình huống lỗi phổ biến:

### Stock Module
- Dữ liệu không hợp lệ
- Mã chứng khoán đã tồn tại
- Mã chứng khoán không tồn tại
- Lỗi server

### StockPrice Module
- Dữ liệu giá không hợp lệ
- Dữ liệu giá đã tồn tại cho ngày cụ thể
- Mã chứng khoán không tồn tại
- Dữ liệu giá không tồn tại cho ngày cụ thể
- Lỗi server

## Tích hợp giữa Stock và StockPrice

- StockPrice module kiểm tra sự tồn tại của mã chứng khoán trước khi thêm dữ liệu giá
- Dữ liệu giá được liên kết với Stock thông qua trường `symbol`
- Khi xóa một Stock, tất cả dữ liệu giá liên quan sẽ bị xóa theo (cascade delete)

## Mở rộng trong tương lai

Các module có thể được mở rộng với các tính năng:
- Biểu đồ phân tích kỹ thuật trực quan
- Tính toán các chỉ báo phân tích kỹ thuật phức tạp
- Import/Export dữ liệu từ các nguồn khác nhau
- Tự động cập nhật giá từ các nguồn dữ liệu thị trường
- Thiết lập cảnh báo khi giá đạt ngưỡng nhất định
- Phân tích tương quan giữa các mã chứng khoán 