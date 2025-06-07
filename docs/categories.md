# API Danh mục (Categories)

API quản lý các danh mục trong hệ thống.

## 1. Lấy danh sách danh mục (phân trang)

**Request**

```
GET /api/categories
```

**Query Parameters**

| Tham số   | Kiểu dữ liệu | Mô tả                                                  |
| --------- | ------------ | ------------------------------------------------------ |
| page      | Number       | Số trang (mặc định: 1)                                 |
| limit     | Number       | Số lượng kết quả trên mỗi trang (mặc định: 10)         |
| sort      | String       | Trường để sắp xếp (mặc định: createdAt)                |
| order     | String       | Thứ tự sắp xếp: 'asc' hoặc 'desc' (mặc định: desc)     |
| search    | String       | Tìm kiếm theo tiêu đề, mô tả hoặc slug                 |
| parentId  | String       | Lọc theo danh mục cha (null: chỉ danh mục gốc)         |

**Response**

```json
{
  "message": "Lấy danh sách danh mục thành công.",
  "categories": [
    {
      "id": "uuid",
      "title": "Tên danh mục",
      "slug": "ten-danh-muc",
      "description": "Mô tả danh mục",
      "thumbnailId": 1,
      "parentId": null,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
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

## 2. Lấy cấu trúc cây danh mục

Lấy cấu trúc cây danh mục với danh mục cha và con trực tiếp.

**Request**

```
GET /api/categories/tree
```

**Response**

```json
{
  "message": "Lấy danh sách danh mục thành công.",
  "categories": [
    {
      "id": "uuid",
      "title": "Danh mục cha",
      "slug": "danh-muc-cha",
      "description": "Mô tả danh mục cha",
      "thumbnailId": 1,
      "parentId": null,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "children": [
        {
          "id": "uuid",
          "title": "Danh mục con",
          "slug": "danh-muc-con",
          "description": "Mô tả danh mục con",
          "thumbnailId": 2,
          "parentId": "uuid-của-danh-mục-cha",
          "createdAt": "2023-01-01T00:00:00.000Z",
          "updatedAt": "2023-01-01T00:00:00.000Z"
        }
      ]
    }
  ]
}
```

## 3. Lấy thông tin danh mục theo ID

**Request**

```
GET /api/categories/id/:id
```

**Response**

```json
{
  "message": "Lấy thông tin danh mục thành công.",
  "category": {
    "id": "uuid",
    "title": "Danh mục",
    "slug": "danh-muc",
    "description": "Mô tả danh mục",
    "thumbnailId": 1,
    "parentId": null,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "children": [
      {
        "id": "uuid",
        "title": "Danh mục con",
        "slug": "danh-muc-con",
        "description": "Mô tả danh mục con",
        "thumbnailId": 2,
        "parentId": "uuid-của-danh-mục-cha",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

## 4. Lấy thông tin danh mục theo slug

**Request**

```
GET /api/categories/slug/:slug
```

**Response**

```json
{
  "message": "Lấy thông tin danh mục thành công.",
  "category": {
    "id": "uuid",
    "title": "Danh mục",
    "slug": "danh-muc",
    "description": "Mô tả danh mục",
    "thumbnailId": 1,
    "parentId": null,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## 5. Tạo danh mục mới

Yêu cầu: Người dùng đã xác thực và có vai trò ADMIN hoặc AUTHOR

**Request**

```
POST /api/categories
```

**Headers**

```
Authorization: Bearer <access_token>
```

**Body**

```json
{
  "title": "Tên danh mục",
  "description": "Mô tả danh mục",
  "thumbnailId": 1,
  "parentId": "uuid-của-danh-mục-cha" // Tùy chọn
}
```

**Response**

```json
{
  "message": "Tạo danh mục mới thành công.",
  "category": {
    "id": "uuid",
    "title": "Tên danh mục",
    "slug": "ten-danh-muc",
    "description": "Mô tả danh mục",
    "thumbnailId": 1,
    "parentId": "uuid-của-danh-mục-cha",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## 6. Cập nhật danh mục

Yêu cầu: Người dùng đã xác thực và có vai trò ADMIN hoặc AUTHOR

**Request**

```
PUT /api/categories/:id
```

**Headers**

```
Authorization: Bearer <access_token>
```

**Body**

```json
{
  "title": "Tên danh mục mới",
  "description": "Mô tả danh mục mới",
  "thumbnailId": 2,
  "parentId": "uuid-của-danh-mục-cha" // Có thể dùng null để đặt làm danh mục gốc
}
```

**Response**

```json
{
  "message": "Cập nhật thông tin danh mục thành công.",
  "category": {
    "id": "uuid",
    "title": "Tên danh mục mới",
    "slug": "ten-danh-muc-moi",
    "description": "Mô tả danh mục mới",
    "thumbnailId": 2,
    "parentId": "uuid-của-danh-mục-cha",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## 7. Xóa danh mục

Yêu cầu: Người dùng đã xác thực và có vai trò ADMIN

**Request**

```
DELETE /api/categories/:id
```

**Headers**

```
Authorization: Bearer <access_token>
```

**Response**

```json
{
  "message": "Xóa danh mục thành công."
}
```

## Các trường hợp lỗi

| Mã lỗi | Thông báo                                                           |
| ------ | ------------------------------------------------------------------- |
| 400    | Thông tin danh mục không hợp lệ.                                    |
| 400    | Vui lòng điền đầy đủ thông tin cần thiết.                           |
| 400    | Slug này đã được sử dụng. Vui lòng sử dụng tiêu đề khác.            |
| 400    | Không thể đặt danh mục làm danh mục cha của chính nó.               |
| 400    | Danh mục này chứa các danh mục con. Vui lòng xóa các danh mục con trước. |
| 400    | Danh mục này chứa bài viết. Vui lòng xóa hoặc di chuyển các bài viết trước. |
| 404    | Không tìm thấy thông tin danh mục.                                  |
| 404    | Không tìm thấy danh mục cha.                                        |
| 403    | Bạn không có quyền thực hiện thao tác này.                          |
| 500    | Không thể lấy danh sách danh mục. Vui lòng thử lại sau.             |
| 500    | Không thể tạo danh mục mới. Vui lòng thử lại sau.                   |
| 500    | Không thể cập nhật thông tin danh mục. Vui lòng thử lại sau.        |
| 500    | Không thể xóa danh mục. Vui lòng thử lại sau.                       | 