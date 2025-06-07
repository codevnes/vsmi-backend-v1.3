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
exports.importFScoresFromExcel = importFScoresFromExcel;
const XLSX = __importStar(require("xlsx"));
const fscore_service_1 = require("../services/fscore.service");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app_1 = require("../app");
// Initialize the FScore service
const fscoreService = new fscore_service_1.FScoreService();
/**
 * Import FScores from Excel file
 * @param filePath Path to the Excel file
 */
async function importFScoresFromExcel(filePath) {
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
        console.log(`Found ${data.length} FScore entries to import`);
        // Process each row
        let successCount = 0;
        let errorCount = 0;
        for (const row of data) {
            try {
                // Extract stock symbol - must be present
                const symbol = row.symbol || row.Symbol || row['Mã CK'] || row['Ma CK'];
                if (!symbol) {
                    console.error('Skip row: Missing symbol');
                    errorCount++;
                    continue;
                }
                // Standardize symbol (uppercase)
                const standardSymbol = symbol.toUpperCase();
                // Extract FScore data from row with updated column mappings
                const fscoreData = {
                    symbol: standardSymbol,
                    roa: parseFloatOrNull(row.roa || row.ROA),
                    cfo: parseFloatOrNull(row.cfo || row.CFO),
                    deltaRoa: parseFloatOrNull(row.deltaRoa || row['ΔROA']),
                    cfoMinusNetProfit: parseFloatOrNull(row.cfoMinusNetProfit || row['CFO_LNST']),
                    deltaLongTermDebt: parseFloatOrNull(row.deltaLongTermDebt || row['Δno dai han']),
                    deltaCurrentRatio: parseFloatOrNull(row.deltaCurrentRatio || row['ΔCurrent Ratio']),
                    newlyIssuedShares: parseFloatOrNull(row.newlyIssuedShares || row['SLCP_PH']),
                    deltaGrossMargin: parseFloatOrNull(row.deltaGrossMargin || row['ΔGross Margin']),
                    deltaAssetTurnover: parseFloatOrNull(row.deltaAssetTurnover || row['ΔAsset Turnover']),
                    priceToForecastEps: parseFloatOrNull(row.priceToForecastEps || row['Price voi EPS du phong'] || row.PE),
                    // Boolean values - mapping to actual Excel column names
                    roaPositive: parseBooleanOrNull(row.roaPositive || row['ROA>0']),
                    cfoPositive: parseBooleanOrNull(row.cfoPositive || row['CFO>0']),
                    deltaRoaPositive: parseBooleanOrNull(row.deltaRoaPositive || row['ΔROA>0']),
                    cfoGreaterThanNetProfit: parseBooleanOrNull(row.cfoGreaterThanNetProfit || row['CFO>LNST']),
                    deltaLongTermDebtNegative: parseBooleanOrNull(row.deltaLongTermDebtNegative || row['ΔNợ dài hạn<0']),
                    deltaCurrentRatioPositive: parseBooleanOrNull(row.deltaCurrentRatioPositive || row['ΔCurrent Ratio>0']),
                    noNewSharesIssued: parseBooleanOrNull(row.noNewSharesIssued || row['Không phát hành CP']),
                    deltaGrossMarginPositive: parseBooleanOrNull(row.deltaGrossMarginPositive || row['ΔGross Margin>0']),
                    deltaAssetTurnoverPositive: parseBooleanOrNull(row.deltaAssetTurnoverPositive || row['ΔAsset Turnover>0'])
                };
                // Try to get the FScore first to check if it exists
                const existingFScore = await app_1.prisma.$queryRaw `
          SELECT * FROM "FScore" WHERE symbol = ${standardSymbol}
        `;
                if (existingFScore && Array.isArray(existingFScore) && existingFScore.length > 0) {
                    // Update existing FScore
                    console.log(`Updating existing FScore for: ${standardSymbol}`);
                    // Use Prisma's update method to handle the UUID type properly
                    await app_1.prisma.fScore.update({
                        where: {
                            symbol: standardSymbol
                        },
                        data: fscoreData
                    });
                }
                else {
                    // Create new FScore
                    console.log(`Creating new FScore for: ${standardSymbol}`);
                    // Use Prisma's create method to handle the UUID type properly
                    await app_1.prisma.fScore.create({
                        data: fscoreData
                    });
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
/**
 * Helper function to parse float or return null if invalid
 */
function parseFloatOrNull(value) {
    if (value === undefined || value === null || value === '') {
        return null;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
}
/**
 * Helper function to parse boolean or return null if invalid
 */
function parseBooleanOrNull(value) {
    if (value === undefined || value === null || value === '') {
        return null;
    }
    // Handle different representations of boolean values
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'number') {
        return value !== 0;
    }
    if (typeof value === 'string') {
        const lowerValue = value.toLowerCase().trim();
        if (['true', 'yes', 'y', '1'].includes(lowerValue)) {
            return true;
        }
        if (['false', 'no', 'n', '0'].includes(lowerValue)) {
            return false;
        }
    }
    return null;
}
// Run the import if this file is executed directly
if (require.main === module) {
    const filePath = process.argv[2] || path_1.default.join(process.cwd(), 'import', 'fscore', 'FScore.xlsx');
    importFScoresFromExcel(filePath)
        .then(() => {
        console.log('FScore import process completed');
        process.exit(0);
    })
        .catch((error) => {
        console.error('FScore import process failed:', error);
        process.exit(1);
    });
}
