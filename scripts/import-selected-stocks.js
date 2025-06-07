#!/usr/bin/env node

/**
 * Script to import selected stocks from an Excel file
 * 
 * Usage:
 *   node scripts/import-selected-stocks.js [path/to/file.xlsx]
 * 
 * If no file path is provided, the default path is used:
 *   import/selected-stocks/data.xlsx
 */

// Import necessary modules
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient();

// Get file path from command line arguments or use default
const filePath = process.argv[2] || path.join(process.cwd(), 'import', 'selected-stocks', 'data.xlsx');

/**
 * Parse a value to float or return null if invalid
 */
function parseFloatOrNull(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Import selected stocks from Excel file
 */
async function importSelectedStocksFromExcel(filePath) {
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
    const data = XLSX.utils.sheet_to_json(worksheet);
    
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
        let date;
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

        const selectedStockData = {
          symbol,
          date,
          close: parseFloatOrNull(row.close || row.Close || row.giá || row.Giá || row['Giá đóng cửa']),
          return: parseFloatOrNull(row.return || row.Return || row['lợi nhuận'] || row['Lợi nhuận'] || row['Lợi Nhuận']),
          qIndex: parseFloatOrNull(row.qIndex || row.QIndex || row['q-index'] || row['Q-Index'] || row['Chỉ số Q']),
          volume: parseFloatOrNull(row.volume || row.Volume || row['khối lượng'] || row['Khối lượng'] || row['Khối Lượng']),
        };
        
        // Check if the selected stock already exists
        const existingStock = await prisma.selectedStocks.findUnique({
          where: {
            symbol_date: {
              symbol,
              date,
            }
          }
        });
        
        if (existingStock) {
          console.log(`Duplicate found for ${symbol} on ${date.toISOString().split('T')[0]}. Skipping.`);
          duplicateCount++;
          continue;
        }

        // Create the selected stock
        console.log(`Importing selected stock: ${symbol} on ${date.toISOString().split('T')[0]}`);
        await prisma.selectedStocks.create({
          data: selectedStockData,
        });
        
        successCount++;
      } catch (error) {
        console.error(`Error processing row:`, row, error);
        errorCount++;
      }
    }
    
    console.log(`Import completed: ${successCount} successful, ${duplicateCount} duplicates, ${errorCount} errors`);
  } catch (error) {
    console.error('Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
async function run() {
  try {
    console.log('Starting selected stocks import...');
    await importSelectedStocksFromExcel(filePath);
    console.log('Selected stocks import completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Selected stocks import failed:', error);
    process.exit(1);
  }
}

run(); 