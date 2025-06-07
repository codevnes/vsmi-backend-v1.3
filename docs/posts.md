# API Quản lý Bài viết

API quản lý bài viết cho phép thực hiện các thao tác CRUD (Create, Read, Update, Delete) đối với bài viết trong hệ thống.

## Base URL

```
/api/posts
```

## Các API Endpoints

### 1. Lấy danh sách bài viết

Lấy danh sách bài viết với phân trang và tìm kiếm.

**Request**

```
GET /api/posts
```

**Query Parameters**

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| page | Number | Trang hiện tại (mặc định: 1) |
| limit | Number | Số lượng bài viết trên mỗi trang (mặc định: 10, tối đa: 100) |
| sort | String | Trường để sắp xếp (mặc định: createdAt) |
| order | String | Thứ tự sắp xếp: 'asc' hoặc 'desc' (mặc định: desc) |
| search | String | Từ khóa tìm kiếm trong tiêu đề, mô tả và nội dung |
| categoryId | String | Lọc theo ID danh mục |
| symbol | String | Lọc theo mã cổ phiếu |
| userId | String | Lọc theo ID người dùng |
| isPremium | Boolean | Lọc bài viết premium (true) hoặc không premium (false) |

**Response**

```json
{
  "message": "Lấy danh sách bài viết thành công.",
  "posts": [
    {
      "id": "uuid",
      "title": "Tiêu đề bài viết",
      "slug": "tieu-de-bai-viet",
      "description": "Mô tả ngắn về bài viết",
      "thumbnail": {
        "id": 1,
        "url": "/images/thumbnail.jpg"
      },
      "categoryId": "uuid",
      "category": {
        "id": "uuid",
        "title": "Danh mục",
        "slug": "danh-muc"
      },
      "symbol": "VNM",
      "stock": {
        "symbol": "VNM",
        "name": "Công ty Cổ phần Sữa Việt Nam"
      },
      "author": {
        "id": "uuid",
        "fullName": "Nguyễn Văn A"
      },
      "isPremium": false,
      "createdAt": "2023-06-01T10:00:00.000Z",
      "updatedAt": "2023-06-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 2. Lấy thông tin bài viết theo ID

**Request**

```
GET /api/posts/:id
```

**Path Parameters**

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| id | String | ID của bài viết |

**Response**

```json
{
  "message": "Lấy thông tin bài viết thành công.",
  "post": {
    "id": "uuid",
    "title": "Tiêu đề bài viết",
    "slug": "tieu-de-bai-viet",
    "description": "Mô tả ngắn về bài viết",
    "content": "Nội dung chi tiết của bài viết...",
    "thumbnail": {
      "id": 1,
      "url": "/images/thumbnail.jpg"
    },
    "categoryId": "uuid",
    "category": {
      "id": "uuid",
      "title": "Danh mục",
      "slug": "danh-muc"
    },
    "symbol": "VNM",
    "stock": {
      "symbol": "VNM",
      "name": "Công ty Cổ phần Sữa Việt Nam"
    },
    "author": {
      "id": "uuid",
      "fullName": "Nguyễn Văn A"
    },
    "isPremium": false,
    "createdAt": "2023-06-01T10:00:00.000Z",
    "updatedAt": "2023-06-01T10:00:00.000Z"
  }
}
```

### 3. Lấy thông tin bài viết theo slug

**Request**

```
GET /api/posts/slug/:slug
```

**Path Parameters**

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| slug | String | Slug của bài viết |

**Response**

```json
{
  "message": "Lấy thông tin bài viết thành công.",
  "post": {
    "id": "uuid",
    "title": "Tiêu đề bài viết",
    "slug": "tieu-de-bai-viet",
    "description": "Mô tả ngắn về bài viết",
    "content": "Nội dung chi tiết của bài viết...",
    "thumbnail": {
      "id": 1,
      "url": "/images/thumbnail.jpg"
    },
    "categoryId": "uuid",
    "category": {
      "id": "uuid",
      "title": "Danh mục",
      "slug": "danh-muc"
    },
    "symbol": "VNM",
    "stock": {
      "symbol": "VNM",
      "name": "Công ty Cổ phần Sữa Việt Nam"
    },
    "author": {
      "id": "uuid",
      "fullName": "Nguyễn Văn A"
    },
    "isPremium": false,
    "createdAt": "2023-06-01T10:00:00.000Z",
    "updatedAt": "2023-06-01T10:00:00.000Z"
  }
}
```

### 4. Tạo bài viết mới

Yêu cầu xác thực: **Có**

**Request**

```
POST /api/posts
```

**Headers**

```
Authorization: Bearer <token>
```

**Request Body**

```json
{
  "title": "Tiêu đề bài viết",
  "description": "Mô tả ngắn về bài viết",
  "content": "Nội dung chi tiết của bài viết...",
  "thumbnailId": 1,
  "categoryId": "uuid",
  "symbol": "VNM",
  "isPremium": false
}
```

**Response**

```json
{
  "message": "Tạo bài viết mới thành công.",
  "post": {
    "id": "uuid",
    "title": "Tiêu đề bài viết",
    "slug": "tieu-de-bai-viet",
    "description": "Mô tả ngắn về bài viết",
    "content": "Nội dung chi tiết của bài viết...",
    "thumbnail": {
      "id": 1,
      "url": "/images/thumbnail.jpg"
    },
    "categoryId": "uuid",
    "category": {
      "id": "uuid",
      "title": "Danh mục",
      "slug": "danh-muc"
    },
    "symbol": "VNM",
    "stock": {
      "symbol": "VNM",
      "name": "Công ty Cổ phần Sữa Việt Nam"
    },
    "author": {
      "id": "uuid",
      "fullName": "Nguyễn Văn A"
    },
    "isPremium": false,
    "createdAt": "2023-06-01T10:00:00.000Z",
    "updatedAt": "2023-06-01T10:00:00.000Z"
  }
}
```

### 5. Cập nhật bài viết

Yêu cầu xác thực: **Có** (Người viết hoặc Admin)

**Request**

```
PUT /api/posts/:id
```

**Headers**

```
Authorization: Bearer <token>
```

**Path Parameters**

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| id | String | ID của bài viết |

**Request Body**

```json
{
  "title": "Tiêu đề bài viết đã cập nhật",
  "description": "Mô tả ngắn đã cập nhật",
  "content": "Nội dung chi tiết đã cập nhật...",
  "thumbnailId": 2,
  "categoryId": "uuid",
  "symbol": "VNM",
  "isPremium": true
}
```

**Response**

```json
{
  "message": "Cập nhật thông tin bài viết thành công.",
  "post": {
    "id": "uuid",
    "title": "Tiêu đề bài viết đã cập nhật",
    "slug": "tieu-de-bai-viet-da-cap-nhat",
    "description": "Mô tả ngắn đã cập nhật",
    "content": "Nội dung chi tiết đã cập nhật...",
    "thumbnail": {
      "id": 2,
      "url": "/images/new-thumbnail.jpg"
    },
    "categoryId": "uuid",
    "category": {
      "id": "uuid",
      "title": "Danh mục",
      "slug": "danh-muc"
    },
    "symbol": "VNM",
    "stock": {
      "symbol": "VNM",
      "name": "Công ty Cổ phần Sữa Việt Nam"
    },
    "author": {
      "id": "uuid",
      "fullName": "Nguyễn Văn A"
    },
    "isPremium": true,
    "createdAt": "2023-06-01T10:00:00.000Z",
    "updatedAt": "2023-06-01T11:00:00.000Z"
  }
}
```

### 6. Xóa mềm bài viết

Yêu cầu xác thực: **Có** (Người viết hoặc Admin)

**Request**

```
DELETE /api/posts/:id
```

**Headers**

```
Authorization: Bearer <token>
```

**Path Parameters**

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| id | String | ID của bài viết |

**Response**

```json
{
  "message": "Xóa bài viết thành công."
}
```

### 7. Khôi phục bài viết đã xóa

Yêu cầu xác thực: **Có** (Chỉ Admin)

**Request**

```
PUT /api/posts/restore/:id
```

**Headers**

```
Authorization: Bearer <token>
```

**Path Parameters**

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| id | String | ID của bài viết |

**Response**

```json
{
  "message": "Cập nhật thông tin bài viết thành công.",
  "post": {
    "id": "uuid",
    "title": "Tiêu đề bài viết",
    "slug": "tieu-de-bai-viet",
    "description": "Mô tả ngắn về bài viết",
    "content": "Nội dung chi tiết của bài viết...",
    "thumbnail": {
      "id": 1,
      "url": "/images/thumbnail.jpg"
    },
    "categoryId": "uuid",
    "category": {
      "id": "uuid",
      "title": "Danh mục",
      "slug": "danh-muc"
    },
    "symbol": "VNM",
    "stock": {
      "symbol": "VNM",
      "name": "Công ty Cổ phần Sữa Việt Nam"
    },
    "author": {
      "id": "uuid",
      "fullName": "Nguyễn Văn A"
    },
    "isPremium": false,
    "createdAt": "2023-06-01T10:00:00.000Z",
    "updatedAt": "2023-06-01T12:00:00.000Z"
  }
}
```

### 8. Xóa vĩnh viễn bài viết

Yêu cầu xác thực: **Có** (Chỉ Admin)

**Request**

```
DELETE /api/posts/permanent/:id
```

**Headers**

```
Authorization: Bearer <token>
```

**Path Parameters**

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| id | String | ID của bài viết |

**Response**

```json
{
  "message": "Xóa bài viết thành công."
}
```

## Mã lỗi

| Mã lỗi | Mô tả |
| --- | --- |
| 400 | Dữ liệu không hợp lệ hoặc thiếu thông tin bắt buộc |
| 401 | Không có quyền truy cập (chưa xác thực) |
| 403 | Không có quyền thực hiện hành động này |
| 404 | Không tìm thấy bài viết |
| 500 | Lỗi server | 