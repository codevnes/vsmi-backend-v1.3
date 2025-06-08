# API Quản Lý Gói Cước

Tài liệu này mô tả chi tiết các API để quản lý gói cước và đăng ký gói cước trong hệ thống.

## Mục lục

1. [Quản lý gói cước](#quản-lý-gói-cước)
   - [Lấy danh sách gói cước](#lấy-danh-sách-gói-cước)
   - [Lấy thông tin chi tiết gói cước](#lấy-thông-tin-chi-tiết-gói-cước)
   - [Tạo gói cước mới](#tạo-gói-cước-mới)
   - [Cập nhật gói cước](#cập-nhật-gói-cước)
   - [Xóa gói cước](#xóa-gói-cước)

2. [Quản lý đăng ký gói cước](#quản-lý-đăng-ký-gói-cước)
   - [Lấy danh sách đăng ký](#lấy-danh-sách-đăng-ký)
   - [Lấy thông tin chi tiết đăng ký](#lấy-thông-tin-chi-tiết-đăng-ký)
   - [Lấy danh sách đăng ký theo người dùng](#lấy-danh-sách-đăng-ký-theo-người-dùng)
   - [Tạo đăng ký mới](#tạo-đăng-ký-mới)
   - [Cập nhật đăng ký](#cập-nhật-đăng-ký)
   - [Hủy đăng ký](#hủy-đăng-ký)

## Quản lý gói cước

### Lấy danh sách gói cước

Lấy tất cả các gói cước có trong hệ thống.

**URL:** `/subscription-plans`

**Phương thức:** `GET`

**Yêu cầu xác thực:** Không

**Tham số truy vấn:** Không

**Phản hồi thành công:**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Cơ Bản",
    "description": "Gói cước cơ bản với các tính năng tiêu chuẩn",
    "price": 100000,
    "durationDays": 30,
    "createdAt": "2023-04-01T08:00:00.000Z",
    "updatedAt": "2023-04-01T08:00:00.000Z",
    "symbols": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "planId": "550e8400-e29b-41d4-a716-446655440000",
        "symbol": "VNM",
        "createdAt": "2023-04-01T08:00:00.000Z",
        "stock": {
          "symbol": "VNM",
          "name": "Công ty Cổ phần Sữa Việt Nam"
        }
      }
    ]
  }
]
```

### Lấy thông tin chi tiết gói cước

Lấy thông tin chi tiết về một gói cước cụ thể theo ID.

**URL:** `/subscription-plans/:id`

**Phương thức:** `GET`

**Yêu cầu xác thực:** Không

**Tham số đường dẫn:**
- `id`: ID của gói cước cần xem

**Phản hồi thành công:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Cơ Bản",
  "description": "Gói cước cơ bản với các tính năng tiêu chuẩn",
  "price": 100000,
  "durationDays": 30,
  "createdAt": "2023-04-01T08:00:00.000Z",
  "updatedAt": "2023-04-01T08:00:00.000Z",
  "symbols": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "planId": "550e8400-e29b-41d4-a716-446655440000",
      "symbol": "VNM",
      "createdAt": "2023-04-01T08:00:00.000Z",
      "stock": {
        "symbol": "VNM",
        "name": "Công ty Cổ phần Sữa Việt Nam"
      }
    }
  ]
}
```

**Phản hồi lỗi:**

```json
{
  "error": "Subscription plan not found"
}
```

### Tạo gói cước mới

Tạo một gói cước mới trong hệ thống.

**URL:** `/subscription-plans`

**Phương thức:** `POST`

**Yêu cầu xác thực:** Có (Admin)

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "name": "Cao Cấp",
  "description": "Gói cước cao cấp với nhiều quyền lợi",
  "price": 300000,
  "durationDays": 90,
  "symbols": ["VNM", "VCB", "FPT"]
}
```

**Phản hồi thành công:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "name": "Cao Cấp",
  "description": "Gói cước cao cấp với nhiều quyền lợi",
  "price": 300000,
  "durationDays": 90,
  "createdAt": "2023-04-01T08:00:00.000Z",
  "updatedAt": "2023-04-01T08:00:00.000Z",
  "symbols": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "planId": "550e8400-e29b-41d4-a716-446655440002",
      "symbol": "VNM",
      "createdAt": "2023-04-01T08:00:00.000Z",
      "stock": {
        "symbol": "VNM",
        "name": "Công ty Cổ phần Sữa Việt Nam"
      }
    },
    // Các mã chứng khoán khác
  ]
}
```

**Phản hồi lỗi:**

```json
{
  "error": "Name, price, and duration days are required"
}
```

### Cập nhật gói cước

Cập nhật thông tin của một gói cước đã tồn tại.

**URL:** `/subscription-plans/:id`

**Phương thức:** `PUT`

**Yêu cầu xác thực:** Có (Admin)

**Headers:**
```
Authorization: Bearer <token>
```

**Tham số đường dẫn:**
- `id`: ID của gói cước cần cập nhật

**Body:**

```json
{
  "name": "Cao Cấp Plus",
  "description": "Gói cước cao cấp với nhiều quyền lợi hấp dẫn",
  "price": 350000,
  "durationDays": 90,
  "symbols": ["VNM", "VCB", "FPT", "VIC"]
}
```

**Phản hồi thành công:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "name": "Cao Cấp Plus",
  "description": "Gói cước cao cấp với nhiều quyền lợi hấp dẫn",
  "price": 350000,
  "durationDays": 90,
  "createdAt": "2023-04-01T08:00:00.000Z",
  "updatedAt": "2023-04-01T09:00:00.000Z",
  "symbols": [
    // Danh sách các mã chứng khoán
  ]
}
```

**Phản hồi lỗi:**

```json
{
  "error": "Subscription plan not found"
}
```

### Xóa gói cước

Xóa một gói cước khỏi hệ thống.

**URL:** `/subscription-plans/:id`

**Phương thức:** `DELETE`

**Yêu cầu xác thực:** Có (Admin)

**Headers:**
```
Authorization: Bearer <token>
```

**Tham số đường dẫn:**
- `id`: ID của gói cước cần xóa

**Phản hồi thành công:**

```json
{
  "message": "Subscription plan deleted successfully"
}
```

**Phản hồi lỗi:**

```json
{
  "error": "Subscription plan not found"
}
```

## Quản lý đăng ký gói cước

### Lấy danh sách đăng ký

Lấy tất cả các đăng ký gói cước trong hệ thống (chỉ dành cho Admin).

**URL:** `/subscriptions`

**Phương thức:** `GET`

**Yêu cầu xác thực:** Có (Admin)

**Headers:**
```
Authorization: Bearer <token>
```

**Phản hồi thành công:**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "userId": "550e8400-e29b-41d4-a716-446655440100",
    "planId": "550e8400-e29b-41d4-a716-446655440000",
    "startDate": "2023-04-01T08:00:00.000Z",
    "endDate": "2023-05-01T08:00:00.000Z",
    "status": "ACTIVE",
    "createdBy": "550e8400-e29b-41d4-a716-446655440100",
    "updatedBy": "550e8400-e29b-41d4-a716-446655440100",
    "createdAt": "2023-04-01T08:00:00.000Z",
    "updatedAt": "2023-04-01T08:00:00.000Z",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440100",
      "email": "user@example.com",
      "fullName": "Nguyễn Văn A"
    },
    "plan": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Cơ Bản",
      "description": "Gói cước cơ bản với các tính năng tiêu chuẩn",
      "price": 100000,
      "durationDays": 30,
      "createdAt": "2023-04-01T08:00:00.000Z",
      "updatedAt": "2023-04-01T08:00:00.000Z"
    }
  }
]
```

### Lấy thông tin chi tiết đăng ký

Lấy thông tin chi tiết về một đăng ký gói cước cụ thể.

**URL:** `/subscriptions/:id`

**Phương thức:** `GET`

**Yêu cầu xác thực:** Có

**Headers:**
```
Authorization: Bearer <token>
```

**Tham số đường dẫn:**
- `id`: ID của đăng ký cần xem

**Phản hồi thành công:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "userId": "550e8400-e29b-41d4-a716-446655440100",
  "planId": "550e8400-e29b-41d4-a716-446655440000",
  "startDate": "2023-04-01T08:00:00.000Z",
  "endDate": "2023-05-01T08:00:00.000Z",
  "status": "ACTIVE",
  "createdBy": "550e8400-e29b-41d4-a716-446655440100",
  "updatedBy": "550e8400-e29b-41d4-a716-446655440100",
  "createdAt": "2023-04-01T08:00:00.000Z",
  "updatedAt": "2023-04-01T08:00:00.000Z",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440100",
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A"
  },
  "plan": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Cơ Bản",
    "description": "Gói cước cơ bản với các tính năng tiêu chuẩn",
    "price": 100000,
    "durationDays": 30,
    "createdAt": "2023-04-01T08:00:00.000Z",
    "updatedAt": "2023-04-01T08:00:00.000Z"
  }
}
```

**Phản hồi lỗi:**

```json
{
  "error": "Subscription not found"
}
```

### Lấy danh sách đăng ký theo người dùng

Lấy tất cả các đăng ký gói cước của một người dùng cụ thể.

**URL:** `/subscriptions/user/:userId`

**Phương thức:** `GET`

**Yêu cầu xác thực:** Có

**Headers:**
```
Authorization: Bearer <token>
```

**Tham số đường dẫn:**
- `userId`: ID của người dùng cần xem đăng ký

**Phản hồi thành công:**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "userId": "550e8400-e29b-41d4-a716-446655440100",
    "planId": "550e8400-e29b-41d4-a716-446655440000",
    "startDate": "2023-04-01T08:00:00.000Z",
    "endDate": "2023-05-01T08:00:00.000Z",
    "status": "ACTIVE",
    "createdBy": "550e8400-e29b-41d4-a716-446655440100",
    "updatedBy": "550e8400-e29b-41d4-a716-446655440100",
    "createdAt": "2023-04-01T08:00:00.000Z",
    "updatedAt": "2023-04-01T08:00:00.000Z",
    "plan": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Cơ Bản",
      "description": "Gói cước cơ bản với các tính năng tiêu chuẩn",
      "price": 100000,
      "durationDays": 30,
      "createdAt": "2023-04-01T08:00:00.000Z",
      "updatedAt": "2023-04-01T08:00:00.000Z"
    }
  }
]
```

### Tạo đăng ký mới

Tạo một đăng ký gói cước mới cho người dùng.

**URL:** `/subscriptions`

**Phương thức:** `POST`

**Yêu cầu xác thực:** Có

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440100",
  "planId": "550e8400-e29b-41d4-a716-446655440000",
  "startDate": "2023-04-01T08:00:00.000Z"
}
```

**Phản hồi thành công:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "userId": "550e8400-e29b-41d4-a716-446655440100",
  "planId": "550e8400-e29b-41d4-a716-446655440000",
  "startDate": "2023-04-01T08:00:00.000Z",
  "endDate": "2023-05-01T08:00:00.000Z",
  "status": "ACTIVE",
  "createdBy": "550e8400-e29b-41d4-a716-446655440100",
  "updatedBy": "550e8400-e29b-41d4-a716-446655440100",
  "createdAt": "2023-04-01T08:00:00.000Z",
  "updatedAt": "2023-04-01T08:00:00.000Z",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440100",
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A"
  },
  "plan": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Cơ Bản",
    "description": "Gói cước cơ bản với các tính năng tiêu chuẩn",
    "price": 100000,
    "durationDays": 30,
    "createdAt": "2023-04-01T08:00:00.000Z",
    "updatedAt": "2023-04-01T08:00:00.000Z"
  }
}
```

**Phản hồi lỗi:**

```json
{
  "error": "User ID and Plan ID are required"
}
```

hoặc

```json
{
  "error": "User not found"
}
```

hoặc

```json
{
  "error": "Subscription plan not found"
}
```

### Cập nhật đăng ký

Cập nhật thông tin của một đăng ký gói cước.

**URL:** `/subscriptions/:id`

**Phương thức:** `PUT`

**Yêu cầu xác thực:** Có

**Headers:**
```
Authorization: Bearer <token>
```

**Tham số đường dẫn:**
- `id`: ID của đăng ký cần cập nhật

**Body:**

```json
{
  "planId": "550e8400-e29b-41d4-a716-446655440002",
  "endDate": "2023-07-01T08:00:00.000Z"
}
```

**Phản hồi thành công:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "userId": "550e8400-e29b-41d4-a716-446655440100",
  "planId": "550e8400-e29b-41d4-a716-446655440002",
  "startDate": "2023-04-01T08:00:00.000Z",
  "endDate": "2023-07-01T08:00:00.000Z",
  "status": "ACTIVE",
  "createdBy": "550e8400-e29b-41d4-a716-446655440100",
  "updatedBy": "550e8400-e29b-41d4-a716-446655440100",
  "createdAt": "2023-04-01T08:00:00.000Z",
  "updatedAt": "2023-04-01T10:00:00.000Z",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440100",
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A"
  },
  "plan": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "name": "Cao Cấp",
    "description": "Gói cước cao cấp với nhiều quyền lợi",
    "price": 300000,
    "durationDays": 90,
    "createdAt": "2023-04-01T08:00:00.000Z",
    "updatedAt": "2023-04-01T08:00:00.000Z"
  }
}
```

**Phản hồi lỗi:**

```json
{
  "error": "Subscription not found"
}
```

hoặc

```json
{
  "error": "Subscription plan not found"
}
```

### Hủy đăng ký

Hủy một đăng ký gói cước đang hoạt động.

**URL:** `/subscriptions/:id/cancel`

**Phương thức:** `PATCH`

**Yêu cầu xác thực:** Có

**Headers:**
```
Authorization: Bearer <token>
```

**Tham số đường dẫn:**
- `id`: ID của đăng ký cần hủy

**Phản hồi thành công:**

```json
{
  "message": "Subscription cancelled successfully",
  "subscription": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "userId": "550e8400-e29b-41d4-a716-446655440100",
    "planId": "550e8400-e29b-41d4-a716-446655440000",
    "startDate": "2023-04-01T08:00:00.000Z",
    "endDate": "2023-05-01T08:00:00.000Z",
    "status": "CANCELLED",
    "createdBy": "550e8400-e29b-41d4-a716-446655440100",
    "updatedBy": "550e8400-e29b-41d4-a716-446655440100",
    "createdAt": "2023-04-01T08:00:00.000Z",
    "updatedAt": "2023-04-01T11:00:00.000Z"
  }
}
```

**Phản hồi lỗi:**

```json
{
  "error": "Subscription not found"
}
``` 