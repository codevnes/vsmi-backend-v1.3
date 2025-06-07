#!/usr/bin/env node

// This script is used to import stock prices from an Excel file
console.log('Starting import-stock-prices script...');

// Pass command line arguments
const args = process.argv.slice(2);
console.log('Command line arguments:', args);

try {
  console.log('Loading ts-node/register...');
  require('ts-node/register');
  
  console.log('Loading importStockPrices.ts...');
  const { importStockPricesFromExcel } = require('../src/tools/importStockPrices.ts');
  
  // Get the file path from command line or use default
  const filePath = args[0] || 'import/stock-price.xlsx';
  console.log(`Using file path: ${filePath}`);
  
  // Run the import function
  importStockPricesFromExcel(filePath)
    .then(() => {
      console.log('Import completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Import failed:', error);
      process.exit(1);
    });
} catch (error) {
  console.error('Error during script execution:', error);
  process.exit(1);
} 