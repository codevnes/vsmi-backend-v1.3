import dotenv from 'dotenv';
import cron from 'node-cron';
import { crawlAndProcessMarketNews } from '../src/services/newsService';

// Load environment variables from .env file
dotenv.config();

let isRunning = false;

async function runCrawler() {
  // Prevent multiple concurrent executions
  if (isRunning) {
    console.log('A crawling task is already running, skipping this iteration');
    return;
  }

  try {
    isRunning = true;
    console.log(`[${new Date().toISOString()}] Starting scheduled news crawling...`);

    // Stock market news
    const stockMarketNewsUrl = 'https://cafef.vn/thi-truong-chung-khoan.chn';
    console.log('Crawling stock market news...');
    await crawlAndProcessMarketNews(stockMarketNewsUrl);

    console.log(`[${new Date().toISOString()}] Completed scheduled crawl`);
  } catch (error) {
    console.error('Error in scheduled crawling:', error);
  } finally {
    isRunning = false;
  }
}

// Run every 30 seconds
// The cron expression '*/30 * * * * *' means:
// - */30: every 30 units of the first time field (seconds)
// - *: any value for minutes
// - *: any value for hours
// - *: any value for day of month
// - *: any value for month
// - *: any value for day of week
console.log('Starting news crawler with cron schedule (every 30 seconds)');
cron.schedule('*/30 * * * * *', runCrawler);

// Run immediately on startup
runCrawler();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down news crawler...');
  process.exit(0);
}); 