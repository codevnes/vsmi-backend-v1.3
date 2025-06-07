import path from 'path';
import { importStocksFromExcel } from './importStocks';
import { importFScoresFromExcel } from './importFScores';

// Import type options
type ImportType = 'stocks' | 'fscores';

/**
 * Main import function
 * @param type Type of data to import
 * @param filePath Path to the import file
 */
async function importData(type: ImportType, filePath?: string): Promise<void> {
  try {
    console.log(`Starting import of ${type} data`);
    
    switch (type) {
      case 'stocks':
        // Default path if not provided
        const stockFilePath = filePath || path.join(process.cwd(), 'import', 'stock.xlsx');
        await importStocksFromExcel(stockFilePath);
        break;
        
      case 'fscores':
        // Default path if not provided
        const fscoreFilePath = filePath || path.join(process.cwd(), 'import', 'fscore', 'FScore.xlsx');
        await importFScoresFromExcel(fscoreFilePath);
        break;
        
      default:
        console.error(`Unknown import type: ${type}`);
        break;
    }
    
    console.log(`${type} import completed`);
  } catch (error) {
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
  
  const type = args[0] as ImportType;
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

export { importData }; 