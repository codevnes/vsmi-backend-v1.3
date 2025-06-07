# Hướng dẫn Import Stock Profiles (Thông tin mã chứng khoán)

## Giới thiệu

Công cụ import Stock Profiles cho phép bạn nhập dữ liệu thông tin chi tiết của các mã chứng khoán từ file Excel vào hệ thống. Công cụ này sẽ tự động tạo mới hoặc cập nhật thông tin cho các mã chứng khoán đã tồn tại.

## Chuẩn bị File Excel

Chuẩn bị một file Excel với định dạng sau:

| Symbol/Mã | Price/Giá | Profit/Lợi nhuận | Volume/Khối lượng | P/E     | EPS    | ROA   | ROE   |
|-----------|-----------|------------------|-------------------|---------|--------|-------|-------|
| VIC       | 50000     | 10000000000      | 5000000           | 15.5    | 3200   | 0.08  | 0.21  |
| VNM       | 70000     | 15000000000      | 3000000           | 12.3    | 5700   | 0.12  | 0.25  |
| ...       | ...       | ...              | ...               | ...     | ...    | ...   | ...   |

**Lưu ý**: 
- Tên cột có thể linh hoạt (cả tiếng Anh và tiếng Việt)
- Công cụ sẽ tự động nhận diện tên cột phổ biến
- Mã chứng khoán (Symbol) là bắt buộc và phải tồn tại trong hệ thống
- Các giá trị khác có thể để trống

## Vị trí đặt file

Mặc định, công cụ sẽ tìm file tại đường dẫn:
```
/import/stock-profiles/data.xlsx
```

Bạn có thể tạo thư mục này và đặt file Excel vào đó, hoặc chỉ định đường dẫn khác khi chạy công cụ.

## Cách sử dụng

### Sử dụng script npm

```bash
# Sử dụng file mặc định
npm run import:stock-profiles

# Hoặc chỉ định đường dẫn file
npm run import:stock-profiles -- /đường/dẫn/tới/file.xlsx
```

### Sử dụng trực tiếp từ JavaScript

```bash
node scripts/import-stock-profiles.js /đường/dẫn/tới/file.xlsx
```

### Sử dụng từ mã nguồn TypeScript

Nếu bạn muốn gọi công cụ import từ mã nguồn TypeScript:

```typescript
import { importStockProfiles } from '../tools/importStockProfiles';

// Import với file mặc định
await importStockProfiles();

// Hoặc chỉ định đường dẫn file
await importStockProfiles('/đường/dẫn/tới/file.xlsx');
```

## Quy trình xử lý dữ liệu

1. Đọc file Excel và chuyển đổi thành dữ liệu JSON
2. Với mỗi dòng dữ liệu:
   - Kiểm tra xem mã chứng khoán có tồn tại không
   - Nếu mã không tồn tại trong hệ thống, bỏ qua dòng dữ liệu
   - Nếu mã đã có profile, cập nhật thông tin
   - Nếu mã chưa có profile, tạo mới
3. Hiển thị thống kê số lượng bản ghi đã xử lý thành công và thất bại

## Xử lý lỗi

- Nếu không tìm thấy file Excel: Hiển thị lỗi và dừng chương trình
- Nếu file Excel không có dữ liệu: Hiển thị thông báo và dừng chương trình
- Nếu một dòng dữ liệu không hợp lệ: Ghi log lỗi và bỏ qua dòng đó, tiếp tục xử lý các dòng khác 