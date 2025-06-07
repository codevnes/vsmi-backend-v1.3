# API Hình ảnh (Images)

API quản lý hình ảnh trong hệ thống.

## 1. Lấy danh sách hình ảnh (phân trang)

**Request**

```
GET /api/images
```

**Query Parameters**

| Tham số   | Kiểu dữ liệu | Mô tả                                                  |
| --------- | ------------ | ------------------------------------------------------ |
| page      | Number       | Số trang (mặc định: 1)                                 |
| limit     | Number       | Số lượng kết quả trên mỗi trang (mặc định: 10)         |
| sort      | String       | Trường để sắp xếp (mặc định: createdAt)                |
| order     | String       | Thứ tự sắp xếp: 'asc' hoặc 'desc' (mặc định: desc)     |
| search    | String       | Tìm kiếm theo tên file hoặc alt text                   |

**Response**

```json
{
  "message": "Lấy danh sách hình ảnh thành công.",
  "images": [
    {
      "id": 1,
      "url": "http://localhost:3000/images/processed-1623456789-abcdef.jpg",
      "altText": "Mô tả hình ảnh",
      "width": 1200,
      "height": 800,
      "createdAt": "2023-01-01T00:00:00.000Z"
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

## 2. Lấy thông tin hình ảnh theo ID

**Request**

```
GET /api/images/:id
```

**Response**

```json
{
  "message": "Lấy thông tin hình ảnh thành công.",
  "image": {
    "id": 1,
    "url": "http://localhost:3000/images/processed-1623456789-abcdef.jpg",
    "altText": "Mô tả hình ảnh",
    "width": 1200,
    "height": 800,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## 3. Upload hình ảnh mới

Yêu cầu: Người dùng đã xác thực và có vai trò ADMIN hoặc AUTHOR

**Request**

```
POST /api/images
```

**Headers**

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data**

| Tham số | Kiểu dữ liệu | Mô tả                          |
| ------- | ------------ | ------------------------------ |
| image   | File         | File hình ảnh                  |
| altText | String       | Mô tả hình ảnh (không bắt buộc)|

**Response**

```json
{
  "message": "Tải lên hình ảnh thành công.",
  "image": {
    "id": 1,
    "url": "http://localhost:3000/images/processed-1623456789-abcdef.jpg",
    "altText": null,
    "width": 1200,
    "height": 800,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## 4. Cập nhật thông tin hình ảnh

Yêu cầu: Người dùng đã xác thực và có vai trò ADMIN hoặc AUTHOR

**Request**

```
PUT /api/images/:id
```

**Headers**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body**

```json
{
  "altText": "Mô tả hình ảnh mới"
}
```

**Response**

```json
{
  "message": "Cập nhật thông tin hình ảnh thành công.",
  "image": {
    "id": 1,
    "url": "http://localhost:3000/images/processed-1623456789-abcdef.jpg",
    "altText": "Mô tả hình ảnh mới",
    "width": 1200,
    "height": 800,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## 5. Xóa hình ảnh

Yêu cầu: Người dùng đã xác thực và có vai trò ADMIN

**Request**

```
DELETE /api/images/:id
```

**Headers**

```
Authorization: Bearer <access_token>
```

**Response**

```json
{
  "message": "Xóa hình ảnh thành công."
}
```

## Các trường hợp lỗi

| Mã lỗi | Thông báo                                                           |
| ------ | ------------------------------------------------------------------- |
| 400    | Thông tin hình ảnh không hợp lệ.                                    |
| 400    | Vui lòng chọn một hình ảnh để tải lên.                              |
| 400    | Định dạng file không hợp lệ. Chỉ hỗ trợ các định dạng hình ảnh.     |
| 400    | Kích thước file quá lớn. Kích thước tối đa là 5MB.                  |
| 400    | Hình ảnh đang được sử dụng. Không thể xóa.                          |
| 404    | Không tìm thấy hình ảnh.                                            |
| 403    | Bạn không có quyền thực hiện thao tác này.                          |
| 500    | Không thể lấy danh sách hình ảnh. Vui lòng thử lại sau.             |
| 500    | Không thể tải lên hình ảnh. Vui lòng thử lại sau.                   |
| 500    | Không thể cập nhật thông tin hình ảnh. Vui lòng thử lại sau.        |
| 500    | Không thể xóa hình ảnh. Vui lòng thử lại sau.                       | 