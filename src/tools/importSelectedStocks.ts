import * as XLSX from 'xlsx';
import { SelectedStocksRepository } from '../repositories/selectedStocks.repository';
import path from 'path';
import fs from 'fs';
import { ISelectedStocksCreate } from '../models';

// Initialize the repository
const selectedStocksRepository = new SelectedStocksRepository();

/**
 * Parse a value to float or return undefined if invalid
 */
function parseFloatOrUndefined(value: any): number | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

interface SelectedStockRow {
  symbol?: string;
  date?: string | Date;
  close?: number | string;
  return?: number | string;
  qIndex?: number | string;
  volume?: number | string;
  [key: string]: any;
}

/**
 * Import selected stocks from Excel file
 * @param filePath Path to the Excel file
 */
async function importSelectedStocksFromExcel(filePath: string): Promise<void> {
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
    const data: SelectedStockRow[] = XLSX.utils.sheet_to_json(worksheet);
    
    if (data.length === 0) {
      console.log('No data found in Excel file');
      return;
    }
    
    console.log(`Found ${data.length} selected stock entries to import`);

    // Process each row
    let successCount = 0;
    let errorCount = 0;
    let duplicateCount = 0;
    
    for (const row of data) {
      try {
        // Extract selected stock data from row
        const symbol = (row.symbol || row.Symbol || row.mã || row.Mã || row['Mã CK'] || '').toString().toUpperCase();
        let dateValue = row.date || row.Date || row.ngày || row.Ngày || row['Ngày'];
        
        // Skip rows without required data
        if (!symbol || !dateValue) {
          console.error('Skip row: Missing symbol or date', row);
          errorCount++;
          continue;
        }

        // Convert date format if it's a string
        let date: Date;
        if (dateValue instanceof Date) {
          date = dateValue;
        } else {
          date = new Date(dateValue);
          if (isNaN(date.getTime())) {
            console.error(`Skip row: Invalid date format for ${symbol}:`, dateValue);
            errorCount++;
            continue;
          }
        }

        const selectedStockData: ISelectedStocksCreate = {
          symbol,
          date,
          close: parseFloatOrUndefined(row.close || row.Close || row.giá || row.Giá || row['Giá đóng cửa']),
          return: parseFloatOrUndefined(row.return || row.Return || row['lợi nhuận'] || row['Lợi nhuận'] || row['Lợi Nhuận']),
          qIndex: parseFloatOrUndefined(row.qIndex || row.QIndex || row['q-index'] || row['Q-Index'] || row['Chỉ số Q']),
          volume: parseFloatOrUndefined(row.volume || row.Volume || row['khối lượng'] || row['Khối lượng'] || row['Khối Lượng']),
        };
        
        // Check if the selected stock already exists
        const existingStock = await selectedStocksRepository.findBySymbolAndDate(symbol, date);
        
        if (existingStock) {
          console.log(`Duplicate found for ${symbol} on ${date.toISOString().split('T')[0]}. Skipping.`);
          duplicateCount++;
          continue;
        }

        // Create the selected stock
        console.log(`Importing selected stock: ${symbol} on ${date.toISOString().split('T')[0]}`);
        await selectedStocksRepository.create(selectedStockData);
        
        successCount++;
      } catch (error) {
        console.error(`Error processing row:`, row, error);
        errorCount++;
      }
    }
    
    console.log(`Import completed: ${successCount} successful, ${duplicateCount} duplicates, ${errorCount} errors`);
  } catch (error) {
    console.error('Import failed:', error);
  }
}

/**
 * Main function to run the import
 */
export async function importSelectedStocks(filePath?: string): Promise<void> {
  const importFilePath = filePath || path.join(process.cwd(), 'import', 'selected-stocks', 'data.xlsx');
  await importSelectedStocksFromExcel(importFilePath);
}

// Allow running directly from command line
if (require.main === module) {
  const filePath = process.argv[2];
  importSelectedStocks(filePath)
    .then(() => {
      console.log('Selected stocks import completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Selected stocks import failed:', error);
      process.exit(1);
    });
} 