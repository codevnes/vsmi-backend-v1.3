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
const { exec } = require('child_process');

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
 * Check and fix database connections if needed
 */
async function checkAndFixDatabaseConnections() {
  return new Promise((resolve, reject) => {
    console.log('Checking database connections...');
    
    // This command will list all PostgreSQL connections
    exec('ps aux | grep postgres', (error, stdout, stderr) => {
      if (error) {
        console.warn('Could not check PostgreSQL connections:', error);
        // Continue anyway
        resolve();
        return;
      }
      
      console.log('Current PostgreSQL processes:');
      console.log(stdout);
      
      // Attempt to restart the database service if you have permission
      // This is commented out because it requires sudo privileges
      // exec('sudo service postgresql restart', (error, stdout, stderr) => {
      //   if (error) {
      //     console.warn('Could not restart PostgreSQL:', error);
      //   } else {
      //     console.log('PostgreSQL restarted successfully');
      //   }
      //   resolve();
      // });
      
      // Instead of restarting, we'll just wait a bit to let connections close naturally
      console.log('Waiting for connections to close naturally...');
      setTimeout(resolve, 5000); // Wait 5 seconds
    });
  });
}

/**
 * Import selected stocks from Excel file
 */
async function importSelectedStocksFromExcel(filePath) {
  // Check database connections before starting
  await checkAndFixDatabaseConnections();
  
  // Create a single Prisma client instance
  const prisma = new PrismaClient({
    // Set connection limit
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
        connectionLimit: 5
      }
    }
  });
  
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
    
    // Process data in smaller batches
    const BATCH_SIZE = 1; // Process one at a time to minimize connection issues
    const batches = [];
    
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      batches.push(data.slice(i, i + BATCH_SIZE));
    }
    
    for (const [batchIndex, batch] of batches.entries()) {
      try {
        console.log(`Processing batch ${batchIndex + 1}/${batches.length}`);
        
        for (const row of batch) {
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
            
            // Use upsert instead of findFirst + create to reduce number of queries
            console.log(`Importing selected stock: ${symbol}`);
            await prisma.selectedStocks.upsert({
              where: { symbol },
              update: selectedStockData,
              create: selectedStockData,
            });
            
            successCount++;
          } catch (error) {
            console.error(`Error processing row:`, row, error);
            errorCount++;
            
            // If we encounter a connection error, wait a bit before continuing
            if (error.message && error.message.includes('too many clients')) {
              console.log('Connection limit reached. Waiting before continuing...');
              await new Promise(resolve => setTimeout(resolve, 5000));
            }
          }
        }
      } catch (error) {
        console.error(`Error processing batch ${batchIndex + 1}:`, error);
      }
      
      // Add a delay between batches
      if (batchIndex < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
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