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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importFScores = importFScores;
var XLSX = __importStar(require("xlsx"));
var fscore_service_1 = require("../services/fscore.service");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
// Initialize the FScore service
var fscoreService = new fscore_service_1.FScoreService();
/**
 * Parse a value to float or return undefined if invalid
 */
function parseFloatOrUndefined(value) {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    var parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
}
/**
 * Parse a value to boolean or return undefined if invalid
 */
function parseBooleanOrUndefined(value) {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'string') {
        var lowercased = value.toLowerCase().trim();
        if (['true', 'yes', '1', 'y'].includes(lowercased)) {
            return true;
        }
        if (['false', 'no', '0', 'n'].includes(lowercased)) {
            return false;
        }
    }
    if (typeof value === 'number') {
        return value !== 0;
    }
    return undefined;
}
/**
 * Import FScores from Excel file
 * @param filePath Path to the Excel file
 */
function importFScoresFromExcel(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var workbook, sheetName, worksheet, data, successCount, errorCount, _i, data_1, row, fscoreData, error_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    console.log("Reading file: ".concat(filePath));
                    // Check if file exists
                    if (!fs_1.default.existsSync(filePath)) {
                        throw new Error("File not found: ".concat(filePath));
                    }
                    workbook = XLSX.read(fs_1.default.readFileSync(filePath), { type: 'buffer' });
                    sheetName = workbook.SheetNames[0];
                    worksheet = workbook.Sheets[sheetName];
                    data = XLSX.utils.sheet_to_json(worksheet);
                    if (data.length === 0) {
                        console.log('No data found in Excel file');
                        return [2 /*return*/];
                    }
                    console.log("Found ".concat(data.length, " FScore entries to import"));
                    successCount = 0;
                    errorCount = 0;
                    _i = 0, data_1 = data;
                    _a.label = 1;
                case 1:
                    if (!(_i < data_1.length)) return [3 /*break*/, 6];
                    row = data_1[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    fscoreData = {
                        symbol: (row.symbol || row.Symbol || row.mã || row.Mã || row['Mã CK'] || '').toString().toUpperCase(),
                        roa: parseFloatOrUndefined(row.roa || row.ROA || row.Roa),
                        cfo: parseFloatOrUndefined(row.cfo || row.CFO || row.Cfo),
                        deltaRoa: parseFloatOrUndefined(row.deltaRoa || row['delta-roa'] || row['Delta ROA']),
                        cfoMinusNetProfit: parseFloatOrUndefined(row.cfoMinusNetProfit || row['cfo-minus-net-profit'] || row['CFO - Net Profit']),
                        deltaLongTermDebt: parseFloatOrUndefined(row.deltaLongTermDebt || row['delta-long-term-debt'] || row['Delta Long Term Debt']),
                        deltaCurrentRatio: parseFloatOrUndefined(row.deltaCurrentRatio || row['delta-current-ratio'] || row['Delta Current Ratio']),
                        newlyIssuedShares: parseFloatOrUndefined(row.newlyIssuedShares || row['newly-issued-shares'] || row['Newly Issued Shares']),
                        deltaGrossMargin: parseFloatOrUndefined(row.deltaGrossMargin || row['delta-gross-margin'] || row['Delta Gross Margin']),
                        deltaAssetTurnover: parseFloatOrUndefined(row.deltaAssetTurnover || row['delta-asset-turnover'] || row['Delta Asset Turnover']),
                        priceToForecastEps: parseFloatOrUndefined(row.priceToForecastEps || row['price-to-forecast-eps'] || row['Price to Forecast EPS']),
                        roaPositive: parseBooleanOrUndefined(row.roaPositive || row['roa-positive'] || row['ROA Positive']),
                        cfoPositive: parseBooleanOrUndefined(row.cfoPositive || row['cfo-positive'] || row['CFO Positive']),
                        deltaRoaPositive: parseBooleanOrUndefined(row.deltaRoaPositive || row['delta-roa-positive'] || row['Delta ROA Positive']),
                        cfoGreaterThanNetProfit: parseBooleanOrUndefined(row.cfoGreaterThanNetProfit || row['cfo-greater-than-net-profit'] || row['CFO > Net Profit']),
                        deltaLongTermDebtNegative: parseBooleanOrUndefined(row.deltaLongTermDebtNegative || row['delta-long-term-debt-negative'] || row['Delta Long Term Debt Negative']),
                        deltaCurrentRatioPositive: parseBooleanOrUndefined(row.deltaCurrentRatioPositive || row['delta-current-ratio-positive'] || row['Delta Current Ratio Positive']),
                        noNewSharesIssued: parseBooleanOrUndefined(row.noNewSharesIssued || row['no-new-shares-issued'] || row['No New Shares Issued']),
                        deltaGrossMarginPositive: parseBooleanOrUndefined(row.deltaGrossMarginPositive || row['delta-gross-margin-positive'] || row['Delta Gross Margin Positive']),
                        deltaAssetTurnoverPositive: parseBooleanOrUndefined(row.deltaAssetTurnoverPositive || row['delta-asset-turnover-positive'] || row['Delta Asset Turnover Positive']),
                    };
                    // Validate required fields
                    if (!fscoreData.symbol) {
                        console.error('Skip row: Missing symbol');
                        errorCount++;
                        return [3 /*break*/, 5];
                    }
                    // Try to upsert the FScore (create or update)
                    console.log("Processing FScore: ".concat(fscoreData.symbol));
                    return [4 /*yield*/, fscoreService.upsert(fscoreData.symbol, fscoreData)];
                case 3:
                    _a.sent();
                    successCount++;
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error("Error processing row:", row, error_1);
                    errorCount++;
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    console.log("Import completed: ".concat(successCount, " successful, ").concat(errorCount, " errors"));
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    console.error('Import failed:', error_2);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
/**
 * Main function to run the import
 */
function importFScores(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var importFilePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    importFilePath = filePath || path_1.default.join(process.cwd(), 'import', 'fscore', 'FScore.xlsx');
                    return [4 /*yield*/, importFScoresFromExcel(importFilePath)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Allow running directly from command line
if (require.main === module) {
    var filePath = process.argv[2];
    importFScores(filePath)
        .then(function () {
        console.log('FScore import completed');
        process.exit(0);
    })
        .catch(function (error) {
        console.error('FScore import failed:', error);
        process.exit(1);
    });
}
