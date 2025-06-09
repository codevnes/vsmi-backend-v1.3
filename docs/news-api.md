# API Tin Tức CafeF

Tài liệu này mô tả các API endpoints có sẵn để truy cập dữ liệu tin tức đã được crawl từ CafeF và tổng hợp bởi ChatGPT.

## Tổng quan

API tin tức cho phép truy cập vào dữ liệu tin tức thị trường chứng khoán đã được crawl tự động từ CafeF và tổng hợp bằng ChatGPT. Mỗi bài viết bao gồm cả nội dung gốc và phiên bản tổng hợp ngắn gọn.

## Cấu trúc dữ liệu

Mỗi bản ghi tin tức (`NewsArticle`) bao gồm:

| Trường | Kiểu dữ liệu | Mô tả |
|--------|--------------|-------|
| `id` | UUID | ID duy nhất của bài viết |
| `title` | String | Tiêu đề bài viết |
| `url` | String | URL nguyên bản của bài viết |
| `originalContent` | Text | Nội dung gốc của bài viết |
| `summarizedContent` | Text | Nội dung đã được tổng hợp bởi ChatGPT |
| `sourceWebsite` | String | Tên miền nguồn của bài viết (vd: cafef.vn) |
| `publishedAt` | DateTime | Thời gian xuất bản (hoặc thời gian crawl) |
| `createdAt` | DateTime | Thời gian tạo bản ghi |
| `updatedAt` | DateTime | Thời gian cập nhật bản ghi gần nhất |

## Endpoints

### 1. Lấy tất cả tin tức

```
GET /api/news
```

Trả về danh sách tất cả tin tức với phân trang.

#### Tham số truy vấn

| Tham số | Kiểu | Mặc định | Mô tả |
|---------|-----|----------|-------|
| `page` | Number | 1 | Số trang |
| `limit` | Number | 10 | Số lượng bản ghi trên mỗi trang |
| `sourceWebsite` | String | null | Lọc theo nguồn (vd: cafef.vn) |

#### Phản hồi

```json
{
  "data": [
    {
      "id": "43f28d7a-1234-5678-abcd-1234567890ab",
      "title": "Quỹ ngoại hé lộ lý do chi 700 tỷ mua thêm hàng chục triệu cổ phiếu MBB",
      "url": "https://cafef.vn/quy-ngoai-he-lo-ly-do-chi-700-ty-mua-them-hang-chuc-trieu-co-phieu-mbb-20250609000123.chn",
      "originalContent": "Nội dung dài...",
      "summarizedContent": "Trong tháng 5, Pyn Elite Fund đã phân bổ thêm khoảng 3% danh mục (700 tỷ đồng) vào cổ phiếu MBB, nâng tỷ trọng lên 12,4%.",
      "sourceWebsite": "cafef.vn",
      "publishedAt": "2025-06-09T00:01:00.000Z",
      "createdAt": "2025-06-09T07:30:00.000Z",
      "updatedAt": "2025-06-09T07:30:00.000Z"
    },
    // ...thêm bài viết
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalRecords": 42,
    "totalPages": 5
  }
}
```

### 2. Lấy tin tức theo ID

```
GET /api/news/:id
```

Lấy thông tin chi tiết một bài viết dựa trên ID.

#### Tham số đường dẫn

| Tham số | Mô tả |
|---------|-------|
| `id` | ID của bài viết cần lấy |

#### Phản hồi

```json
{
  "id": "43f28d7a-1234-5678-abcd-1234567890ab",
  "title": "Quỹ ngoại hé lộ lý do chi 700 tỷ mua thêm hàng chục triệu cổ phiếu MBB",
  "url": "https://cafef.vn/quy-ngoai-he-lo-ly-do-chi-700-ty-mua-them-hang-chuc-trieu-co-phieu-mbb-20250609000123.chn",
  "originalContent": "Nội dung dài...",
  "summarizedContent": "Trong tháng 5, Pyn Elite Fund đã phân bổ thêm khoảng 3% danh mục (700 tỷ đồng) vào cổ phiếu MBB, nâng tỷ trọng lên 12,4%.",
  "sourceWebsite": "cafef.vn",
  "publishedAt": "2025-06-09T00:01:00.000Z",
  "createdAt": "2025-06-09T07:30:00.000Z",
  "updatedAt": "2025-06-09T07:30:00.000Z"
}
```

### 3. Lấy danh sách các nguồn tin

```
GET /api/news/sources
```

Trả về danh sách tất cả các nguồn tin tức đã được crawl.

#### Phản hồi

```json
[
  "cafef.vn",
  "ndh.vn",
  "tinnhanhchungkhoan.vn"
]
```

## Triển khai API

API được triển khai dưới dạng RESTful API sử dụng Express.js và được gọi thông qua các HTTP endpoints.

## Crawl và Tự động hóa

Hệ thống tự động crawl tin tức từ CafeF với các tùy chọn sau:

- **Chạy một lần**: `npm run crawl:news`
- **Chạy mỗi 30 giây**: `npm run crawl:interval`
- **Chạy như daemon**: `npm run crawl:daemon`
- **Chạy trong nền**: `npm run crawl:daemon:background`
- **Dừng daemon**: `npm run crawl:daemon:stop`

## Cấu hình daemon crawler

Khi chạy crawler daemon, bạn có thể cấu hình khoảng thời gian crawl bằng cách truyền tham số:

```
ts-node scripts/daemon.ts <khoảng_thời_gian_giây>
```

Ví dụ: `ts-node scripts/daemon.ts 60` sẽ chạy crawler mỗi 60 giây.

## Giám sát và Logs

- Log file: `crawler-daemon.log`
- PID file: `crawler-daemon.pid` 