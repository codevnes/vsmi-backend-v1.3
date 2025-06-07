import * as XLSX from 'xlsx';
import { FinancialMetricsService } from '../services/financialMetrics.service';
import { StockService } from '../services/stock.service';
import path from 'path';
import fs from 'fs';

console.log('importFinancialMetrics.ts loaded!');

// Initialize the services
console.log('Initializing services...');
const financialMetricsService = new FinancialMetricsService();
const stockService = new StockService();
console.log('Services initialized successfully');

/**
 * Convert Excel date (number of days since 1/1/1900) to JavaScript Date
 * @param excelDate Excel date value
 */
function excelDateToJSDate(excelDate: number): Date {
  // Excel's epoch starts on Jan 1, 1900, while JavaScript's epoch starts on Jan 1, 1970
  // Excel also incorrectly assumes 1900 is a leap year, so we need to adjust
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const daysSinceEpoch = excelDate - 25569; // 25569 is the number of days between Jan 1, 1900 and Jan 1, 1970
  
  // If the date is before March 1, 1900, we need to adjust for Excel's leap year bug
  if (excelDate < 60) {
    return new Date(daysSinceEpoch * millisecondsPerDay);
  } else {
    // Adjust for Excel's leap year bug (Excel thinks 1900 is a leap year)
    return new Date((daysSinceEpoch - 1) * millisecondsPerDay);
  }
}

/**
 * Extract year from Excel date serial number
 * @param excelDate Excel date serial number
 */
function extractYearFromExcelDate(excelDate: number): number {
  const date = excelDateToJSDate(excelDate);
  return date.getFullYear();
}

/**
 * Import financial metrics from Excel file
 * @param filePath Path to the Excel file
 * @param type Type of data ('year' or 'quy'/'quarter')
 */
async function importFinancialMetricsFromExcel(filePath: string, type: string = 'year'): Promise<void> {
  console.log(`importFinancialMetricsFromExcel function called with path: ${filePath}, type: ${type}`);
  
  try {
    // Resolve file path
    const resolvedPath = path.resolve(filePath);
    console.log(`Resolved file path: ${resolvedPath}`);
    
    // Check if file exists
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`File not found: ${resolvedPath}`);
    }
    
    // Read Excel file
    console.log('Reading Excel file...');
    const workbook = XLSX.readFile(resolvedPath);
    
    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convert sheet to JSON
    console.log('Converting sheet to JSON...');
    const data = XLSX.utils.sheet_to_json(sheet);
    console.log(`Found ${data.length} rows of data`);
    
    if (data.length === 0) {
      throw new Error('No data found in Excel file');
    }
    
    // Check if this is quarterly or yearly data
    const isQuarterly = type.toLowerCase() === 'quy' || type.toLowerCase() === 'quarter';
    
    // Validate required columns
    const requiredColumns = ['symbol', 'year'];
    if (isQuarterly) {
      requiredColumns.push('quarter');
    }
    
    const firstRow = data[0] as any;
    
    for (const column of requiredColumns) {
      if (!(column in firstRow)) {
        throw new Error(`Required column '${column}' not found in Excel file`);
      }
    }
    
    // Transform data
    console.log('Transforming data...');
    let skippedCount = 0;
    const financialMetrics = data.map((row: any) => {
      // Handle year and quarter
      let year: number;
      
      // Check if this is yearly data with Excel date serial numbers
      // Excel date serial numbers are typically much larger than valid years (e.g., 45657)
      if (typeof row.year === 'number' && !isQuarterly && row.year > 10000) { 
        year = extractYearFromExcelDate(row.year);
      } else {
        // For quarterly data or already correct year format
        year = parseInt(row.year);
      }
      
      let quarter = null;
      
      if (isQuarterly) {
        // For quarterly data, quarter is required
        if ('quarter' in row && row.quarter !== null && row.quarter !== undefined && row.quarter !== '') {
          quarter = parseInt(row.quarter);
        } else {
          // Skip this row if quarter is not present for quarterly data
          skippedCount++;
          console.log(`Skipping row for symbol ${row.symbol} with year ${year} - missing quarter value`);
          return null;
        }
      } else {
        // For yearly data, quarter should be null
        quarter = null;
      }
      
      // Create financial metrics object
      return {
        symbol: row.symbol.toString().toUpperCase(),
        year,
        quarter,
        eps: 'eps' in row && row.eps !== null && row.eps !== '' ? parseFloat(row.eps) : null,
        epsIndustry: 'epsIndustry' in row && row.epsIndustry !== null && row.epsIndustry !== '' ? parseFloat(row.epsIndustry) : null,
        pe: 'pe' in row && row.pe !== null && row.pe !== '' ? parseFloat(row.pe) : null,
        peIndustry: 'peIndustry' in row && row.peIndustry !== null && row.peIndustry !== '' ? parseFloat(row.peIndustry) : null,
        roa: 'roa' in row && row.roa !== null && row.roa !== '' ? parseFloat(row.roa) : null,
        roe: 'roe' in row && row.roe !== null && row.roe !== '' ? parseFloat(row.roe) : null,
        roaIndustry: 'roaIndustry' in row && row.roaIndustry !== null && row.roaIndustry !== '' ? parseFloat(row.roaIndustry) : null,
        roeIndustry: 'roeIndustry' in row && row.roeIndustry !== null && row.roeIndustry !== '' ? parseFloat(row.roeIndustry) : null,
        revenue: 'revenue' in row && row.revenue !== null && row.revenue !== '' ? parseFloat(row.revenue) : null,
        margin: 'margin' in row && row.margin !== null && row.margin !== '' ? parseFloat(row.margin) : null,
        totalDebtToEquity: 'total_debt_to_equity' in row && row.total_debt_to_equity !== null && row.total_debt_to_equity !== '' ? parseFloat(row.total_debt_to_equity) : null,
        totalAssetsToEquity: 'total_assets_to_equity' in row && row.total_assets_to_equity !== null && row.total_assets_to_equity !== '' ? parseFloat(row.total_assets_to_equity) : null,
      };
    }).filter(item => item !== null); // Filter out any null items (skipped rows)
    
    console.log(`Transformed ${financialMetrics.length} financial metrics records`);
    console.log(`Skipped ${skippedCount} records due to missing data`);
    console.log(`Records with valid data: ${financialMetrics.length}`);
    
    // Bulk create financial metrics
    console.log('Importing financial metrics to database...');
    const importedCount = await financialMetricsService.bulkCreateFinancialMetrics(financialMetrics);
    
    console.log(`Successfully imported ${importedCount} financial metrics records`);
  } catch (error) {
    console.error('Error importing financial metrics:', error);
    throw error;
  }
}

// If this file is run directly, execute the import function with command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Please provide the path to the Excel file');
    process.exit(1);
  }
  
  const filePath = args[0];
  
  importFinancialMetricsFromExcel(filePath)
    .then(() => {
      console.log('Import completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Import failed:', error);
      process.exit(1);
    });
} else {
  // Export the function for use in other files
  module.exports = { importFinancialMetricsFromExcel };
} 