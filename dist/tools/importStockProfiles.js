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
exports.importStockProfiles = importStockProfiles;
const XLSX = __importStar(require("xlsx"));
const stockProfile_service_1 = require("../services/stockProfile.service");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Initialize the stock profile service
const stockProfileService = new stockProfile_service_1.StockProfileService();
/**
 * Parse a value to float or return undefined if invalid
 */
function parseFloatOrUndefined(value) {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
}
/**
 * Import stock profiles from Excel file
 * @param filePath Path to the Excel file
 */
async function importStockProfilesFromExcel(filePath) {
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
        console.log(`Found ${data.length} stock profile entries to import`);
        // Process each row
        let successCount = 0;
        let errorCount = 0;
        for (const row of data) {
            try {
                // Extract stock profile data from row
                const stockProfileData = {
                    symbol: (row.symbol || row.Symbol || row.mã || row.Mã || row['Mã CK'] || '').toString().toUpperCase(),
                    price: parseFloatOrUndefined(row.price || row.Price || row.giá || row.Giá || row['Giá']),
                    profit: parseFloatOrUndefined(row.profit || row.Profit || row['lợi nhuận'] || row['Lợi nhuận'] || row['Lợi Nhuận']),
                    volume: parseFloatOrUndefined(row.volume || row.Volume || row['khối lượng'] || row['Khối lượng'] || row['Khối Lượng']),
                    pe: parseFloatOrUndefined(row.pe || row.PE || row.P_E || row.P_e || row['P/E']),
                    eps: parseFloatOrUndefined(row.eps || row.EPS || row.Eps),
                    roa: parseFloatOrUndefined(row.roa || row.ROA || row.Roa),
                    roe: parseFloatOrUndefined(row.roe || row.ROE || row.Roe),
                };
                // Validate required fields
                if (!stockProfileData.symbol) {
                    console.error('Skip row: Missing symbol');
                    errorCount++;
                    continue;
                }
                // Try to upsert the stock profile (create or update)
                console.log(`Processing stock profile: ${stockProfileData.symbol}`);
                await stockProfileService.upsertStockProfile(stockProfileData);
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
/**
 * Main function to run the import
 */
async function importStockProfiles(filePath) {
    const importFilePath = filePath || path_1.default.join(process.cwd(), 'import', 'stock-profiles', 'data.xlsx');
    await importStockProfilesFromExcel(importFilePath);
}
// Allow running directly from command line
if (require.main === module) {
    const filePath = process.argv[2];
    importStockProfiles(filePath)
        .then(() => {
        console.log('Stock profile import completed');
        process.exit(0);
    })
        .catch(error => {
        console.error('Stock profile import failed:', error);
        process.exit(1);
    });
}
