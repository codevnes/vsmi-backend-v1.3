import dotenv from 'dotenv';
import { crawlAndProcessMarketNews } from '../src/services/newsService';

// Load environment variables from .env file
dotenv.config();

async function main() {
  try {
    // Stock market news
    const stockMarketNewsUrl = 'https://cafef.vn/thi-truong-chung-khoan.chn';
    console.log('Crawling stock market news...');
    await crawlAndProcessMarketNews(stockMarketNewsUrl);

    console.log('News crawling completed');
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

main().catch(console.error); 