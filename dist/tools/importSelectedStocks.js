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
exports.importSelectedStocks = importSelectedStocks;
const XLSX = __importStar(require("xlsx"));
const selectedStocks_repository_1 = require("../repositories/selectedStocks.repository");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Initialize the repository
const selectedStocksRepository = new selectedStocks_repository_1.SelectedStocksRepository();
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
 * Import selected stocks from Excel file
 * @param filePath Path to the Excel file
 */
async function importSelectedStocksFromExcel(filePath) {
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
        console.log(`Found ${data.length} selected stock entries to import`);
        // Process each row
        let successCount = 0;
        let errorCount = 0;
        let duplicateCount = 0;
        for (const row of data) {
            try {
                // Extract selected stock data from row
                const symbol = (row.symbol || row.Symbol || row.mã || row.Mã || row['Mã CK'] || '').toString().toUpperCase();
                let dateValue = row.date || row.Date || row.ngày || row.Ngày || row['Ngày'];
                // Skip rows without required data
                if (!symbol || !dateValue) {
                    console.error('Skip row: Missing symbol or date', row);
                    errorCount++;
                    continue;
                }
                // Convert date format if it's a string
                let date;
                if (dateValue instanceof Date) {
                    date = dateValue;
                }
                else {
                    date = new Date(dateValue);
                    if (isNaN(date.getTime())) {
                        console.error(`Skip row: Invalid date format for ${symbol}:`, dateValue);
                        errorCount++;
                        continue;
                    }
                }
                const selectedStockData = {
                    symbol,
                    date,
                    close: parseFloatOrUndefined(row.close || row.Close || row.giá || row.Giá || row['Giá đóng cửa']),
                    return: parseFloatOrUndefined(row.return || row.Return || row['lợi nhuận'] || row['Lợi nhuận'] || row['Lợi Nhuận']),
                    qIndex: parseFloatOrUndefined(row.qIndex || row.QIndex || row['q-index'] || row['Q-Index'] || row['Chỉ số Q']),
                    volume: parseFloatOrUndefined(row.volume || row.Volume || row['khối lượng'] || row['Khối lượng'] || row['Khối Lượng']),
                };
                // Check if the selected stock already exists
                const existingStock = await selectedStocksRepository.findBySymbolAndDate(symbol, date);
                if (existingStock) {
                    console.log(`Duplicate found for ${symbol} on ${date.toISOString().split('T')[0]}. Skipping.`);
                    duplicateCount++;
                    continue;
                }
                // Create the selected stock
                console.log(`Importing selected stock: ${symbol} on ${date.toISOString().split('T')[0]}`);
                await selectedStocksRepository.create(selectedStockData);
                successCount++;
            }
            catch (error) {
                console.error(`Error processing row:`, row, error);
                errorCount++;
            }
        }
        console.log(`Import completed: ${successCount} successful, ${duplicateCount} duplicates, ${errorCount} errors`);
    }
    catch (error) {
        console.error('Import failed:', error);
    }
}
/**
 * Main function to run the import
 */
async function importSelectedStocks(filePath) {
    const importFilePath = filePath || path_1.default.join(process.cwd(), 'import', 'selected-stocks', 'data.xlsx');
    await importSelectedStocksFromExcel(importFilePath);
}
// Allow running directly from command line
if (require.main === module) {
    const filePath = process.argv[2];
    importSelectedStocks(filePath)
        .then(() => {
        console.log('Selected stocks import completed');
        process.exit(0);
    })
        .catch(error => {
        console.error('Selected stocks import failed:', error);
        process.exit(1);
    });
}
