#!/usr/bin/env node
/**
 * Script to import Technical Analysis data from Excel file
 * Usage: node scripts/import-technical-analyses.js [filePath]
 * (Defaults to import/technical-analyses/PTKT_UPDATE.xlsx)
 *
 * This script requires that the project is built first (if using TS-compiled Prisma client elsewhere).
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Default file path if not provided via command line arguments
const defaultFilePath = path.join(process.cwd(), 'import', 'technical-analyses', 'PTKT_UPDATE.xlsx');
const filePath = process.argv[2] || defaultFilePath;

/**
 * Helper function to parse float or return null if invalid or empty
 */
function parseFloatOrNull(value) {
  if (value === undefined || value === null || String(value).trim() === '') {
    return null;
  }
  const parsed = parseFloat(String(value).replace(',', '.')); // Replace comma with dot for decimal
  return isNaN(parsed) ? null : parsed;
}

/**
 * Helper function to parse string or return null if empty
 */
function parseStringOrNull(value) {
  if (value === undefined || value === null || String(value).trim() === '') {
    return null;
  }
  return String(value).trim();
}

/**
 * Import Technical Analysis data from Excel file
 */
async function importTechnicalAnalyses(filePath) {
  try {
    console.log(`Reading Excel file: ${filePath}`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}. Please ensure the file exists at this path or provide the correct path as an argument.`);
    }

    const workbook = XLSX.read(fs.readFileSync(filePath), { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      console.log('No data found in the Excel file.');
      return;
    }

    console.log(`Found ${data.length} entries to import/update.`);

    let successCount = 0;
    let errorCount = 0;

    for (const row of data) {
      console.log('Excel Row Keys:', Object.keys(row));

      // Use the exact column name for symbol from your LATEST Excel log
      const symbol = parseStringOrNull(row['Symbol']);

      if (!symbol) {
        console.warn('Skipping row due to missing symbol (Column \'Symbol\' not found or empty):', row);
        errorCount++;
        continue;
      }

      const standardSymbol = symbol.toUpperCase();

      try {
        // Updated mappings based on the exact Excel column names
        const technicalAnalysisData = {
          close: parseFloatOrNull(row['Close']),
          
          // RSI related fields
          rsi14: parseFloatOrNull(row['Relative Strength Index (14)']),
          rsiEvaluation: parseStringOrNull(row['TH_RSI']),
          
          // Stochastic related fields
          stochasticK: parseFloatOrNull(row['Stochastic_%K']),
          stochasticEvaluation: parseStringOrNull(row['TH_STOCHASTIC']),
          
          // Williams R related fields
          williamsR: parseFloatOrNull(row['Williams_%R']),
          williamsEvaluation: parseStringOrNull(row['TH_WILLIAM']),
          
          // Ultimate Oscillator related fields
          ultimateOscillator: parseFloatOrNull(row['Ultimate_Oscillator']),
          ultimateOscillatorEvaluation: parseStringOrNull(row['TH_UO']),
          
          // CCI related fields
          cci20: parseFloatOrNull(row['Commodity Channel Index (20)']),
          cciEvaluation: parseStringOrNull(row['TH_CCI']),
          
          // StochRSI related fields
          stochasticRsiFast: parseFloatOrNull(row['Stochastic RSI Fast']),
          stochasticRsiFastEvaluation: parseStringOrNull(row['TH_SRF']),
          
          // MACD related fields
          macdLevel: parseFloatOrNull(row['MACD Level (12, 26)']),
          macdEvaluation: parseStringOrNull(row['XH_MACD']),
          
          // ADX related fields
          adx14: parseFloatOrNull(row['Average Directional Index (14)']),
          adxEvaluation: parseStringOrNull(row['XH_ADX']),
          
          // Momentum related fields
          momentum10: parseFloatOrNull(row['Momentum (10)']),
          momentumEvaluation: parseStringOrNull(row['XH_Momen']),
          
          // Moving Average fields
          ma10: parseFloatOrNull(row['MA (10)']),
          ma10Evaluation: parseStringOrNull(row['XH_MA10']),
          
          ma20: parseFloatOrNull(row['MA (20)']),
          ma20Evaluation: parseStringOrNull(row['XH_MA20']),
          
          ma30: parseFloatOrNull(row['MA (30)']),
          ma30Evaluation: parseStringOrNull(row['XH_MA30']),
          
          ma50: parseFloatOrNull(row['MA (50)']),
          ma50Evaluation: parseStringOrNull(row['XH_MA50']),
          
          ma100: parseFloatOrNull(row['MA (100)']),
          ma100Evaluation: parseStringOrNull(row['XH_MA100']),
          
          ma200: parseFloatOrNull(row['MA (200)']),
          ma200Evaluation: parseStringOrNull(row['XH_MA200']),
          
          // Hull Moving Average and Ichimoku
          hma9: parseFloatOrNull(row['Hull Moving Average (9)']),
          hma9Evaluation: parseStringOrNull(row['XH_HMA']),
          
          ichimokuBaseLine: parseFloatOrNull(row['Ichimoku Base Line']),
          ichimokuBaseLineEvaluation: parseStringOrNull(row['XH_IBL']),
        };

        Object.keys(technicalAnalysisData).forEach(key => {
          if (technicalAnalysisData[key] === null || technicalAnalysisData[key] === undefined) {
            delete technicalAnalysisData[key];
          }
        });
        
        if (Object.keys(technicalAnalysisData).length === 0 && !row['Close']) {
            console.warn(`No valid data to import or update for symbol ${standardSymbol} after parsing row:`, row);
            errorCount++;
            continue;
        }

        await prisma.technicalAnalysis.upsert({
          where: { symbol: standardSymbol },
          create: {
            stock: { 
              connect: { symbol: standardSymbol },
            },
            ...technicalAnalysisData,
          },
          update: technicalAnalysisData,
        });

        successCount++;
      } catch (e) {
        errorCount++;
        console.error(`Failed to process symbol ${standardSymbol}: ${e.message}`, row, e);
        if (e.code === 'P2025' && e.meta && e.meta.cause === 'Record to connect to not found.') {
            console.error(`  => Detail: Stock with symbol '${standardSymbol}' not found. Ensure stock exists before importing technical analysis.`);
        }
      }
    }

    console.log(`\nImport process finished.`);
    console.log(`Successfully upserted: ${successCount} records.`);
    console.log(`Failed to process: ${errorCount} records.`);

  } catch (error) {
    console.error('An error occurred during the import process:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Disconnected from database.');
  }
}

// Run the import function
importTechnicalAnalyses(filePath)
  .then(() => {
    console.log('Import script finished execution.');
  })
  .catch((error) => {
    console.error('Import script failed with an unhandled error:', error);
    process.exit(1);
  }); 