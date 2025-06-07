# API Xác thực (Authentication API)

API xác thực cho hệ thống VSMI-Backend.

## Endpoints

### 1. Đăng ký tài khoản

Đăng ký người dùng mới trong hệ thống.

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Request Headers**:
  ```
  Content-Type: application/json
  ```

- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "fullName": "Tên Người Dùng",
    "phone": "0123456789" // Tùy chọn
  }
  ```

- **Success Response**:
  - **Mã**: 201 Created
  - **Nội dung**:
    ```json
    {
      "message": "Đăng ký tài khoản thành công!",
      "user": {
        "id": "uuid",
        "email": "user@example.com",
        "fullName": "Tên Người Dùng",
        "role": "USER"
      },
      "token": "jwt_token"
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
      "message": "Email không hợp lệ."
    }
    ```
    hoặc
    ```json
    {
      "message": "Mật khẩu phải có ít nhất 6 ký tự."
    }
    ```
  
  - **Mã**: 500 Internal Server Error
    ```json
    {
      "message": "Đăng ký thất bại. Vui lòng thử lại sau."
    }
    ```

### 2. Đăng nhập

Đăng nhập và lấy JWT token.

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Request Headers**:
  ```
  Content-Type: application/json
  ```

- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **Success Response**:
  - **Mã**: 200 OK
  - **Nội dung**:
    ```json
    {
      "message": "Đăng nhập thành công!",
      "user": {
        "id": "uuid",
        "email": "user@example.com",
        "fullName": "Tên Người Dùng",
        "role": "USER"
      },
      "token": "jwt_token",
      "refreshToken": "refresh_token"
    }
    ```

- **Error Responses**:
  - **Mã**: 400 Bad Request
    ```json
    {
      "message": "Vui lòng nhập email và mật khẩu."
    }
    ```
  
  - **Mã**: 401 Unauthorized
    ```json
    {
      "message": "Mật khẩu không đúng."
    }
    ```
  
  - **Mã**: 404 Not Found
    ```json
    {
      "message": "Tài khoản không tồn tại."
    }
    ```
  
  - **Mã**: 500 Internal Server Error
    ```json
    {
      "message": "Đăng nhập thất bại. Vui lòng thử lại sau."
    }
    ```

### 3. Làm mới token

Làm mới JWT token khi token cũ hết hạn.

- **URL**: `/api/auth/refresh-token`
- **Method**: `POST`
- **Request Headers**:
  ```
  Content-Type: application/json
  ```

- **Request Body**:
  ```json
  {
    "refreshToken": "refresh_token"
  }
  ```

- **Success Response**:
  - **Mã**: 200 OK
  - **Nội dung**:
    ```json
    {
      "message": "Làm mới token thành công.",
      "token": "new_jwt_token"
    }
    ```

- **Error Responses**:
  - **Mã**: 400 Bad Request
    ```json
    {
      "message": "Thiếu token làm mới."
    }
    ```
  
  - **Mã**: 401 Unauthorized
    ```json
    {
      "message": "Token làm mới không hợp lệ hoặc đã hết hạn."
    }
    ```
  
  - **Mã**: 404 Not Found
    ```json
    {
      "message": "Không tìm thấy người dùng."
    }
    ```
  
  - **Mã**: 500 Internal Server Error
    ```json
    {
      "message": "Đã xảy ra lỗi! Vui lòng thử lại sau."
    }
    ```

### 4. Lấy thông tin người dùng

Lấy thông tin của người dùng đã đăng nhập.

- **URL**: `/api/auth/profile`
- **Method**: `GET`
- **Request Headers**:
  ```
  Authorization: Bearer jwt_token
  ```

- **Success Response**:
  - **Mã**: 200 OK
  - **Nội dung**:
    ```json
    {
      "message": "Lấy thông tin người dùng thành công.",
      "user": {
        "id": "uuid",
        "email": "user@example.com",
        "fullName": "Tên Người Dùng",
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
    hoặc
    ```json
    {
      "message": "Token đã hết hạn hoặc không hợp lệ."
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

## Xác thực và phân quyền

### Cấu trúc JWT Token

JWT Token được tạo ra khi người dùng đăng nhập thành công, có cấu trúc payload như sau:

```json
{
  "id": "user_uuid",
  "role": "USER",
  "iat": 1701234567,
  "exp": 1701320967
}
```

- `id`: ID của người dùng
- `role`: Vai trò của người dùng (USER hoặc ADMIN)
- `iat`: Thời điểm token được tạo (issued at)
- `exp`: Thời điểm token hết hạn (expiration)

### Sử dụng token trong các API calls khác

Để sử dụng các API được bảo vệ, thêm header `Authorization` với token JWT:

```
Authorization: Bearer <jwt_token>
```

### Thời hạn token

- **Access token**: 24 giờ
- **Refresh token**: 7 ngày

## Ví dụ sử dụng

### Đăng ký tài khoản

```bash
curl -X POST \
  http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "Tên Người Dùng",
    "phone": "0123456789"
}'
```

### Đăng nhập

```bash
curl -X POST \
  http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "password": "password123"
}'
```

### Lấy thông tin người dùng

```bash
curl -X GET \
  http://localhost:3000/api/auth/profile \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

## Phát triển (Development)

1. Cài đặt các dependencies:
   ```
   pnpm install
   ```

2. Thiết lập biến môi trường:
   Tạo file `.env` trong thư mục gốc với các biến sau:
   ```
   PORT=3000
   DATABASE_URL="postgresql://username:password@localhost:5432/vsmi?schema=public"
   JWT_SECRET="your-secret-key"
   ```

3. Tạo Prisma client:
   ```
   pnpm run prisma:generate
   ```

4. Khởi động server phát triển:
   ```
   pnpm run dev
   ```

## Các lệnh (Scripts)

- `pnpm run dev` - Khởi động server phát triển với chức năng hot reload
- `pnpm run build` - Build cho production
- `pnpm run start` - Khởi động server production
- `pnpm run prisma:generate` - Tạo Prisma client
- `pnpm run prisma:studio` - Mở Prisma Studio 