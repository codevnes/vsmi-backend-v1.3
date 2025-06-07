# Selected Stocks Import Tool

This documentation explains how to use the import tool for selected stocks.

## Overview

The Selected Stocks Import Tool allows you to import selected stocks data from an Excel file into the database. The tool supports various column names and formats to make importing data easier.

## Excel File Format

The tool expects an Excel file with at least the following columns:
- `Symbol` or `Mã CK`: Stock symbol (required)
- `Date` or `Ngày`: Date when the stock was selected (required)

Optional columns:
- `Close` or `Giá` or `Giá đóng cửa`: Closing price
- `Return` or `Lợi nhuận`: Return value
- `QIndex` or `Q-Index` or `Chỉ số Q`: Q-Index value
- `Volume` or `Khối lượng`: Trading volume

The tool is flexible and will recognize column names in both English and Vietnamese, with various capitalizations.

## Default File Location

If no file path is provided, the tool will look for a file at the following location:

```
/import/selected-stocks/data.xlsx
```

## Usage

### Using NPM Script

```bash
npm run import:selected-stocks [-- /path/to/file.xlsx]
```

### Using Node Directly

```bash
node scripts/import-selected-stocks.js [/path/to/file.xlsx]
```

### Using from Code

```typescript
import { importSelectedStocks } from '../src/tools/importSelectedStocks';

// Using default file path
await importSelectedStocks();

// Or with a custom file path
await importSelectedStocks('/path/to/file.xlsx');
```

## Output

The tool will output:
1. The number of entries found in the file
2. The number of entries successfully imported
3. The number of duplicates found (which are skipped)
4. The number of errors encountered

## Example

```bash
$ npm run import:selected-stocks

> vsmi-ai@1.0.0 import:selected-stocks
> node scripts/import-selected-stocks.js

Starting selected stocks import...
Reading file: /Users/username/project/import/selected-stocks/data.xlsx
Found 50 selected stock entries to import
Importing selected stock: VIC on 2023-01-15
Importing selected stock: VNM on 2023-01-15
...
Duplicate found for FPT on 2023-01-20. Skipping.
...
Import completed: 45 successful, 3 duplicates, 2 errors
Selected stocks import completed successfully 