#!/usr/bin/env node

// This script is used to import financial metrics from Excel files
console.log('Starting import-financial-metrics script...');

// Pass command line arguments
const args = process.argv.slice(2);
console.log('Command line arguments:', args);

try {
  console.log('Loading ts-node/register...');
  require('ts-node/register');
  
  console.log('Loading importFinancialMetrics.ts...');
  const { importFinancialMetricsFromExcel } = require('../src/tools/importFinancialMetrics.ts');
  
  // Get the data type from command line (year, quy/quarter, or none for both)
  const dataType = args[0] ? args[0].toLowerCase() : 'all';
  
  // Function to run the import
  async function runImport() {
    if (dataType === 'year') {
      // Import yearly data only
      const filePath = 'import/financial-metrics/BCTC_YEAR.xlsx';
      console.log(`Using data type: ${dataType}`);
      console.log(`Using file path: ${filePath}`);
      
      await importFinancialMetricsFromExcel(filePath, dataType);
      console.log('Yearly import completed successfully');
      
    } else if (dataType === 'quy' || dataType === 'quarter') {
      // Import quarterly data only
      const filePath = 'import/financial-metrics/BCTC_QUY.xlsx';
      console.log(`Using data type: ${dataType}`);
      console.log(`Using file path: ${filePath}`);
      
      await importFinancialMetricsFromExcel(filePath, dataType);
      console.log('Quarterly import completed successfully');
      
    } else {
      // Import both yearly and quarterly data
      console.log('Importing both yearly and quarterly data...');
      
      // Import yearly data first
      const yearFilePath = 'import/financial-metrics/BCTC_YEAR.xlsx';
      console.log(`Using data type: year`);
      console.log(`Using file path: ${yearFilePath}`);
      
      await importFinancialMetricsFromExcel(yearFilePath, 'year');
      console.log('Yearly import completed successfully');
      
      // Then import quarterly data
      const quyFilePath = 'import/financial-metrics/BCTC_QUY.xlsx';
      console.log(`Using data type: quy`);
      console.log(`Using file path: ${quyFilePath}`);
      
      await importFinancialMetricsFromExcel(quyFilePath, 'quy');
      console.log('Quarterly import completed successfully');
    }
  }
  
  // Run the import function
  runImport()
    .then(() => {
      console.log('All imports completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error during import:', error);
      process.exit(1);
    });
} catch (error) {
  console.error('Error during script execution:', error);
  process.exit(1);
} 