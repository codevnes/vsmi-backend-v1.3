# Hướng Dẫn Nhanh - Hệ Thống Crawler Tin Tức CafeF

## 1. Khởi động crawler

### Chạy một lần:
```bash
npm run crawl:news
```

### Chạy liên tục (30 giây/lần):
```bash
npm run crawl:interval
```

### Chạy như daemon (với log):
```bash
npm run crawl:daemon
# hoặc tùy chỉnh thời gian (ví dụ 60 giây)
ts-node scripts/daemon.ts 60
```

### Chạy trong nền (không hiển thị log):
```bash
npm run crawl:daemon:background
```

### Dừng daemon:
```bash
npm run crawl:daemon:stop
```

## 2. Truy cập API

### Lấy danh sách tin:
```
GET /api/news?page=1&limit=10&sourceWebsite=cafef.vn
```

### Lấy chi tiết tin theo ID:
```
GET /api/news/[id]
```

### Lấy danh sách nguồn:
```
GET /api/news/sources
```

## 3. Giám sát và Logs

- File log: `crawler-daemon.log`
- File PID: `crawler-daemon.pid`

## 4. Cấu trúc thư mục

```
├── src/
│   ├── services/
│   │   └── newsService.ts    # Dịch vụ crawl và xử lý tin tức
│   ├── controllers/
│   │   └── newsArticle.controller.ts  # API controllers
│   └── routes/
│       └── newsArticle.routes.ts      # API routes
├── scripts/
│   ├── crawlNews.ts          # Chạy crawler một lần
│   ├── crawlNewsScheduled.ts # Chạy định kỳ mỗi 30 giây
│   └── daemon.ts             # Chạy như daemon với logging
└── prisma/
    └── schema.prisma         # Định nghĩa model NewsArticle
```

## 5. Cấu trúc dữ liệu NewsArticle

```prisma
model NewsArticle {
  id               String    @id @default(uuid()) @db.Uuid
  title            String    @db.VarChar(255)
  url              String    @unique @db.VarChar(500)
  originalContent  String    @db.Text
  summarizedContent String    @db.Text
  sourceWebsite    String?   @db.VarChar(100)
  publishedAt      DateTime? @db.Timestamptz(3)
  createdAt        DateTime  @default(now()) @db.Timestamptz(3)
  updatedAt        DateTime  @updatedAt @db.Timestamptz(3)

  @@index([sourceWebsite])
  @@index([publishedAt])
}
```

## 6. Thông tin cấu hình

- **Nguồn crawl:** https://cafef.vn/thi-truong-chung-khoan.chn
- **ChatGPT Prompt:** Đọc từ file `src/prompt/news.txt`
- **Khoảng thời gian mặc định:** 30 giây 