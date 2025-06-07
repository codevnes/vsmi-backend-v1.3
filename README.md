# VSMI Backend API

Backend REST API cho dự án VSMI được xây dựng với Node.js, Express, TypeScript và Prisma ORM.

## Cấu trúc dự án

```
vsmi-backend/
├── docs/               # Tài liệu API
├── prisma/             # Prisma schema và migrations
├── src/                # Mã nguồn
│   ├── config/         # Cấu hình
│   ├── controllers/    # Xử lý request và response
│   ├── middlewares/    # Middleware
│   ├── models/         # Định nghĩa models và interfaces
│   ├── repositories/   # Lớp truy cập dữ liệu
│   ├── routes/         # API routes
│   ├── services/       # Lớp nghiệp vụ
│   ├── types/          # Định nghĩa kiểu dữ liệu
│   ├── utils/          # Tiện ích
│   ├── app.ts          # Khởi tạo Express app
│   └── index.ts        # Entry point
├── .env                # Biến môi trường
├── package.json        # Thông tin project và dependencies
└── tsconfig.json       # Cấu hình TypeScript
```

## Cài đặt

1. Clone dự án:
   ```bash
   git clone <repository-url>
   cd vsmi-backend
   ```

2. Cài đặt dependencies:
   ```bash
   pnpm install
   ```

3. Tạo file .env:
   ```
   PORT=3000
   DATABASE_URL="postgresql://username:password@localhost:5432/vsmi?schema=public"
   JWT_SECRET="your-secret-key"
   ```

4. Chạy Prisma migration:
   ```bash
   pnpm prisma:generate
   pnpm prisma migrate dev
   ```

5. Khởi động ứng dụng:
   ```bash
   pnpm run dev
   ```

## Tính năng

- **Authentication:** Đăng ký, đăng nhập, refresh token
- **User Management:** CRUD operations cho người dùng
- **Role-based Access Control:** Phân quyền người dùng (USER, ADMIN)
- **Pagination:** Phân trang cho các API trả về danh sách dữ liệu

## API Documentation

### Authentication API

- `POST /api/auth/register`: Đăng ký người dùng mới
- `POST /api/auth/login`: Đăng nhập
- `POST /api/auth/refresh-token`: Làm mới token
- `GET /api/auth/profile`: Xem thông tin người dùng

Chi tiết: [Authentication API](./docs/auth.md)

### User Management API

- `GET /api/users`: Lấy danh sách người dùng
- `GET /api/users/:id`: Lấy thông tin người dùng theo ID
- `POST /api/users`: Tạo người dùng mới
- `PUT /api/users/:id`: Cập nhật thông tin người dùng
- `DELETE /api/users/:id`: Xóa người dùng

Chi tiết: [Users API](./docs/users.md)

### Danh mục API

- `GET /api/categories`: Lấy danh sách danh mục
- `GET /api/categories/:id`: Lấy thông tin danh mục theo ID
- `POST /api/categories`: Tạo danh mục mới
- `PUT /api/categories/:id`: Cập nhật thông tin danh mục
- `DELETE /api/categories/:id`: Xóa danh mục

Chi tiết: [Categories API](./docs/categories.md)

### Hình ảnh API

- `GET /api/images`: Lấy danh sách hình ảnh
- `GET /api/images/:id`: Lấy thông tin hình ảnh theo ID
- `POST /api/images`: Upload hình ảnh mới
- `PUT /api/images/:id`: Cập nhật thông tin hình ảnh
- `DELETE /api/images/:id`: Xóa hình ảnh

Chi tiết: [Images API](./docs/images.md)

### Phân trang

Tất cả các API trả về danh sách đều hỗ trợ phân trang với các tham số:
- `page`: Trang hiện tại (mặc định: 1)
- `limit`: Số lượng mục dữ liệu trên mỗi trang (mặc định: 10)
- `sort`: Trường để sắp xếp (mặc định: createdAt)
- `order`: Thứ tự sắp xếp (mặc định: desc)

Chi tiết: [Quy tắc phân trang](./docs/pagination.md)

## Công nghệ

- **Node.js**: Môi trường chạy
- **Express**: Web framework
- **TypeScript**: Ngôn ngữ lập trình
- **Prisma**: ORM và database toolkit
- **PostgreSQL**: Database
- **JWT**: Authentication
- **Jest**: Testing (future)

## Scripts

- `pnpm run dev`: Khởi động server phát triển
- `pnpm run build`: Build cho production
- `pnpm run start`: Khởi động server production
- `pnpm run prisma:generate`: Tạo Prisma client
- `pnpm run prisma:studio`: Mở Prisma Studio

## Kiến trúc

Dự án được xây dựng theo mô hình kiến trúc 3 tầng:

1. **Controllers**: Xử lý HTTP requests và responses
2. **Services**: Xử lý logic nghiệp vụ
3. **Repositories**: Xử lý truy cập dữ liệu

## License

MIT 