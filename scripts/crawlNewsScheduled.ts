import dotenv from 'dotenv';
import { crawlAndProcessMarketNews } from '../src/services/newsService';

// Load environment variables from .env file
dotenv.config();

const INTERVAL_MS = 30000; // 30 seconds
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

console.log(`Starting news crawler scheduler (every ${INTERVAL_MS/1000} seconds)`);

// Run immediately on startup
runCrawler();

// Then schedule it to run every INTERVAL_MS
setInterval(runCrawler, INTERVAL_MS);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down news crawler scheduler...');
  process.exit(0);
}); 