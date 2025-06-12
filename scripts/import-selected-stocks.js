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
const filePath = process.argv[2] || path.join(process.cwd(), 'import', 'data-10-06', 'DM_CoPhieuChonLoc.xlsx');

/**
 * Parse a value to float or return undefined if invalid
 */
function parseFloatOrUndefined(value) {
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
        // Extract selected stock data from row - updated to match Vietnamese column names in DM_CoPhieuChonLoc.xlsx
        const symbol = (row.symbol || row.Symbol || row['Mã'] || row['Mã CP'] || row['Mã CK'] || '').toString().toUpperCase();
        
        // Skip rows without required data
        if (!symbol) {
          console.error('Skip row: Missing symbol', row);
          errorCount++;
          continue;
        }

        const selectedStockData = {
          symbol,
          close: parseFloatOrUndefined(row.close || row.Close || row['Giá'] || row['Giá CP'] || row['Giá đóng cửa']),
          return: parseFloatOrUndefined(row.return || row.Return || row['Lợi nhuận'] || row['LN']),
          volume: parseFloatOrUndefined(row.volume || row.Volume || row['KL'] || row['Khối lượng']),
        };
        
        // Check if the selected stock already exists
        const existingStock = await prisma.selectedStocks.findFirst({
          where: {
            symbol,
          },
        });
        
        if (existingStock) {
          console.log(`Duplicate found for ${symbol}. Skipping.`);
          duplicateCount++;
          continue;
        }

        // Create the selected stock
        console.log(`Importing selected stock: ${symbol}`);
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
    // Close Prisma client connection
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