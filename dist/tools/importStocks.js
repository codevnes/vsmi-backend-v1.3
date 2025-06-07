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
exports.importStocksFromExcel = importStocksFromExcel;
const XLSX = __importStar(require("xlsx"));
const stock_service_1 = require("../services/stock.service");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Initialize the stock service
const stockService = new stock_service_1.StockService();
/**
 * Import stocks from Excel file
 * @param filePath Path to the Excel file
 */
async function importStocksFromExcel(filePath) {
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
        console.log(`Found ${data.length} stock entries to import`);
        // Process each row
        let successCount = 0;
        let errorCount = 0;
        for (const row of data) {
            try {
                // Extract stock data from row
                // Adjust these field names based on the actual Excel column headers
                const stockData = {
                    symbol: row.symbol || row.Symbol || row.mã || row.Mã,
                    name: row.name || row.Name || row.tên || row.Tên,
                    exchange: row.exchange || row.Exchange || row.sàn || row.Sàn,
                    industry: row.industry || row.Industry || row.ngành || row.Ngành,
                    description: row.description || row.Description || row.mô_tả || row.Mô_tả,
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
                const existingStock = await stockService.getStockBySymbol(stockData.symbol);
                if (existingStock) {
                    // Update existing stock
                    console.log(`Updating existing stock: ${stockData.symbol}`);
                    await stockService.updateStock(stockData.symbol, stockData);
                }
                else {
                    // Create new stock
                    console.log(`Creating new stock: ${stockData.symbol}`);
                    await stockService.createStock(stockData);
                }
                successCount++;
            }
            catch (error) {
                console.error(`Error processing row:`, row, error);
                errorCount++;
            }
        }
        console.log(`Import completed: ${successCount} successful, ${errorCount} errors`);
    }
    catch (error) {
        console.error('Import failed:', error);
    }
}
// Run the import if this file is executed directly
if (require.main === module) {
    const filePath = process.argv[2] || path_1.default.join(process.cwd(), 'import', 'stock.xlsx');
    importStocksFromExcel(filePath)
        .then(() => {
        console.log('Import process completed');
        process.exit(0);
    })
        .catch((error) => {
        console.error('Import process failed:', error);
        process.exit(1);
    });
}
