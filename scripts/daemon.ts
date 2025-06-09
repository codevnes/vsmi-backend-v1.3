import dotenv from 'dotenv';
import { crawlAndProcessMarketNews } from '../src/services/newsService';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// Cấu hình
const DEFAULT_INTERVAL = 30; // 30 giây
const LOG_FILE = path.join(process.cwd(), 'crawler-daemon.log');
const PID_FILE = path.join(process.cwd(), 'crawler-daemon.pid');

// Nhận interval từ tham số dòng lệnh hoặc sử dụng giá trị mặc định
const args = process.argv.slice(2);
const intervalSeconds = args.length > 0 ? parseInt(args[0], 10) : DEFAULT_INTERVAL;

// Kiểm tra interval hợp lệ
if (isNaN(intervalSeconds) || intervalSeconds < 5) {
  console.error('Interval phải là một số >= 5 giây');
  process.exit(1);
}

let isRunning = false;

// Ghi thông tin vào log file
function log(message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  // Ghi vào file
  fs.appendFileSync(LOG_FILE, logMessage);
  
  // Nếu chạy ở chế độ foreground, hiển thị trên console
  if (process.env.NODE_ENV !== 'production') {
    console.log(message);
  }
}

// Hàm chính để crawl tin tức
async function runCrawler() {
  if (isRunning) {
    log('Một tiến trình crawl đang chạy, bỏ qua lần này');
    return;
  }

  try {
    isRunning = true;
    log(`Bắt đầu crawl theo lịch trình...`);

    // Crawl tin tức thị trường chứng khoán
    const stockMarketNewsUrl = 'https://cafef.vn/thi-truong-chung-khoan.chn';
    log('Đang crawl tin thị trường chứng khoán...');
    await crawlAndProcessMarketNews(stockMarketNewsUrl);

    log(`Hoàn thành crawl lần này`);
  } catch (error) {
    log(`Lỗi trong quá trình crawl: ${error}`);
  } finally {
    isRunning = false;
  }
}

// Ghi PID vào file
fs.writeFileSync(PID_FILE, process.pid.toString());

// Khởi động daemon
log(`--------------------------------------------------`);
log(`Khởi động News Crawler Daemon (PID: ${process.pid})`);
log(`Khoảng thời gian: ${intervalSeconds} giây`);
log(`Log file: ${LOG_FILE}`);
log(`PID file: ${PID_FILE}`);
log(`--------------------------------------------------`);

// Chạy lần đầu ngay khi khởi động
runCrawler();

// Sau đó chạy theo lịch định kỳ
setInterval(runCrawler, intervalSeconds * 1000);

// Xử lý khi shutdown
process.on('SIGINT', () => {
  log('Đang tắt daemon News Crawler...');
  // Xóa PID file
  try {
    fs.unlinkSync(PID_FILE);
  } catch (err) {
    // Không làm gì nếu file không tồn tại
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Nhận tín hiệu SIGTERM, đang tắt daemon...');
  // Xóa PID file
  try {
    fs.unlinkSync(PID_FILE);
  } catch (err) {
    // Không làm gì nếu file không tồn tại
  }
  process.exit(0);
}); 