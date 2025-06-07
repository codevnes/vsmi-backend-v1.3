# Hướng dẫn test Stock API với Postman

Tài liệu này hướng dẫn cách sử dụng Postman để kiểm thử các API quản lý chứng khoán.

## Chuẩn bị

1. Cài đặt [Postman](https://www.postman.com/downloads/)
2. Chạy server API:
   ```
   pnpm run dev
   ```

## Các bước cơ bản

### 1. Thiết lập môi trường

Tạo một environment trong Postman với các biến:

- `BASE_URL`: `http://localhost:3000/api`
- `TOKEN`: [Lấy token sau khi đăng nhập]

### 2. Tạo collection

Tạo một collection mới với tên "Stock API" để nhóm các request liên quan.

### 3. Đăng nhập để lấy token

Trước khi thực hiện các thao tác POST, PUT, DELETE, bạn cần đăng nhập và lấy token:

**Request**:
- Method: POST
- URL: `{{BASE_URL}}/auth/login`
- Body (JSON):
  ```json
  {
    "email": "admin@example.com",
    "password": "your_password"
  }
  ```

**Lưu token**:
1. Trong tab "Tests", thêm đoạn code:
   ```javascript
   var jsonData = pm.response.json();
   pm.environment.set("TOKEN", jsonData.token);
   ```
2. Sau khi gửi request thành công, token sẽ được lưu vào biến môi trường

## Test các API Stock

### 1. Lấy danh sách chứng khoán

**Request**:
- Method: GET
- URL: `{{BASE_URL}}/stocks?page=1&limit=10`
- Headers: Không cần token

**Các tham số có thể thêm**:
- `search`: Tìm kiếm theo tên hoặc mã
- `exchange`: Lọc theo sàn
- `industry`: Lọc theo ngành

### 2. Lấy thông tin chi tiết chứng khoán

**Request**:
- Method: GET
- URL: `{{BASE_URL}}/stocks/VNM` (thay VNM bằng mã chứng khoán thực tế)
- Headers: Không cần token

### 3. Tạo mã chứng khoán mới

**Request**:
- Method: POST
- URL: `{{BASE_URL}}/stocks`
- Headers:
  - Key: `Authorization`
  - Value: `Bearer {{TOKEN}}`
- Body (JSON):
  ```json
  {
    "symbol": "ABC",
    "name": "Công ty ABC",
    "exchange": "HOSE",
    "industry": "Công nghệ",
    "description": "Mô tả về công ty ABC"
  }
  ```

### 4. Cập nhật thông tin chứng khoán

**Request**:
- Method: PUT
- URL: `{{BASE_URL}}/stocks/ABC` (thay ABC bằng mã chứng khoán thực tế)
- Headers:
  - Key: `Authorization`
  - Value: `Bearer {{TOKEN}}`
- Body (JSON):
  ```json
  {
    "name": "Tên công ty đã cập nhật",
    "exchange": "HNX",
    "industry": "Ngân hàng",
    "description": "Mô tả mới về công ty"
  }
  ```

### 5. Xóa chứng khoán

**Request**:
- Method: DELETE
- URL: `{{BASE_URL}}/stocks/ABC` (thay ABC bằng mã chứng khoán thực tế)
- Headers:
  - Key: `Authorization`
  - Value: `Bearer {{TOKEN}}`

## Test các trường hợp lỗi

### 1. Tạo chứng khoán trùng mã

**Request**:
- Method: POST
- URL: `{{BASE_URL}}/stocks`
- Headers: Authorization với token
- Body: Gửi với symbol đã tồn tại
- Kết quả mong đợi: Status 409 Conflict

### 2. Truy cập chứng khoán không tồn tại

**Request**:
- Method: GET
- URL: `{{BASE_URL}}/stocks/INVALID`
- Kết quả mong đợi: Status 404 Not Found

### 3. Cập nhật không có quyền

**Request**:
- Method: PUT
- URL: `{{BASE_URL}}/stocks/ABC`
- Headers: Không có token hoặc token không phải admin
- Kết quả mong đợi: Status 401 Unauthorized hoặc 403 Forbidden

## Kiểm tra kết quả

Khi thực hiện các request, kiểm tra:
1. Status code có đúng như mong đợi không
2. Response body có đúng định dạng không
3. Dữ liệu trong response có chính xác không

## Tạo Collection Runner

Bạn có thể tạo một collection runner để chạy tự động các test case:
1. Tạo một folder trong collection cho mỗi nhóm test case
2. Trong tab "Tests" của mỗi request, thêm đoạn code kiểm tra kết quả
3. Sử dụng Collection Runner để chạy toàn bộ các test case 