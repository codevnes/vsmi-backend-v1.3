"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importData = importData;
const path_1 = __importDefault(require("path"));
const importStocks_1 = require("./importStocks");
const importFScores_1 = require("./importFScores");
/**
 * Main import function
 * @param type Type of data to import
 * @param filePath Path to the import file
 */
async function importData(type, filePath) {
    try {
        console.log(`Starting import of ${type} data`);
        switch (type) {
            case 'stocks':
                // Default path if not provided
                const stockFilePath = filePath || path_1.default.join(process.cwd(), 'import', 'stock.xlsx');
                await (0, importStocks_1.importStocksFromExcel)(stockFilePath);
                break;
            case 'fscores':
                // Default path if not provided
                const fscoreFilePath = filePath || path_1.default.join(process.cwd(), 'import', 'fscore', 'FScore.xlsx');
                await (0, importFScores_1.importFScoresFromExcel)(fscoreFilePath);
                break;
            default:
                console.error(`Unknown import type: ${type}`);
                break;
        }
        console.log(`${type} import completed`);
    }
    catch (error) {
        console.error(`${type} import failed:`, error);
        throw error;
    }
}
// Parse command line arguments
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Usage: ts-node importData.ts <type> [filePath]');
        console.error('  type: The type of data to import (stocks, fscores)');
        console.error('  filePath: Optional path to the import file');
        process.exit(1);
    }
    const type = args[0];
    const filePath = args[1];
    importData(type, filePath)
        .then(() => {
        console.log('Import process completed successfully');
        process.exit(0);
    })
        .catch((error) => {
        console.error('Import process failed:', error);
        process.exit(1);
    });
}
