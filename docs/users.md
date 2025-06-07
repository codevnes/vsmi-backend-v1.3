# API Quản lý Người dùng (Users API)

API quản lý người dùng cho hệ thống VSMI-Backend. API này chỉ dành cho quản trị viên (ADMIN).

## Yêu cầu xác thực

Tất cả các endpoints trong Users API đều yêu cầu:

- Header `Authorization: Bearer <token>` với token hợp lệ
- Người dùng phải có quyền ADMIN

## Endpoints

### 1. Lấy danh sách người dùng

Lấy danh sách tất cả người dùng trong hệ thống với hỗ trợ phân trang.

- **URL**: `/api/users`
- **Method**: `GET`
- **Quyền truy cập**: Admin
- **Tham số Query**:
  - `page`: Số trang (mặc định: 1)
  - `limit`: Số lượng người dùng trên mỗi trang (mặc định: 10)
  - `sort`: Trường để sắp xếp (mặc định: createdAt)
  - `order`: Thứ tự sắp xếp (mặc định: desc)
  - `search`: Tìm kiếm theo tên hoặc email
  - `role`: Lọc theo vai trò (USER, ADMIN)
  - `verified`: Lọc theo trạng thái xác thực (true, false)
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
        {
          "id": "uuid-2",
          "email": "admin@example.com",
          "fullName": "Quản Trị Viên",
          "phone": "0987654321",
          "role": "ADMIN",
          "verified": true,
          "createdAt": "2023-01-01T00:00:00.000Z",
          "updatedAt": "2023-01-01T00:00:00.000Z"
        }
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

- **Error Responses**:
  - **Mã**: 400 Bad Request
    ```json
    {
      "message": "Tham số phân trang không hợp lệ."
    }
    ```
  
  - **Mã**: 401 Unauthorized
    ```json
    {
      "message": "Bạn chưa đăng nhập."
    }
    ```
  
  - **Mã**: 403 Forbidden
    ```json
    {
      "message": "Bạn không có quyền thực hiện thao tác này."
    }
    ```
  
  - **Mã**: 500 Internal Server Error
    ```json
    {
      "message": "Không thể lấy danh sách người dùng. Vui lòng thử lại sau."
    }
    ```

### 2. Lấy thông tin người dùng theo ID

Lấy thông tin chi tiết của một người dùng cụ thể.

- **URL**: `/api/users/:id`
- **Method**: `GET`
- **Quyền truy cập**: Admin
- **URL Params**: `id` - ID của người dùng
- **Request Headers**:
  ```
  Authorization: Bearer <token>
  ```

- **Success Response**:
  - **Mã**: 200 OK
  - **Nội dung**:
    ```json
    {
      "message": "Lấy thông tin người dùng thành công.",
      "user": {
        "id": "uuid-1",
        "email": "user1@example.com",
        "fullName": "Người Dùng 1",
        "phone": "0123456789",
        "role": "USER",
        "verified": false,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    }
    ```

- **Error Responses**:
  - **Mã**: 401 Unauthorized
    ```json
    {
      "message": "Bạn chưa đăng nhập."
    }
    ```
  
  - **Mã**: 403 Forbidden
    ```json
    {
      "message": "Bạn không có quyền thực hiện thao tác này."
    }
    ```
  
  - **Mã**: 404 Not Found
    ```json
    {
      "message": "Không tìm thấy thông tin người dùng."
    }
    ```
  
  - **Mã**: 500 Internal Server Error
    ```json
    {
      "message": "Không thể lấy thông tin người dùng. Vui lòng thử lại sau."
    }
    ```

### 3. Tạo người dùng mới

Tạo một người dùng mới trong hệ thống.

- **URL**: `/api/users`
- **Method**: `POST`
- **Quyền truy cập**: Admin
- **Request Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```

- **Request Body**:
  ```json
  {
    "email": "newuser@example.com",
    "password": "password123",
    "fullName": "Người Dùng Mới",
    "phone": "0123456789",
    "role": "USER"  // Tùy chọn: USER hoặc ADMIN
  }
  ```

- **Success Response**:
  - **Mã**: 201 Created
  - **Nội dung**:
    ```json
    {
      "message": "Tạo người dùng mới thành công.",
      "user": {
        "id": "uuid-new",
        "email": "newuser@example.com",
        "fullName": "Người Dùng Mới",
        "phone": "0123456789",
        "role": "USER",
        "verified": false,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    }
    ```

- **Error Responses**:
  - **Mã**: 400 Bad Request
    ```json
    {
      "message": "Email này đã được sử dụng. Vui lòng chọn email khác."
    }
    ```
    hoặc
    ```json
    {
      "message": "Vui lòng điền đầy đủ thông tin cần thiết."
    }
    ```
    hoặc
    ```json
    {
      "message": "Thông tin người dùng không hợp lệ."
    }
    ```
  
  - **Mã**: 401 Unauthorized
    ```json
    {
      "message": "Bạn chưa đăng nhập."
    }
    ```
  
  - **Mã**: 403 Forbidden
    ```json
    {
      "message": "Bạn không có quyền thực hiện thao tác này."
    }
    ```
  
  - **Mã**: 500 Internal Server Error
    ```json
    {
      "message": "Không thể tạo người dùng mới. Vui lòng thử lại sau."
    }
    ```

### 4. Cập nhật thông tin người dùng

Cập nhật thông tin của một người dùng hiện có.

- **URL**: `/api/users/:id`
- **Method**: `PUT`
- **Quyền truy cập**: Admin
- **URL Params**: `id` - ID của người dùng cần cập nhật
- **Request Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```

- **Request Body**:
  ```json
  {
    "fullName": "Tên Người Dùng Đã Cập Nhật",
    "phone": "0987654321",
    "password": "newpassword123",  // Tùy chọn
    "role": "ADMIN"  // Tùy chọn
  }
  ```

- **Success Response**:
  - **Mã**: 200 OK
  - **Nội dung**:
    ```json
    {
      "message": "Cập nhật thông tin người dùng thành công.",
      "user": {
        "id": "uuid-1",
        "email": "user1@example.com",
        "fullName": "Tên Người Dùng Đã Cập Nhật",
        "phone": "0987654321",
        "role": "ADMIN",
        "verified": false,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    }
    ```

- **Error Responses**:
  - **Mã**: 400 Bad Request
    ```json
    {
      "message": "Thông tin người dùng không hợp lệ."
    }
    ```
  
  - **Mã**: 401 Unauthorized
    ```json
    {
      "message": "Bạn chưa đăng nhập."
    }
    ```
  
  - **Mã**: 403 Forbidden
    ```json
    {
      "message": "Bạn không có quyền thực hiện thao tác này."
    }
    ```
  
  - **Mã**: 404 Not Found
    ```json
    {
      "message": "Không tìm thấy thông tin người dùng."
    }
    ```
  
  - **Mã**: 500 Internal Server Error
    ```json
    {
      "message": "Không thể cập nhật thông tin người dùng. Vui lòng thử lại sau."
    }
    ```

### 5. Xóa người dùng

Xóa một người dùng khỏi hệ thống (xóa mềm - soft delete).

- **URL**: `/api/users/:id`
- **Method**: `DELETE`
- **Quyền truy cập**: Admin
- **URL Params**: `id` - ID của người dùng cần xóa
- **Request Headers**:
  ```
  Authorization: Bearer <token>
  ```

- **Success Response**:
  - **Mã**: 200 OK
  - **Nội dung**:
    ```json
    {
      "message": "Xóa người dùng thành công."
    }
    ```

- **Error Responses**:
  - **Mã**: 400 Bad Request
    ```json
    {
      "message": "Bạn không thể xóa tài khoản của chính mình."
    }
    ```
  
  - **Mã**: 401 Unauthorized
    ```json
    {
      "message": "Bạn chưa đăng nhập."
    }
    ```
  
  - **Mã**: 403 Forbidden
    ```json
    {
      "message": "Bạn không có quyền thực hiện thao tác này."
    }
    ```
  
  - **Mã**: 404 Not Found
    ```json
    {
      "message": "Không tìm thấy thông tin người dùng."
    }
    ```
  
  - **Mã**: 500 Internal Server Error
    ```json
    {
      "message": "Không thể xóa người dùng. Vui lòng thử lại sau."
    }
    ```

## Mã lỗi và thông báo

| Mã | Nội dung | Mô tả |
| --- | --- | --- |
| 200 | OK | Yêu cầu thành công |
| 201 | Created | Đã tạo tài nguyên mới thành công |
| 400 | Bad Request | Yêu cầu không hợp lệ |
| 401 | Unauthorized | Chưa xác thực hoặc xác thực không hợp lệ |
| 403 | Forbidden | Không có quyền truy cập |
| 404 | Not Found | Không tìm thấy tài nguyên |
| 500 | Internal Server Error | Lỗi máy chủ nội bộ |

## Ví dụ sử dụng

### Lấy danh sách người dùng với phân trang

```bash
curl -X GET \
  'http://localhost:3000/api/users?page=1&limit=20&sort=fullName&order=asc&search=nguyen&role=USER' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json'
```

### Tạo người dùng mới

```bash
curl -X POST \
  http://localhost:3000/api/users \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "fullName": "Người Dùng Mới",
    "phone": "0123456789",
    "role": "USER"
}'
``` 