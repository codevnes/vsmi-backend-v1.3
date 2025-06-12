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

# Function để tải file từ URL
download_file() {
    local url="$1"
    local output_file="$2"
    
    echo -e "Đang tải file từ URL: ${BLUE}$url${NC}"
    
    # Kiểm tra xem curl có tồn tại không
    if command -v curl &> /dev/null; then
        curl -L -o "$output_file" "$url" || error "Không thể tải file từ URL"
    elif command -v wget &> /dev/null; then
        wget -O "$output_file" "$url" || error "Không thể tải file từ URL"
    else
        error "Không tìm thấy curl hoặc wget. Vui lòng cài đặt một trong hai công cụ để tải file."
    fi
    
    success "Đã tải file thành công: $output_file"
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

# Yêu cầu người dùng chọn nguồn dữ liệu
echo -e "${YELLOW}Chọn nguồn dữ liệu:${NC}"
echo -e "  ${BLUE}1.${NC} File từ máy tính"
echo -e "  ${BLUE}2.${NC} Tải từ URL"
read -p "> " source_type

is_url=false
downloaded_file=""

# Xử lý nguồn dữ liệu
if [ "$source_type" == "2" ]; then
    echo -e "${YELLOW}Nhập URL của file Excel:${NC}"
    read -p "> " file_url
    
    if [ -z "$file_url" ]; then
        error "URL không được để trống."
    fi
    
    # Tạo tên file tạm thời dựa trên timestamp
    timestamp=$(date +%s)
    downloaded_file="import/temp_${timestamp}.xlsx"
    
    # Đảm bảo thư mục import tồn tại
    mkdir -p import
    
    # Tải file từ URL
    download_file "$file_url" "$downloaded_file"
    
    file_path=$downloaded_file
    is_url=true
else
    # Yêu cầu người dùng nhập đường dẫn đến file
    echo -e "${YELLOW}Nhập đường dẫn đến file Excel (để trống để sử dụng file mặc định):${NC}"
    read -p "> " file_path
fi

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

# Nếu người dùng không nhập đường dẫn và không phải import từ URL, sử dụng file mặc định
if [ -z "$file_path" ] && [ "$is_url" == "false" ]; then
    if [ $data_type -eq 9 ]; then
        echo -e "${YELLOW}Vui lòng nhập đường dẫn đến file Excel cần kiểm tra:${NC}"
        read -p "> " file_path
        if [ -z "$file_path" ]; then
            error "Bạn phải nhập đường dẫn đến file cho tính năng kiểm tra cấu trúc."
        fi
    else
        file_path=$default_file
        echo -e "Sử dụng file mặc định: ${BLUE}$file_path${NC}"
    fi
fi

# Kiểm tra xem file có tồn tại không
check_file "$file_path"

# Hiển thị thông tin import
echo -e "${YELLOW}Bắt đầu import dữ liệu ${BLUE}$data_name${YELLOW} từ file ${BLUE}$file_path${NC}"

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

# Nếu file đã được tải từ URL, hỏi người dùng có muốn giữ lại file hay không
if [ "$is_url" == "true" ] && [ -f "$downloaded_file" ]; then
    echo -e "${YELLOW}Bạn có muốn giữ lại file đã tải không? (y/n)${NC}"
    read -p "> " keep_file
    
    if [ "$keep_file" != "y" ] && [ "$keep_file" != "Y" ]; then
        rm -f "$downloaded_file"
        success "Đã xóa file tạm: $downloaded_file"
    else
        success "Đã giữ lại file tại: $downloaded_file"
    fi
fi

echo -e "${BLUE}=================================${NC}"
echo -e "${GREEN}  Import hoàn tất  ${NC}"
echo -e "${BLUE}=================================${NC}" 