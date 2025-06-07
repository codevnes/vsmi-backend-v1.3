#!/usr/bin/env node
/**
 * Script to inspect Excel file structure
 * Usage: node inspect-excel.js [filePath]
 */

// Import required libraries
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Get the file path from command line arguments or use default
const filePath = process.argv[2] || path.join(process.cwd(), 'import', 'stock.xlsx');

// Inspect the Excel file
function inspectExcelFile(filePath) {
  try {
    console.log(`Inspecting file: ${filePath}`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }

    // Read the Excel file
    const workbook = XLSX.read(fs.readFileSync(filePath), { type: 'buffer' });
    
    // Print sheet names
    console.log('Sheets in the workbook:');
    console.log(workbook.SheetNames);
    
    // Inspect each sheet
    for (const sheetName of workbook.SheetNames) {
      console.log(`\nInspecting sheet: ${sheetName}`);
      
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert the worksheet to JSON
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      if (data.length === 0) {
        console.log('No data found in this sheet');
        continue;
      }
      
      // Get headers (keys from the first row)
      const headers = Object.keys(data[0]);
      console.log('\nHeaders:');
      console.log(headers);
      
      // Show sample data (first row)
      console.log('\nSample row (first row):');
      console.log(data[0]);
      
      // Show sample data (second row if available)
      if (data.length > 1) {
        console.log('\nSample row (second row):');
        console.log(data[1]);
      }
      
      console.log(`\nTotal rows: ${data.length}`);
    }
    
  } catch (error) {
    console.error('Error inspecting Excel file:', error);
    process.exit(1);
  }
}

// Run the inspection
inspectExcelFile(filePath); 