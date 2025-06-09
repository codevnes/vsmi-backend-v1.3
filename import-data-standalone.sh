#!/bin/bash

# VSMI Data Import Tool - Standalone version
# Script độc lập để import dữ liệu từ file Excel vào cơ sở dữ liệu VSMI

# Màu sắc để hiển thị thông báo
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Các biến mặc định cho kết nối DB
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="vsmi"
DB_USER="postgres"
DB_PASSWORD=""
CSV_TEMP_DIR="/tmp/vsmi_import"

# Hiển thị banner
echo -e "${BLUE}=================================${NC}"
echo -e "${GREEN}  VSMI Data Import Tool  ${NC}"
echo -e "${BLUE}  Standalone Version  ${NC}"
echo -e "${BLUE}=================================${NC}"

# Function để hiển thị thông báo lỗi
error() {
    echo -e "${RED}ERROR: $1${NC}" >&2
    exit 1
}

# Function để hiển thị thông báo thành công
success() {
    echo -e "${GREEN}$1${NC}"
}

# Function để hiển thị thông báo cảnh báo
warning() {
    echo -e "${YELLOW}$1${NC}"
}

# Kiểm tra các công cụ cần thiết
check_dependencies() {
    echo "Kiểm tra công cụ cần thiết..."
    
    # Kiểm tra psql
    if ! command -v psql &> /dev/null; then
        error "Không tìm thấy PostgreSQL client (psql). Vui lòng cài đặt PostgreSQL client."
    fi
    
    # Kiểm tra python và pandas
    if ! command -v python3 &> /dev/null; then
        error "Không tìm thấy Python. Vui lòng cài đặt Python 3."
    fi
    
    # Tạo thư mục tạm nếu chưa tồn tại
    mkdir -p "$CSV_TEMP_DIR"
    
    # Tạo script Python để xử lý Excel
    cat > "$CSV_TEMP_DIR/excel_to_csv.py" << 'EOF'
#!/usr/bin/env python3
import pandas as pd
import sys
import os

def convert_excel_to_csv(excel_file, sheet_name=0, output_file=None):
    """Convert Excel file to CSV format"""
    try:
        # Đọc file Excel
        print(f"Đọc file Excel: {excel_file}")
        if sheet_name.isdigit():
            sheet_name = int(sheet_name)
        df = pd.read_excel(excel_file, sheet_name=sheet_name)
        
        # Nếu không chỉ định output file, tạo tên dựa trên file gốc
        if output_file is None:
            output_file = os.path.splitext(os.path.basename(excel_file))[0] + ".csv"
        
        # Ghi ra file CSV
        df.to_csv(output_file, index=False)
        print(f"Đã tạo file CSV: {output_file}")
        
        # In thông tin tổng quan về dữ liệu
        print(f"\nTóm tắt dữ liệu:")
        print(f"Số dòng: {len(df)}")
        print(f"Số cột: {len(df.columns)}")
        print("Tên các cột:")
        for col in df.columns:
            print(f"  - {col}")
            
        return output_file
    
    except Exception as e:
        print(f"Lỗi khi xử lý file Excel: {str(e)}")
        sys.exit(1)

def inspect_excel(excel_file):
    """Kiểm tra và hiển thị thông tin về file Excel"""
    try:
        # Đọc danh sách các sheet
        print(f"Đọc file Excel: {excel_file}")
        xls = pd.ExcelFile(excel_file)
        sheet_names = xls.sheet_names
        
        print(f"\nCác sheet trong file:")
        for i, sheet in enumerate(sheet_names):
            print(f"  {i}. {sheet}")
        
        # Chọn sheet để kiểm tra
        sheet_index = input("\nChọn sheet để kiểm tra (nhập số thứ tự): ")
        try:
            sheet_index = int(sheet_index)
            if sheet_index < 0 or sheet_index >= len(sheet_names):
                raise ValueError("Số thứ tự sheet không hợp lệ")
            selected_sheet = sheet_names[sheet_index]
        except ValueError:
            selected_sheet = sheet_index
            if selected_sheet not in sheet_names:
                print(f"Không tìm thấy sheet '{selected_sheet}', sử dụng sheet đầu tiên")
                selected_sheet = sheet_names[0]
        
        # Đọc dữ liệu từ sheet đã chọn
        df = pd.read_excel(excel_file, sheet_name=selected_sheet)
        
        # Hiển thị thông tin chung
        print(f"\nThông tin về sheet '{selected_sheet}':")
        print(f"Kích thước: {df.shape[0]} dòng x {df.shape[1]} cột")
        
        # Hiển thị tên cột
        print("\nDanh sách các cột:")
        for col in df.columns:
            print(f"  - {col}")
        
        # Hiển thị 5 dòng đầu tiên
        print("\n5 dòng đầu tiên:")
        print(df.head().to_string())
        
        # Hiển thị thông tin về kiểu dữ liệu
        print("\nKiểu dữ liệu của các cột:")
        print(df.dtypes)
        
        return selected_sheet
        
    except Exception as e:
        print(f"Lỗi khi kiểm tra file Excel: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Sử dụng: python excel_to_csv.py <excel_file> [sheet_name] [output_file]")
        sys.exit(1)
    
    excel_file = sys.argv[1]
    
    if len(sys.argv) == 2 or sys.argv[2] == 'inspect':
        inspect_excel(excel_file)
    else:
        sheet_name = sys.argv[2] if len(sys.argv) > 2 else 0
        output_file = sys.argv[3] if len(sys.argv) > 3 else None
        convert_excel_to_csv(excel_file, sheet_name, output_file)
EOF

    # Cài đặt pandas nếu cần
    python3 -c "import pandas" 2>/dev/null || {
        echo "Cài đặt pandas..."
        pip3 install pandas openpyxl
    }
    
    # Cho phép thực thi script Python
    chmod +x "$CSV_TEMP_DIR/excel_to_csv.py"
    
    success "Đã cài đặt đầy đủ công cụ cần thiết."
}

# Function để kiểm tra kết nối đến database
check_database_connection() {
    echo "Kiểm tra kết nối đến cơ sở dữ liệu..."
    if ! PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c '\l' &>/dev/null; then
        error "Không thể kết nối đến cơ sở dữ liệu PostgreSQL. Vui lòng kiểm tra lại thông tin kết nối."
    fi
    success "Kết nối thành công đến cơ sở dữ liệu PostgreSQL."
}

# Function để cấu hình kết nối database
configure_database() {
    echo -e "${YELLOW}Cấu hình kết nối đến cơ sở dữ liệu PostgreSQL${NC}"
    
    read -p "Host [$DB_HOST]: " input
    DB_HOST=${input:-$DB_HOST}
    
    read -p "Port [$DB_PORT]: " input
    DB_PORT=${input:-$DB_PORT}
    
    read -p "Database name [$DB_NAME]: " input
    DB_NAME=${input:-$DB_NAME}
    
    read -p "Username [$DB_USER]: " input
    DB_USER=${input:-$DB_USER}
    
    read -p "Password: " -s DB_PASSWORD
    echo ""
    
    # Kiểm tra kết nối
    check_database_connection
    
    # Lưu cấu hình để sử dụng lại sau này (tùy chọn)
    echo "Bạn có muốn lưu cấu hình này cho lần sau không? (y/n)"
    read -p "> " save_config
    
    if [ "$save_config" = "y" ] || [ "$save_config" = "Y" ]; then
        config_file="$HOME/.vsmi_import_config"
        echo "DB_HOST=$DB_HOST" > "$config_file"
        echo "DB_PORT=$DB_PORT" >> "$config_file"
        echo "DB_NAME=$DB_NAME" >> "$config_file"
        echo "DB_USER=$DB_USER" >> "$config_file"
        echo "DB_PASSWORD=$DB_PASSWORD" >> "$config_file"
        chmod 600 "$config_file"
        success "Đã lưu cấu hình vào $config_file"
    fi
}

# Function để kiểm tra xem file có tồn tại không
check_file() {
    if [ ! -f "$1" ]; then
        error "File không tồn tại: $1"
    fi
}

# Function chuyển đổi Excel sang CSV
convert_to_csv() {
    local excel_file=$1
    local sheet_name=${2:-0}
    local csv_file="$CSV_TEMP_DIR/$(basename "${excel_file%.*}").csv"
    
    echo "Chuyển đổi Excel sang CSV..."
    python3 "$CSV_TEMP_DIR/excel_to_csv.py" "$excel_file" "$sheet_name" "$csv_file"
    
    echo $csv_file
}

# Function import cổ phiếu
import_stocks() {
    local csv_file=$1
    echo "Importing stocks từ $csv_file..."
    
    # Tạo bảng tạm để import dữ liệu
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
-- Tạo bảng tạm
CREATE TEMP TABLE temp_stocks (
    symbol VARCHAR(10),
    name VARCHAR(255),
    exchange VARCHAR(100),
    industry VARCHAR(100),
    description TEXT
);

-- Import dữ liệu từ CSV
COPY temp_stocks FROM '$csv_file' WITH CSV HEADER;

-- Upsert dữ liệu
INSERT INTO "Stock" (id, symbol, name, exchange, industry, description, "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(), 
    UPPER(symbol), 
    name, 
    exchange, 
    industry, 
    description,
    NOW(),
    NOW()
FROM temp_stocks
ON CONFLICT (symbol) DO UPDATE SET
    name = EXCLUDED.name,
    exchange = EXCLUDED.exchange,
    industry = EXCLUDED.industry,
    description = EXCLUDED.description,
    "updatedAt" = NOW();

-- Hiển thị số lượng đã import
SELECT 'Đã import ' || COUNT(*) || ' cổ phiếu' FROM temp_stocks;
EOF
}

# Function import giá cổ phiếu
import_stock_prices() {
    local csv_file=$1
    echo "Importing stock prices từ $csv_file..."
    
    # Tạo bảng tạm để import dữ liệu
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
-- Tạo bảng tạm
CREATE TEMP TABLE temp_stock_prices (
    symbol VARCHAR(10),
    date DATE,
    open DECIMAL(10,4),
    high DECIMAL(10,4),
    low DECIMAL(10,4),
    close DECIMAL(10,4),
    volume BIGINT,
    "trendQ" DECIMAL(10,4),
    fq DECIMAL(10,4),
    "bandDown" DECIMAL(10,4),
    "bandUp" DECIMAL(10,4)
);

-- Import dữ liệu từ CSV
COPY temp_stock_prices FROM '$csv_file' WITH CSV HEADER;

-- Kiểm tra symbol tồn tại
DO \$\$
DECLARE
    missing_symbols TEXT;
BEGIN
    SELECT string_agg(DISTINCT t.symbol, ', ')
    INTO missing_symbols
    FROM temp_stock_prices t
    LEFT JOIN "Stock" s ON UPPER(t.symbol) = s.symbol
    WHERE s.symbol IS NULL;
    
    IF missing_symbols IS NOT NULL THEN
        RAISE EXCEPTION 'Các mã cổ phiếu sau không tồn tại trong hệ thống: %', missing_symbols;
    END IF;
END \$\$;

-- Upsert dữ liệu
INSERT INTO "StockPrice" (id, symbol, date, open, high, low, close, volume, "trendQ", fq, "bandDown", "bandUp", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(), 
    UPPER(symbol), 
    date, 
    open, 
    high, 
    low, 
    close, 
    volume, 
    "trendQ", 
    fq, 
    "bandDown", 
    "bandUp",
    NOW(),
    NOW()
FROM temp_stock_prices
ON CONFLICT (symbol, date) DO UPDATE SET
    open = EXCLUDED.open,
    high = EXCLUDED.high,
    low = EXCLUDED.low,
    close = EXCLUDED.close,
    volume = EXCLUDED.volume,
    "trendQ" = EXCLUDED."trendQ",
    fq = EXCLUDED.fq,
    "bandDown" = EXCLUDED."bandDown",
    "bandUp" = EXCLUDED."bandUp",
    "updatedAt" = NOW();

-- Hiển thị số lượng đã import
SELECT 'Đã import ' || COUNT(*) || ' bản ghi giá cổ phiếu' FROM temp_stock_prices;
EOF
}

# Function import chỉ số tài chính
import_financial_metrics() {
    local csv_file=$1
    echo "Importing financial metrics từ $csv_file..."
    
    # Tạo bảng tạm để import dữ liệu
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
-- Tạo bảng tạm
CREATE TEMP TABLE temp_financial_metrics (
    symbol VARCHAR(10),
    year INTEGER,
    quarter INTEGER,
    eps REAL,
    "epsIndustry" REAL,
    pe REAL,
    "peIndustry" REAL,
    roa REAL,
    roe REAL,
    "roaIndustry" REAL,
    "roeIndustry" REAL,
    revenue REAL,
    margin REAL,
    "totalDebtToEquity" REAL,
    "totalAssetsToEquity" REAL
);

-- Import dữ liệu từ CSV
COPY temp_financial_metrics FROM '$csv_file' WITH CSV HEADER;

-- Kiểm tra symbol tồn tại
DO \$\$
DECLARE
    missing_symbols TEXT;
BEGIN
    SELECT string_agg(DISTINCT t.symbol, ', ')
    INTO missing_symbols
    FROM temp_financial_metrics t
    LEFT JOIN "Stock" s ON UPPER(t.symbol) = s.symbol
    WHERE s.symbol IS NULL;
    
    IF missing_symbols IS NOT NULL THEN
        RAISE EXCEPTION 'Các mã cổ phiếu sau không tồn tại trong hệ thống: %', missing_symbols;
    END IF;
END \$\$;

-- Upsert dữ liệu
INSERT INTO "FinancialMetrics" (id, symbol, year, quarter, eps, "epsIndustry", pe, "peIndustry", roa, roe, "roaIndustry", "roeIndustry", revenue, margin, "totalDebtToEquity", "totalAssetsToEquity", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(), 
    UPPER(symbol), 
    year, 
    quarter, 
    eps, 
    "epsIndustry", 
    pe, 
    "peIndustry", 
    roa, 
    roe, 
    "roaIndustry", 
    "roeIndustry", 
    revenue, 
    margin, 
    "totalDebtToEquity", 
    "totalAssetsToEquity",
    NOW(),
    NOW()
FROM temp_financial_metrics
ON CONFLICT (symbol, year, quarter) DO UPDATE SET
    eps = EXCLUDED.eps,
    "epsIndustry" = EXCLUDED."epsIndustry",
    pe = EXCLUDED.pe,
    "peIndustry" = EXCLUDED."peIndustry",
    roa = EXCLUDED.roa,
    roe = EXCLUDED.roe,
    "roaIndustry" = EXCLUDED."roaIndustry",
    "roeIndustry" = EXCLUDED."roeIndustry",
    revenue = EXCLUDED.revenue,
    margin = EXCLUDED.margin,
    "totalDebtToEquity" = EXCLUDED."totalDebtToEquity",
    "totalAssetsToEquity" = EXCLUDED."totalAssetsToEquity",
    "updatedAt" = NOW();

-- Hiển thị số lượng đã import
SELECT 'Đã import ' || COUNT(*) || ' bản ghi chỉ số tài chính' FROM temp_financial_metrics;
EOF
}

# Function kiểm tra cấu trúc file Excel
inspect_excel() {
    local excel_file=$1
    echo "Kiểm tra cấu trúc file Excel: $excel_file..."
    python3 "$CSV_TEMP_DIR/excel_to_csv.py" "$excel_file" "inspect"
}

# Tải cấu hình nếu đã lưu
config_file="$HOME/.vsmi_import_config"
if [ -f "$config_file" ]; then
    echo "Đọc cấu hình từ $config_file..."
    source "$config_file"
fi

# Kiểm tra các công cụ cần thiết
check_dependencies

# Menu chính
while true; do
    echo ""
    echo -e "Các tính năng có sẵn:"
    echo -e "  ${BLUE}1.${NC} Cấu hình kết nối cơ sở dữ liệu"
    echo -e "  ${BLUE}2.${NC} Import cổ phiếu (Stocks)"
    echo -e "  ${BLUE}3.${NC} Import giá cổ phiếu (Stock Prices)"
    echo -e "  ${BLUE}4.${NC} Import chỉ số tài chính (Financial Metrics)"
    echo -e "  ${BLUE}5.${NC} Kiểm tra cấu trúc file Excel"
    echo -e "  ${BLUE}0.${NC} Thoát"
    
    echo -e "${YELLOW}Vui lòng chọn tính năng (0-5):${NC}"
    read -p "> " feature
    
    case $feature in
        0)
            echo "Cảm ơn bạn đã sử dụng công cụ Import dữ liệu VSMI!"
            exit 0
            ;;
        1)
            configure_database
            ;;
        2|3|4|5)
            # Yêu cầu người dùng nhập đường dẫn đến file
            echo -e "${YELLOW}Nhập đường dẫn đến file Excel:${NC}"
            read -p "> " file_path
            
            # Kiểm tra file tồn tại
            check_file "$file_path"
            
            if [ "$feature" = "5" ]; then
                inspect_excel "$file_path"
            else
                # Kiểm tra kết nối database
                check_database_connection
                
                # Chọn sheet nếu cần
                echo -e "${YELLOW}Chọn sheet (nhập số thứ tự hoặc tên sheet, để trống cho sheet đầu tiên):${NC}"
                read -p "> " sheet_name
                sheet_name=${sheet_name:-0}
                
                # Chuyển đổi Excel sang CSV
                csv_file=$(convert_to_csv "$file_path" "$sheet_name")
                
                # Import dữ liệu dựa vào loại đã chọn
                case $feature in
                    2)
                        import_stocks "$csv_file"
                        ;;
                    3)
                        import_stock_prices "$csv_file"
                        ;;
                    4)
                        import_financial_metrics "$csv_file"
                        ;;
                esac
                
                success "Import hoàn tất!"
            fi
            ;;
        *)
            error "Lựa chọn không hợp lệ."
            ;;
    esac
done 