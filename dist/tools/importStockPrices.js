"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importStockPricesFromExcel = importStockPricesFromExcel;
const XLSX = __importStar(require("xlsx"));
const stockPrice_service_1 = require("../services/stockPrice.service");
const stock_service_1 = require("../services/stock.service");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
console.log('importStockPrices.ts loaded!');
// Initialize the services
console.log('Initializing services...');
let stockPriceService;
let stockService;
try {
    stockPriceService = new stockPrice_service_1.StockPriceService();
    stockService = new stock_service_1.StockService();
    console.log('Services initialized successfully');
}
catch (error) {
    console.error('Error initializing services:', error);
    throw error;
}
/**
 * Convert Excel date (number of days since 1/1/1900) to JavaScript Date
 * @param excelDate Excel date value
 */
function excelDateToJSDate(excelDate) {
    // Excel's epoch starts on Jan 1, 1900, while JavaScript's starts on Jan 1, 1970
    // Excel has a leap year bug where it thinks 1900 was a leap year
    // So we subtract 1 if the date is after Feb 28, 1900
    let daysSince1900 = excelDate;
    // Excel's epoch starts on Jan 1, 1900
    const dateObj = new Date(Date.UTC(1900, 0, 1)); // Jan 1, 1900 in UTC
    // Excel has a leap year bug where it thinks 1900 was a leap year
    // If date is after Feb 28, 1900, subtract 1
    if (daysSince1900 > 59) {
        daysSince1900 -= 1;
    }
    // Add the days
    dateObj.setUTCDate(dateObj.getUTCDate() + daysSince1900 - 1); // -1 because Excel considers Jan 1, 1900 as day 1
    return dateObj;
}
/**
 * Import stock prices from Excel file
 * @param filePath Path to the Excel file
 */
async function importStockPricesFromExcel(filePath) {
    console.log('importStockPricesFromExcel function called with path:', filePath);
    try {
        console.log(`Reading file: ${filePath}`);
        // Check if file exists
        if (!fs_1.default.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        // Read the Excel file
        const workbook = XLSX.read(fs_1.default.readFileSync(filePath), { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // Convert the worksheet to JSON
        const data = XLSX.utils.sheet_to_json(worksheet);
        if (data.length === 0) {
            console.log('No data found in Excel file');
            return;
        }
        console.log(`Found ${data.length} stock price entries to import`);
        // Keep track of unique symbols to validate their existence
        const symbols = new Set();
        const stockPriceData = [];
        // Process each row
        for (const row of data) {
            try {
                // Extract stock price data from row
                // Adjust these field names based on the actual Excel column headers
                const symbol = (row.symbol || row.Symbol || row.mã || row.Mã || '').toString().toUpperCase();
                const dateValue = row.date || row.Date || row.ngày || row.Ngày;
                let date;
                // Try to parse the date
                if (dateValue instanceof Date) {
                    date = dateValue;
                }
                else if (typeof dateValue === 'number') {
                    // Excel stores dates as numbers of days since 1/1/1900
                    // Need to convert to JavaScript Date
                    date = excelDateToJSDate(dateValue);
                }
                else if (typeof dateValue === 'string') {
                    date = new Date(dateValue);
                }
                else {
                    console.error(`Skip row for ${symbol}: Invalid date format`, dateValue);
                    continue;
                }
                // Check if date is valid
                if (isNaN(date.getTime())) {
                    console.error(`Skip row for ${symbol}: Invalid date`, dateValue);
                    continue;
                }
                console.log(`Processing ${symbol} for date ${date.toISOString().split('T')[0]}`);
                const stockPriceEntry = {
                    symbol,
                    date,
                    open: parseFloat(row.open || row.Open || 0),
                    high: parseFloat(row.high || row.High || 0),
                    low: parseFloat(row.low || row.Low || 0),
                    close: parseFloat(row.close || row.Close || 0),
                    volume: row.volume || row.Volume ? parseInt(row.volume || row.Volume) : undefined,
                    trendQ: row.trendQ || row.TrendQ ? parseFloat(row.trendQ || row.TrendQ) : undefined,
                    fq: row.fq || row.FQ ? parseFloat(row.fq || row.FQ) : undefined,
                    bandDown: row.bandDown || row.BandDown ? parseFloat(row.bandDown || row.BandDown) : undefined,
                    bandUp: row.bandUp || row.BandUp ? parseFloat(row.bandUp || row.BandUp) : undefined,
                };
                // Validate required fields
                if (!stockPriceEntry.symbol) {
                    console.error('Skip row: Missing symbol');
                    continue;
                }
                // Check if we have valid price data
                if (isNaN(stockPriceEntry.open) || isNaN(stockPriceEntry.high) ||
                    isNaN(stockPriceEntry.low) || isNaN(stockPriceEntry.close)) {
                    console.error(`Skip row for ${stockPriceEntry.symbol}: Invalid price data`);
                    continue;
                }
                // Add symbol to the set for later validation
                symbols.add(stockPriceEntry.symbol);
                // Add to the batch
                stockPriceData.push(stockPriceEntry);
            }
            catch (error) {
                console.error(`Error processing row:`, row, error);
            }
        }
        // Validate all symbols exist in the database
        console.log(`Validating ${symbols.size} unique symbols...`);
        const invalidSymbols = new Set();
        for (const symbol of symbols) {
            const stock = await stockService.getStockBySymbol(symbol);
            if (!stock) {
                console.error(`Symbol not found in database: ${symbol}`);
                invalidSymbols.add(symbol);
            }
        }
        // Filter out entries with invalid symbols
        const validStockPriceData = stockPriceData.filter(item => !invalidSymbols.has(item.symbol));
        if (validStockPriceData.length === 0) {
            console.log('No valid stock price data to import');
            return;
        }
        console.log(`Importing ${validStockPriceData.length} stock price entries...`);
        // Bulk import the data
        const importedCount = await stockPriceService.bulkCreateStockPrices(validStockPriceData);
        console.log(`Successfully imported ${importedCount} stock price entries`);
    }
    catch (error) {
        console.error('Import failed:', error);
    }
}
console.log('Checking if module is main module...');
// Run the import if this file is executed directly
if (require.main === module) {
    console.log('This file is being run directly');
    const filePath = process.argv[2] || path_1.default.join(process.cwd(), 'import', 'stock-price.xlsx');
    console.log(`Using file path: ${filePath}`);
    importStockPricesFromExcel(filePath)
        .then(() => {
        console.log('Import process completed');
        process.exit(0);
    })
        .catch((error) => {
        console.error('Import process failed:', error);
        process.exit(1);
    });
}
else {
    console.log('This file is being imported as a module');
}
