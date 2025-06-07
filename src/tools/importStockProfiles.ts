import * as XLSX from 'xlsx';
import { StockProfileService } from '../services/stockProfile.service';
import path from 'path';
import fs from 'fs';

// Initialize the stock profile service
const stockProfileService = new StockProfileService();

// Match the StockProfileInput interface from the service
interface StockProfileInput {
  symbol: string;
  price?: number;
  profit?: number;
  volume?: number;
  pe?: number;
  eps?: number;
  roa?: number;
  roe?: number;
}

interface StockProfileRow {
  symbol?: string;
  price?: number;
  profit?: number;
  volume?: number;
  pe?: number;
  eps?: number;
  roa?: number;
  roe?: number;
  [key: string]: any;
}

/**
 * Parse a value to float or return undefined if invalid
 */
function parseFloatOrUndefined(value: any): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Import stock profiles from Excel file
 * @param filePath Path to the Excel file
 */
async function importStockProfilesFromExcel(filePath: string): Promise<void> {
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
    const data: StockProfileRow[] = XLSX.utils.sheet_to_json(worksheet);
    
    if (data.length === 0) {
      console.log('No data found in Excel file');
      return;
    }
    
    console.log(`Found ${data.length} stock profile entries to import`);

    // Process each row
    let successCount = 0;
    let errorCount = 0;
    
    for (const row of data) {
      try {
        // Extract stock profile data from row
        const stockProfileData: StockProfileInput = {
          symbol: (row.symbol || row.Symbol || row.mã || row.Mã || row['Mã CK'] || '').toString().toUpperCase(),
          price: parseFloatOrUndefined(row.price || row.Price || row.giá || row.Giá || row['Giá']),
          profit: parseFloatOrUndefined(row.profit || row.Profit || row['lợi nhuận'] || row['Lợi nhuận'] || row['Lợi Nhuận']),
          volume: parseFloatOrUndefined(row.volume || row.Volume || row['khối lượng'] || row['Khối lượng'] || row['Khối Lượng']),
          pe: parseFloatOrUndefined(row.pe || row.PE || row.P_E || row.P_e || row['P/E']),
          eps: parseFloatOrUndefined(row.eps || row.EPS || row.Eps),
          roa: parseFloatOrUndefined(row.roa || row.ROA || row.Roa),
          roe: parseFloatOrUndefined(row.roe || row.ROE || row.Roe),
        };
        
        // Validate required fields
        if (!stockProfileData.symbol) {
          console.error('Skip row: Missing symbol');
          errorCount++;
          continue;
        }
        
        // Try to upsert the stock profile (create or update)
        console.log(`Processing stock profile: ${stockProfileData.symbol}`);
        
        await stockProfileService.upsertStockProfile(stockProfileData);
        
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

/**
 * Main function to run the import
 */
export async function importStockProfiles(filePath?: string): Promise<void> {
  const importFilePath = filePath || path.join(process.cwd(), 'import', 'stock-profiles', 'data.xlsx');
  await importStockProfilesFromExcel(importFilePath);
}

// Allow running directly from command line
if (require.main === module) {
  const filePath = process.argv[2];
  importStockProfiles(filePath)
    .then(() => {
      console.log('Stock profile import completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Stock profile import failed:', error);
      process.exit(1);
    });
} 