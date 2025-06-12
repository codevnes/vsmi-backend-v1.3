#!/bin/bash

# VSMI Data Import Tool
# Script để import dữ liệu từ file Excel vào cơ sở dữ liệu VSMI

# Màu sắc để hiển thị thông báo
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Hiển thị banner
echo -e "${BLUE}=================================${NC}"
echo -e "${GREEN}  VSMI Data Import Tool  ${NC}"
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

# Function để kiểm tra xem file có tồn tại không
check_file() {
    if [ ! -f "$1" ]; then
        error "File không tồn tại: $1"
    fi
}

# Function để kiểm tra xem input có phải là URL không
is_url() {
    if [[ $1 =~ ^https?:// ]]; then
        return 0 # true
    else
        return 1 # false
    fi
}

# Function để tải file từ URL
download_file() {
    local url=$1
    local temp_file=$(mktemp)
    
    echo -e "Đang tải file từ URL: ${BLUE}$url${NC}" >&2
    
    # Thử tải bằng curl nếu có
    if command -v curl &> /dev/null; then
        if curl -L --fail "$url" -o "$temp_file" 2>/dev/null; then
            echo -e "Đã tải file ${GREEN}thành công${NC}" >&2
            echo "$temp_file"
            return 0
        fi
    # Hoặc thử tải bằng wget
    elif command -v wget &> /dev/null; then
        if wget -q "$url" -O "$temp_file" 2>/dev/null; then
            echo -e "Đã tải file ${GREEN}thành công${NC}" >&2
            echo "$temp_file"
            return 0
        fi
    fi
    
    # Nếu cả hai đều thất bại hoặc không có
    rm -f "$temp_file"
    error "Không thể tải file từ URL: $url"
    return 1
}

# Function để khắc phục lỗi "Too many database connections"
fix_db_connections() {
    # Kiểm tra quyền sudo
    if [ "$EUID" -ne 0 ]; then
        warning "Cần quyền sudo để khởi động lại dịch vụ PostgreSQL."
        echo -e "Vui lòng nhập mật khẩu sudo nếu được yêu cầu."
    fi
    
    echo -e "Đang khởi động lại dịch vụ PostgreSQL để giải phóng kết nối..."
    
    # Thử các dịch vụ PostgreSQL phổ biến
    if sudo systemctl restart postgresql 2>/dev/null; then
        success "Đã khởi động lại dịch vụ PostgreSQL thành công."
    elif sudo service postgresql restart 2>/dev/null; then
        success "Đã khởi động lại dịch vụ PostgreSQL thành công."
    elif sudo /etc/init.d/postgresql restart 2>/dev/null; then
        success "Đã khởi động lại dịch vụ PostgreSQL thành công."
    else
        warning "Không thể khởi động lại dịch vụ PostgreSQL tự động. Vui lòng khởi động lại thủ công nếu gặp lỗi kết nối."
    fi
    
    # Chờ một chút để dịch vụ khởi động hoàn tất
    echo -e "Đợi dịch vụ PostgreSQL khởi động..."
    sleep 3
}

# Kiểm tra xem package.json có tồn tại không để đảm bảo chúng ta đang ở thư mục dự án
if [ ! -f "package.json" ]; then
    error "Không tìm thấy file package.json. Vui lòng chạy script này từ thư mục gốc của dự án."
fi

# Liệt kê các loại dữ liệu có thể import
echo -e "Các loại dữ liệu có thể import:"
echo -e "  ${BLUE}1.${NC} Cổ phiếu (Stocks)"
echo -e "  ${BLUE}2.${NC} Giá cổ phiếu (Stock Prices)"
echo -e "  ${BLUE}3.${NC} Chỉ số tài chính (Financial Metrics)"
echo -e "  ${BLUE}4.${NC} Phân tích kỹ thuật (Technical Analyses)"
echo -e "  ${BLUE}5.${NC} Khuyến nghị kỹ thuật (Technical Recommendations)"
echo -e "  ${BLUE}6.${NC} F-Score"
echo -e "  ${BLUE}7.${NC} Hồ sơ cổ phiếu (Stock Profiles)"
echo -e "  ${BLUE}8.${NC} Danh sách cổ phiếu chọn lọc (Selected Stocks)"
echo -e "  ${BLUE}9.${NC} Kiểm tra cấu trúc file Excel"

# Yêu cầu người dùng chọn loại dữ liệu
echo -e "${YELLOW}Vui lòng chọn loại dữ liệu để import (1-9):${NC}"
read -p "> " data_type

# Yêu cầu người dùng nhập đường dẫn đến file hoặc URL
echo -e "${YELLOW}Nhập đường dẫn đến file Excel hoặc URL (để trống để sử dụng file mặc định):${NC}"
read -p "> " file_input

# Xử lý loại dữ liệu và đường dẫn file
case $data_type in
    1)
        script="scripts/import-stocks.js"
        default_file="import/stock.xlsx"
        data_name="Stocks"
        ;;
    2)
        script="scripts/import-stock-prices.js"
        default_file="import/stock-price.xlsx"
        data_name="Stock Prices"
        ;;
    3)
        script="scripts/import-financial-metrics.js"
        default_file="import/financial-metrics.xlsx"
        data_name="Financial Metrics"
        ;;
    4)
        script="scripts/import-technical-analyses.js"
        default_file="import/technical-analyses.xlsx"
        data_name="Technical Analyses"
        ;;
    5)
        script="scripts/import-technical-recommendations.js"
        default_file="import/technical-recommendations.xlsx"
        data_name="Technical Recommendations"
        ;;
    6)
        script="scripts/import-fscores.js"
        default_file="import/fscore.xlsx"
        data_name="F-Scores"
        ;;
    7)
        script="scripts/import-stock-profiles.js"
        default_file="import/stock-profiles.xlsx"
        data_name="Stock Profiles"
        ;;
    8)
        script="scripts/import-selected-stocks.js"
        default_file="import/selected-stocks.xlsx"
        data_name="Selected Stocks"
        ;;
    9)
        script="scripts/inspect-excel.js"
        default_file=""
        data_name="Excel Inspection"
        ;;
    *)
        error "Lựa chọn không hợp lệ."
        ;;
esac

# Biến để theo dõi nếu chúng ta sử dụng file tạm
temp_file=""

# Nếu người dùng không nhập đường dẫn, sử dụng file mặc định
if [ -z "$file_input" ]; then
    if [ $data_type -eq 9 ]; then
        echo -e "${YELLOW}Vui lòng nhập đường dẫn đến file Excel hoặc URL cần kiểm tra:${NC}"
        read -p "> " file_input
        if [ -z "$file_input" ]; then
            error "Bạn phải nhập đường dẫn đến file hoặc URL cho tính năng kiểm tra cấu trúc."
        fi
    else
        file_input=$default_file
        echo -e "Sử dụng file mặc định: ${BLUE}$file_input${NC}"
    fi
fi

# Xử lý file input, kiểm tra xem đó là URL hay đường dẫn local
if is_url "$file_input"; then
    # Nếu là URL, tải về file tạm
    temp_file=$(download_file "$file_input")
    file_path=$temp_file
else
    # Nếu là đường dẫn local, kiểm tra xem file có tồn tại không
    file_path=$file_input
    check_file "$file_path"
fi

# Hiển thị thông tin import
echo -e "${YELLOW}Bắt đầu import dữ liệu ${BLUE}$data_name${YELLOW} từ file ${BLUE}$file_input${NC}"

# Hỏi người dùng có muốn khắc phục lỗi kết nối cơ sở dữ liệu không
echo -e "${YELLOW}Bạn có muốn khởi động lại dịch vụ PostgreSQL trước khi import để tránh lỗi 'Too many connections'? (y/n)${NC}"
read -p "> " fix_connections_choice

if [ "$fix_connections_choice" = "y" ] || [ "$fix_connections_choice" = "Y" ]; then
    fix_db_connections
fi

# Thực hiện import
if [ $data_type -eq 9 ]; then
    node $script "$file_path"
    success "Đã kiểm tra cấu trúc file Excel thành công."
else
    # Kiểm tra xem đã build project chưa
    if [ ! -d "dist" ] || [ ! -f "dist/index.js" ]; then
        warning "Thư mục dist không tồn tại hoặc không đầy đủ. Cần build project trước khi import dữ liệu."
        echo -e "Bạn có muốn build project ngay bây giờ không? (y/n)"
        read -p "> " build_choice
        
        if [ "$build_choice" = "y" ] || [ "$build_choice" = "Y" ]; then
            echo "Đang build project..."
            npm run build || error "Không thể build project."
        else
            error "Vui lòng build project trước khi import dữ liệu bằng lệnh 'npm run build'."
        fi
    fi
    
    # Thực hiện import
    node $script "$file_path"
    
    if [ $? -eq 0 ]; then
        success "Đã import dữ liệu $data_name thành công."
    else
        error "Có lỗi xảy ra trong quá trình import dữ liệu."
    fi
fi

# Dọn dẹp file tạm nếu có
if [ -n "$temp_file" ] && [ -f "$temp_file" ]; then
    rm -f "$temp_file"
    echo -e "Đã xóa file tạm thời."
fi

echo -e "${BLUE}=================================${NC}"
echo -e "${GREEN}  Import hoàn tất  ${NC}"
echo -e "${BLUE}=================================${NC}" 