#!/usr/bin/env node
/**
 * Script to import stock profiles from Excel file
 * Usage: node import-stock-profiles.js [filePath]
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
const filePath = process.argv[2] || path.join(process.cwd(), 'import', 'stock-profiles', 'data.xlsx');

/**
 * Import stock profiles from Excel file
 */
async function importStockProfilesFromExcel(filePath) {
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
    
    console.log(`Found ${data.length} stock profile entries to import`);

    // Process each row
    let successCount = 0;
    let errorCount = 0;
    
    for (const row of data) {
      try {
        // Extract stock profile data from row
        // Try to handle various column name formats
        const stockProfileData = {
          symbol: (row.symbol || row.Symbol || row.mã || row.Mã || row['Mã CK'] || '').toString().toUpperCase(),
          price: parseFloatOrNull(row.price || row.Price || row.giá || row.Giá || row['Giá']),
          profit: parseFloatOrNull(row.profit || row.Profit || row['lợi nhuận'] || row['Lợi nhuận'] || row['Lợi Nhuận']),
          volume: parseFloatOrNull(row.volume || row.Volume || row['khối lượng'] || row['Khối lượng'] || row['Khối Lượng']),
          pe: parseFloatOrNull(row.pe || row.PE || row.P_E || row.P_e || row['P/E']),
          eps: parseFloatOrNull(row.eps || row.EPS || row.Eps),
          roa: parseFloatOrNull(row.roa || row.ROA || row.Roa),
          roe: parseFloatOrNull(row.roe || row.ROE || row.Roe),
        };
        
        // Validate required fields
        if (!stockProfileData.symbol) {
          console.error('Skip row: Missing symbol');
          errorCount++;
          continue;
        }
        
        // Check if the stock exists
        const stock = await prisma.stock.findUnique({
          where: { symbol: stockProfileData.symbol },
        });
        
        if (!stock) {
          console.error(`Skip row for ${stockProfileData.symbol}: Stock not found`);
          errorCount++;
          continue;
        }
        
        // Try to get the stock profile first to check if it exists
        const existingProfile = await prisma.stockProfile.findUnique({
          where: { symbol: stockProfileData.symbol },
        });
        
        if (existingProfile) {
          // Update existing stock profile
          console.log(`Updating existing stock profile: ${stockProfileData.symbol}`);
          await prisma.stockProfile.update({
            where: { symbol: stockProfileData.symbol },
            data: {
              price: stockProfileData.price,
              profit: stockProfileData.profit,
              volume: stockProfileData.volume,
              pe: stockProfileData.pe,
              eps: stockProfileData.eps,
              roa: stockProfileData.roa,
              roe: stockProfileData.roe,
            },
          });
        } else {
          // Create new stock profile
          console.log(`Creating new stock profile: ${stockProfileData.symbol}`);
          await prisma.stockProfile.create({
            data: stockProfileData,
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
    await prisma.$disconnect();
  }
}

/**
 * Helper function to parse float values or return null if invalid
 */
function parseFloatOrNull(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

// Execute the import function
importStockProfilesFromExcel(filePath)
  .then(() => {
    console.log('Stock profile import script completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Stock profile import script failed:', error);
    process.exit(1);
  }); 