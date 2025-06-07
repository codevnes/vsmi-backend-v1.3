#!/usr/bin/env node

/**
 * Script to import technical recommendations from an Excel file
 *
 * Usage:
 *   node scripts/import-technical-recommendations.js [path/to/file.xlsx]
 *
 * If no file path is provided, the default path is used:
 *   import/technical-recommendations/technical-recommendations.xlsx
 */

// Import necessary modules
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient();

// Get file path from command line arguments or use default
const defaultFilePath = path.join(process.cwd(), 'import', 'technical-recommendations', 'technical-recommendations.xlsx');
const filePath = process.argv[2] || defaultFilePath;

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
 * Parse a value to string or return null if invalid
 */
function parseStringOrNull(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  return String(value).trim();
}


/**
 * Import technical recommendations from Excel file
 */
async function importTechnicalRecommendationsFromExcel(filePath) {
  try {
    console.log(`Reading file: ${filePath}`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Read the Excel file
    const workbook = XLSX.read(fs.readFileSync(filePath), { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the worksheet to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      console.log('No data found in Excel file');
      return;
    }

    // Log headers and first row to help with mapping
    console.log('--- Data Inspection ---');
    if (data.length > 0) {
      console.log('Column Headers:', Object.keys(data[0]));
      console.log('First Row (sample):', data[0]);
    }
    console.log('-----------------------');

    console.log(`Found ${data.length} technical recommendation entries to import`);

    // Process each row
    let successCount = 0;
    let errorCount = 0;

    for (const row of data) {
      try {
        // Extract data from row - !!! PLEASE ADJUST THESE COLUMN NAMES TO MATCH YOUR EXCEL FILE !!!
        const symbol = (row.symbol || row.Symbol || row['mã'] || row['Mã'] || row['Mã CK'] || '').toString().toUpperCase();
        const dateValue = row.Timestamp || row.date || row.Date || row['Ngày'];

        // Skip rows without required data
        if (!symbol || !dateValue) {
          console.warn('Skip row: Missing symbol or date.', { symbol, dateValue });
          errorCount++;
          continue;
        }

        // Convert date format
        let date;
        if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
          date = dateValue;
        } else if (typeof dateValue === 'number') {
          // Handle Excel serial date number as a fallback.
          // Note: `XLSX` with `cellDates: true` should ideally handle this.
          date = new Date(Date.UTC(1899, 11, 30 + dateValue - 1));
        } else if (typeof dateValue === 'string') {
          date = new Date(dateValue);
        }
        
        // Ensure date is valid
        if (!date || isNaN(date.getTime())) {
            console.error(`Skip row: Final date is invalid for ${symbol}:`, { dateValue });
            errorCount++;
            continue;
        }


        // !!! PLEASE ADJUST PRISMA MODEL AND FIELDS ACCORDINGLY !!!
        const recommendationData = {
          symbol,
          date,
          open: parseFloatOrNull(row.Open),
          high: parseFloatOrNull(row.High),
          low: parseFloatOrNull(row.Low),
          close: parseFloatOrNull(row.Close),
          volume: parseFloatOrNull(row.Volume),
          rsi14: parseFloatOrNull(row.RSI_14),
          macdLine: parseFloatOrNull(row.MACD_Line),
          macdSignal: parseFloatOrNull(row.MACD_Signal),
          macdHistogram: parseFloatOrNull(row.MACD_Histogram),
          stochasticK: parseFloatOrNull(row['Stochastic_%K']),
          stochasticD: parseFloatOrNull(row['Stochastic_%D']),
          williamsR: parseFloatOrNull(row['Williams_%R']),
          adx14: parseFloatOrNull(row.ADX_14),
          plusDi14: parseFloatOrNull(row.Plus_DI_14),
          minusDi14: parseFloatOrNull(row.Minus_DI_14),
          momentum10: parseFloatOrNull(row.Momentum_10),
          ultimateOscillator: parseFloatOrNull(row.Ultimate_Oscillator),
          cci20: parseFloatOrNull(row.CCI_20),
          stochRsiK: parseFloatOrNull(row['StochRSI_%K']),
          stochRsiD: parseFloatOrNull(row['StochRSI_%D']),
          awesomeOscillator: parseFloatOrNull(row.Awesome_Oscillator),
          bullPower13: parseFloatOrNull(row.Bull_Power_13),
          bearPower13: parseFloatOrNull(row.Bear_Power_13),
          sma10: parseFloatOrNull(row.SMA_10),
          ema10: parseFloatOrNull(row.EMA_10),
          sma20: parseFloatOrNull(row.SMA_20),
          ema20: parseFloatOrNull(row.EMA_20),
          sma30: parseFloatOrNull(row.SMA_30),
          ema30: parseFloatOrNull(row.EMA_30),
          sma50: parseFloatOrNull(row.SMA_50),
          ema50: parseFloatOrNull(row.EMA_50),
          sma100: parseFloatOrNull(row.SMA_100),
          ema100: parseFloatOrNull(row.EMA_100),
          sma200: parseFloatOrNull(row.SMA_200),
          ema200: parseFloatOrNull(row.EMA_200),
          hma9: parseFloatOrNull(row.HMA_9),
          ichimokuBaseLine26: parseFloatOrNull(row.Ichimoku_BaseLine_26),
        };

        // Use upsert to create a new record or update an existing one.
        await prisma.technicalRecommendation.upsert({
          where: {
            date_symbol: {
              date,
              symbol,
            },
          },
          update: recommendationData,
          create: recommendationData,
        });

        console.log(`Upserted data for: ${symbol} on ${date.toISOString().split('T')[0]}`);
        successCount++;
      } catch (error) {
        console.error('Error processing row:', row, error);
        errorCount++;
      }
    }

    console.log(`Import completed: ${successCount} upserted, ${errorCount} errors`);
  } catch (error) {
    console.error('Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
async function run() {
  try {
    console.log('Starting technical recommendations import...');
    await importTechnicalRecommendationsFromExcel(filePath);
    console.log('Technical recommendations import completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Technical recommendations import failed:', error);
    process.exit(1);
  }
}

run(); 