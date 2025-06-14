import { StockService } from '../services/stock.service';

async function createVnindex() {
  try {
    console.log('Initializing StockService...');
    const stockService = new StockService();
    
    console.log('Adding VNINDEX to database...');
    await stockService.createStock({
      symbol: 'VNINDEX',
      name: 'VN Index',
      exchange: 'HOSE',
      description: 'Vietnam Stock Market Index'
    });
    
    console.log('VNINDEX successfully added to database');
  } catch (error) {
    console.error('Error adding VNINDEX to database:', error);
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  createVnindex()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
} 