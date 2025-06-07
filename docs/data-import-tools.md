# Data Import Tools

These tools allow importing data from Excel files into the VSMI database.

## Import Stocks

The stock import tool reads stock data from an Excel file and imports it into the database.

### Usage

```bash
# Using npm script
npm run import:stocks [path/to/file.xlsx]

# Or directly
node scripts/import-stocks.js [path/to/file.xlsx]
```

If no file path is provided, the tool will look for a file at `import/stock.xlsx` by default.

### Excel Format

The Excel file should have the following columns:
- `symbol` (required): The stock symbol/ticker (e.g., VNM)
- `name` (required): The company name
- `exchange` (optional): The exchange where the stock is traded (e.g., HOSE)
- `industry` (optional): The industry sector of the company 
- `description` (optional): A description of the company

### Example Excel Format

| symbol | name                     | exchange | industry            | description |
|--------|--------------------------|----------|---------------------|-------------|
| VNM    | Vietnam Dairy Products   | HOSE     | Food Products       |             |
| VCB    | Bank for Foreign Trade   | HOSE     | Banking Services    |             |

### Behavior

- New stocks will be created
- Existing stocks (matching by symbol) will be updated
- Symbols are automatically converted to uppercase
- Missing required fields will cause that row to be skipped

## Import Stock Prices

The stock price import tool reads historical price data from an Excel file and imports it into the database.

### Usage

```bash
# Using npm script
npm run import:stock-prices [path/to/file.xlsx]

# Or directly
node scripts/import-stock-prices.js [path/to/file.xlsx]
```

If no file path is provided, the tool will look for a file at `import/stock-price.xlsx` by default.

### Excel Format

The Excel file should have the following columns:
- `symbol` (required): The stock symbol/ticker (e.g., VNM)
- `date` (required): The date of the price data (e.g., 2023-01-15)
- `open` (required): The opening price
- `high` (required): The highest price during the trading day
- `low` (required): The lowest price during the trading day
- `close` (required): The closing price
- `volume` (optional): The trading volume
- `trendQ` (optional): Trend quality indicator
- `fq` (optional): FQ indicator
- `bandDown` (optional): Lower Bollinger Band
- `bandUp` (optional): Upper Bollinger Band

### Example Excel Format

| symbol | date       | open    | high    | low     | close   | volume  | trendQ | fq   | bandDown | bandUp |
|--------|------------|---------|---------|---------|---------|---------|--------|------|----------|--------|
| VNM    | 2023-01-15 | 80000.0 | 82000.0 | 79500.0 | 81500.0 | 1500000 | 0.85   | 0.72 | 78000.0  | 85000.0|
| VCB    | 2023-01-15 | 85000.0 | 87000.0 | 84000.0 | 86500.0 | 2000000 | 0.90   | 0.75 | 82000.0  | 89000.0|

### Behavior

- Stock symbols must exist in the database before importing their prices
- The tool validates that all symbols exist before import
- Stock prices are upserted (created if they don't exist, updated if they do)
- Dates are automatically parsed from various formats
- Invalid rows (missing required data, invalid symbols) are skipped
- The import uses bulk operations for better performance

## Inspect Excel Files

You can inspect the structure of an Excel file to understand its content before importing:

```bash
# Using npm script
npm run inspect:excel [path/to/file.xlsx]

# Or directly
node scripts/inspect-excel.js [path/to/file.xlsx]
```

This tool will display:
- Available sheets in the workbook
- Headers (column names)
- Sample data from the first few rows
- Total number of rows

## Future Extensions

The import system is designed to be extensible. Additional importers can be added for:
- Financial metrics
- Currency data
- Other entities in the system

## Troubleshooting

If you encounter issues with imports:

1. Check that the Excel file has the required fields
2. Make sure the database connection is working properly
3. Verify that the Excel file is not open in another application
4. Inspect the file structure using the `inspect:excel` tool
5. For stock prices, ensure that the stock symbols already exist in the database 

## Công cụ Import Dữ liệu

### Import Giá Cổ Phiếu

// ... existing code ...

### Import Chỉ số Tài chính

Công cụ này cho phép nhập dữ liệu chỉ số tài chính từ file Excel vào cơ sở dữ liệu.

#### Cách sử dụng

```bash
npm run import:financial-metrics [đường_dẫn_file_excel]
```

Nếu không cung cấp đường dẫn, công cụ sẽ tìm file mặc định tại `import/financial-metrics.xlsx`.

#### Định dạng file Excel

File Excel phải có các cột sau:
- `symbol` (bắt buộc): Mã chứng khoán
- `year` (bắt buộc): Năm của dữ liệu
- `quarter` (tùy chọn): Quý của dữ liệu (để trống nếu là dữ liệu năm)
- `eps`: Thu nhập trên mỗi cổ phiếu
- `epsIndustry`: Thu nhập trên mỗi cổ phiếu trung bình ngành
- `pe`: Tỷ lệ giá trên thu nhập
- `peIndustry`: Tỷ lệ giá trên thu nhập trung bình ngành
- `roa`: Tỷ suất lợi nhuận trên tài sản
- `roe`: Tỷ suất lợi nhuận trên vốn chủ sở hữu
- `roaIndustry`: Tỷ suất lợi nhuận trên tài sản trung bình ngành
- `roeIndustry`: Tỷ suất lợi nhuận trên vốn chủ sở hữu trung bình ngành
- `revenue`: Doanh thu
- `margin`: Biên lợi nhuận
- `totalDebtToEquity`: Tỷ lệ nợ trên vốn chủ sở hữu
- `totalAssetsToEquity`: Tỷ lệ tài sản trên vốn chủ sở hữu

Các cột khác ngoài danh sách trên sẽ bị bỏ qua.

#### Ví dụ

| symbol | year | quarter | eps  | pe   | roe  | roa  | revenue    |
|--------|------|---------|------|------|------|------|------------|
| VNM    | 2023 | 1       | 1250 | 15.2 | 18.5 | 12.3 | 15000000000 |
| VNM    | 2023 | 2       | 1300 | 14.8 | 19.1 | 12.7 | 16000000000 |
| FPT    | 2023 | 1       | 950  | 16.5 | 17.2 | 10.5 | 8500000000  |

// ... existing code ... 