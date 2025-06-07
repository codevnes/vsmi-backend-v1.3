#!/usr/bin/env node
/**
 * Script to import stocks from Excel file
 * Usage: node import-stocks.js [filePath]
 * 
 * This script requires that the project is built first using:
 * npm run build
 */

// Import necessary modules
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient();

// Get the file path from command line arguments or use default
const filePath = process.argv[2] || path.join(process.cwd(), 'import', 'stock.xlsx');

/**
 * Import stocks from Excel file
 */
async function importStocksFromExcel(filePath) {
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
    
    console.log(`Found ${data.length} stock entries to import`);

    // Process each row
    let successCount = 0;
    let errorCount = 0;
    
    for (const row of data) {
      try {
        // Extract stock data from row
        // Try to handle various column name formats
        const stockData = {
          symbol: row.symbol || row.Symbol || row.mã || row.Mã || row['Mã CK'],
          name: row.name || row.Name || row.tên || row.Tên || row['Tên công ty'],
          exchange: row.exchange || row.Exchange || row.sàn || row.Sàn || row['Sàn'],
          industry: row.industry || row.Industry || row.ngành || row.Ngành || row['Ngành'],
          description: row.description || row.Description || row.mô_tả || row['Mô tả'] || row['Mô tả'],
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
        const existingStock = await prisma.stock.findUnique({
          where: { symbol: stockData.symbol },
        });
        
        if (existingStock) {
          // Update existing stock
          console.log(`Updating existing stock: ${stockData.symbol}`);
          await prisma.stock.update({
            where: { symbol: stockData.symbol },
            data: stockData,
          });
        } else {
          // Create new stock
          console.log(`Creating new stock: ${stockData.symbol}`);
          await prisma.stock.create({
            data: stockData,
          });
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
  } finally {
    // Disconnect from the database
    await prisma.$disconnect();
  }
}

// Run the import
importStocksFromExcel(filePath)
  .then(() => {
    console.log('Import completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
  }); 