import * as XLSX from 'xlsx';
import { StockService } from '../services/stock.service';
import path from 'path';
import fs from 'fs';

// Initialize the stock service
const stockService = new StockService();

/**
 * Import stocks from Excel file
 * @param filePath Path to the Excel file
 */
async function importStocksFromExcel(filePath: string): Promise<void> {
  try {
    console.log(`Reading file: ${filePath}`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Read the Excel file
    const workbook = XLSX.read(fs.readFileSync(filePath), { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert the worksheet to JSON
    const data: any[] = XLSX.utils.sheet_to_json(worksheet);
    
    if (data.length === 0) {
      console.log('No data found in Excel file');
      return;
    }
    
    console.log(`Found ${data.length} stock entries to import`);

    // Process each row
    let successCount = 0;
    let errorCount = 0;
    
    for (const row of data) {
      try {
        // Extract stock data from row
        // Adjust these field names based on the actual Excel column headers
        const stockData = {
          symbol: row.symbol || row.Symbol || row.mã || row.Mã,
          name: row.name || row.Name || row.tên || row.Tên,
          exchange: row.exchange || row.Exchange || row.sàn || row.Sàn,
          industry: row.industry || row.Industry || row.ngành || row.Ngành,
          description: row.description || row.Description || row.mô_tả || row.Mô_tả,
        };
        
        // Validate required fields
        if (!stockData.symbol) {
          console.error('Skip row: Missing symbol');
          errorCount++;
          continue;
        }
        
        if (!stockData.name) {
          console.error(`Skip row for ${stockData.symbol}: Missing name`);
          errorCount++;
          continue;
        }
        
        // Standardize symbol (uppercase)
        stockData.symbol = stockData.symbol.toUpperCase();
        
        // Try to get the stock first to check if it exists
        const existingStock = await stockService.getStockBySymbol(stockData.symbol);
        
        if (existingStock) {
          // Update existing stock
          console.log(`Updating existing stock: ${stockData.symbol}`);
          await stockService.updateStock(stockData.symbol, stockData);
        } else {
          // Create new stock
          console.log(`Creating new stock: ${stockData.symbol}`);
          await stockService.createStock(stockData);
        }
        
        successCount++;
      } catch (error) {
        console.error(`Error processing row:`, row, error);
        errorCount++;
      }
    }
    
    console.log(`Import completed: ${successCount} successful, ${errorCount} errors`);
  } catch (error) {
    console.error('Import failed:', error);
  }
}

// Run the import if this file is executed directly
if (require.main === module) {
  const filePath = process.argv[2] || path.join(process.cwd(), 'import', 'stock.xlsx');
  
  importStocksFromExcel(filePath)
    .then(() => {
      console.log('Import process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Import process failed:', error);
      process.exit(1);
    });
}

// Export for use in other files
export { importStocksFromExcel }; 