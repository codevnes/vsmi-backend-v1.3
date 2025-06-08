#!/bin/bash

# Author: Trần Danh Trọng
# Description: Phần mềm Quản Lý DB cho VSMI

# Màu sắc để hiển thị
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# --- CẤU HÌNH ---
# Cấu hình log
LOG_FILE="db_manager.log"
# Số ngày lưu trữ backup (các backup cũ hơn sẽ bị xóa)
BACKUP_RETENTION_DAYS=7
# Ngưỡng cảnh báo dung lượng database (bytes). Ví dụ: 2GB = 2 * 1024 * 1024 * 1024 = 2147483648
DB_SIZE_WARNING_THRESHOLD=2147483648

# Cấu hình thông báo qua email (yêu cầu cài đặt mailutils)
ENABLE_EMAIL_NOTIFICATION="false" # Đặt là "true" để bật
EMAIL_RECIPIENT="your_email@example.com"
EMAIL_SUBJECT_PREFIX="[DB Manager]"

# Cấu hình thông báo qua Telegram
ENABLE_TELEGRAM_NOTIFICATION="false" # Đặt là "true" để bật
# Lấy từ @BotFather
TELEGRAM_BOT_TOKEN=""
# Lấy từ @userinfobot
TELEGRAM_CHAT_ID=""
# --- KẾT THÚC CẤU HÌNH ---

# Logo
display_logo() {
  echo -e "${BLUE}"
  echo "██╗   ██╗███████╗███╗   ███╗██╗    ██████╗ ██████╗     ████████╗ ██████╗  ██████╗ ██╗     "
  echo "██║   ██║██╔════╝████╗ ████║██║    ██╔══██╗██╔══██╗    ╚══██╔══╝██╔═══██╗██╔═══██╗██║     "
  echo "██║   ██║███████╗██╔████╔██║██║    ██║  ██║██████╔╝       ██║   ██║   ██║██║   ██║██║     "
  echo "╚██╗ ██╔╝╚════██║██║╚██╔╝██║██║    ██║  ██║██╔══██╗       ██║   ██║   ██║██║   ██║██║     "
  echo " ╚████╔╝ ███████║██║ ╚═╝ ██║██║    ██████╔╝██████╔╝       ██║   ╚██████╔╝╚██████╔╝███████╗"
  echo "  ╚═══╝  ╚══════╝╚═╝     ╚═╝╚═╝    ╚═════╝ ╚═════╝        ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝"
  echo -e "${NC}"
  echo -e "${GREEN}Vietnam Stock Market Institute${NC}"
  echo -e "${YELLOW}Phần mềm Quản Lý Database v2.0 - by Trần Danh Trọng${NC}"
  echo ""
}

# --- CÁC HÀM TIỆN ÍCH ---

# Ghi log các hành động
log_action() {
  local action="$1"
  echo "$(date '+%Y-%m-%d %H:%M:%S') - USER: $USER - ACTION: $action" >> "$LOG_FILE"
}

# URL-encode một chuỗi để sử dụng với Telegram API
rawurlencode() {
  local string="${1}"
  local strlen=${#string}
  local encoded=""
  local pos c o

  for (( pos=0 ; pos<strlen ; pos++ )); do
     c=${string:$pos:1}
     case "$c" in
        [-_.~a-zA-Z0-9] ) o="${c}" ;;
        * )               printf -v o '%%%02x' "'$c"
     esac
     encoded+="${o}"
  done
  echo "${encoded}"
}

# Gửi thông báo qua Telegram
send_telegram_notification() {
  if [ "$ENABLE_TELEGRAM_NOTIFICATION" = "true" ]; then
    if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ -z "$TELEGRAM_CHAT_ID" ]; then
      echo -e "${YELLOW}Cảnh báo: Token hoặc Chat ID của Telegram chưa được cấu hình. Bỏ qua gửi thông báo.${NC}"
      return
    fi
    
    local message="$1"
    local encoded_message=$(rawurlencode "$message")
    local url="https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage"
    
    curl -s -o /dev/null -X POST "$url" -d "chat_id=${TELEGRAM_CHAT_ID}" -d "text=${encoded_message}" &> /dev/null
    
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}Đã gửi thông báo qua Telegram.${NC}"
    else
      echo -e "${RED}Gửi thông báo qua Telegram thất bại.${NC}"
    fi
  fi
}

# Gửi thông báo qua email
send_email_notification() {
  if [ "$ENABLE_EMAIL_NOTIFICATION" = "true" ]; then
    if ! command -v mail &> /dev/null; then
      echo -e "${YELLOW}Lệnh 'mail' (mailutils) không tồn tại. Bỏ qua gửi email.${NC}"
      return
    fi
    if [ -z "$EMAIL_RECIPIENT" ]; then
        echo -e "${YELLOW}EMAIL_RECIPIENT chưa được cấu hình. Bỏ qua gửi email.${NC}"
        return
    fi
    
    local subject="$1"
    local body="$2"
    
    echo -e "$body" | mail -s "${EMAIL_SUBJECT_PREFIX} ${subject}" "$EMAIL_RECIPIENT"
    
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}Đã gửi thông báo qua email đến ${EMAIL_RECIPIENT}.${NC}"
    else
      echo -e "${RED}Gửi thông báo email thất bại.${NC}"
    fi
  fi
}


# --- CÁC HÀM CỐT LÕI ---

# Kiểm tra cài đặt các công cụ cần thiết
check_requirements() {
  local missing_tools=0
  
  echo -e "${BLUE}Đang kiểm tra các công cụ cần thiết...${NC}"
  
  if ! command -v psql &> /dev/null; then
    echo -e "${RED}Không tìm thấy PostgreSQL CLI (psql). Vui lòng cài đặt PostgreSQL.${NC}"
    missing_tools=1
  fi

  if ! command -v pg_dump &> /dev/null; then
    echo -e "${RED}Không tìm thấy pg_dump. Vui lòng cài đặt PostgreSQL client tools.${NC}"
    missing_tools=1
  fi

  if ! command -v pg_restore &> /dev/null; then
    echo -e "${RED}Không tìm thấy pg_restore. Vui lòng cài đặt PostgreSQL client tools.${NC}"
    missing_tools=1
  fi
  
  if [ $missing_tools -eq 1 ]; then
    echo -e "${RED}Một số công cụ cần thiết chưa được cài đặt.${NC}"
    exit 1
  fi

  echo -e "${GREEN}Tất cả các công cụ cần thiết đã được cài đặt.${NC}"
}

# Đọc thông tin kết nối DB từ .env
load_env() {
  if [ -f .env ]; then
    echo -e "${BLUE}Đang đọc thông tin kết nối từ file .env...${NC}"
    source .env
  else
    echo -e "${YELLOW}Không tìm thấy file .env. Bạn sẽ cần nhập thông tin kết nối thủ công.${NC}"
  fi

  # Kiểm tra biến môi trường DATABASE_URL
  if [ -z "$DATABASE_URL" ]; then
    # Yêu cầu người dùng nhập thủ công
    echo -e "${YELLOW}Vui lòng nhập thông tin kết nối database:${NC}"
    read -p "DB Host (default: localhost): " DB_HOST
    DB_HOST=${DB_HOST:-localhost}
    
    read -p "DB Port (default: 5432): " DB_PORT
    DB_PORT=${DB_PORT:-5432}
    
    read -p "DB Name: " DB_NAME
    while [ -z "$DB_NAME" ]; do
      echo -e "${RED}Tên database không được để trống${NC}"
      read -p "DB Name: " DB_NAME
    done
    
    read -p "DB User: " DB_USER
    while [ -z "$DB_USER" ]; do
      echo -e "${RED}Tên người dùng không được để trống${NC}"
      read -p "DB User: " DB_USER
    done
    
    read -sp "DB Password: " DB_PASS
    echo ""
  else
    # Parse DATABASE_URL
    if [[ $DATABASE_URL =~ postgresql://([^:]+):([^@]+)@([^:]+):([0-9]+)/(.+) ]]; then
      DB_USER="${BASH_REMATCH[1]}"
      DB_PASS="${BASH_REMATCH[2]}"
      DB_HOST="${BASH_REMATCH[3]}"
      DB_PORT="${BASH_REMATCH[4]}"
      DB_NAME="${BASH_REMATCH[5]}"
      
      echo -e "${GREEN}Thông tin kết nối đã được tải từ DATABASE_URL.${NC}"
    else
      echo -e "${RED}Không thể phân tích DATABASE_URL. Định dạng không hợp lệ.${NC}"
      echo -e "${YELLOW}Vui lòng nhập thông tin kết nối database:${NC}"
      read -p "DB Host (default: localhost): " DB_HOST
      DB_HOST=${DB_HOST:-localhost}
      
      read -p "DB Port (default: 5432): " DB_PORT
      DB_PORT=${DB_PORT:-5432}
      
      read -p "DB Name: " DB_NAME
      while [ -z "$DB_NAME" ]; do
        echo -e "${RED}Tên database không được để trống${NC}"
        read -p "DB Name: " DB_NAME
      done
      
      read -p "DB User: " DB_USER
      while [ -z "$DB_USER" ]; do
        echo -e "${RED}Tên người dùng không được để trống${NC}"
        read -p "DB User: " DB_USER
      done
      
      read -sp "DB Password: " DB_PASS
      echo ""
    fi
  fi
}

# Kiểm tra kết nối database
test_connection() {
  echo -e "${BLUE}Đang kiểm tra kết nối đến database...${NC}"
  
  PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1" > /dev/null 2>&1
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Không thể kết nối đến database. Vui lòng kiểm tra thông tin kết nối.${NC}"
    return 1
  else
    echo -e "${GREEN}Kết nối đến database thành công.${NC}"
    return 0
  fi
}

# Backup database với tính năng nén, kiểm tra và xóa file cũ
backup_database() {
  local timestamp=$(date +"%Y%m%d_%H%M%S")
  local backup_dir="./backups"
  local backup_file="${backup_dir}/${DB_NAME}_${timestamp}.dump.gz"
  
  # Tạo thư mục backup nếu chưa tồn tại
  mkdir -p "$backup_dir"
  
  echo -e "${BLUE}Đang tạo backup database ${DB_NAME}...${NC}"
  echo -e "File backup sẽ được lưu tại: ${backup_file}"
  
  # Sử dụng pg_dump với định dạng custom (-Fc) và nén bằng gzip
  # PIPESTATUS[0] sẽ lấy mã lỗi của lệnh pg_dump trước khi pipe qua gzip
  PGPASSWORD=$DB_PASS pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -Fc -b -v -d "$DB_NAME" | gzip > "$backup_file"
  local dump_status=${PIPESTATUS[0]}
  
  # Kiểm tra tính toàn vẹn của backup: mã lỗi và file không rỗng
  if [ $dump_status -eq 0 ] && [ -s "$backup_file" ]; then
    echo -e "${GREEN}Backup thành công.${NC}"
    local success_msg="✅ Backup database '${DB_NAME}' thành công. File: $(basename "$backup_file")"
    log_action "Backup database '${DB_NAME}' to file '${backup_file}'"
    send_telegram_notification "$success_msg"
    send_email_notification "Backup '${DB_NAME}' thành công" "$success_msg"

    # Xóa các file backup cũ hơn số ngày đã định
    echo -e "${BLUE}Đang xóa các backup cũ hơn ${BACKUP_RETENTION_DAYS} ngày...${NC}"
    find "$backup_dir" -type f -name "*.dump.gz" -mtime +$((BACKUP_RETENTION_DAYS - 1)) -print -delete
    echo -e "${GREEN}Đã xóa các backup cũ.${NC}"
  else
    echo -e "${RED}Backup thất bại. Mã lỗi: ${dump_status}${NC}"
    rm -f "$backup_file" # Xóa file rỗng nếu có lỗi
    local fail_msg="❌ Backup database '${DB_NAME}' thất bại."
    log_action "Backup database '${DB_NAME}' FAILED."
    send_telegram_notification "$fail_msg"
    send_email_notification "Backup '${DB_NAME}' THẤT BẠI" "$fail_msg"
  fi
}

# Restore toàn bộ database từ file backup
restore_database() {
  local backup_dir="./backups"
  
  # Kiểm tra thư mục backup có file .dump.gz không
  if [ ! -d "$backup_dir" ] || [ -z "$(ls -A $backup_dir/*.dump.gz 2>/dev/null)" ]; then
    echo -e "${RED}Không có file backup nào (.dump.gz) được tìm thấy.${NC}"
    return
  fi
  
  # Liệt kê các file backup
  echo -e "${BLUE}Các file backup có sẵn:${NC}"
  local i=1
  local backup_files=()
  
  for file in $backup_dir/*.dump.gz; do
    if [ -f "$file" ]; then
      echo -e "${i}) $(basename "$file")"
      backup_files+=("$file")
      i=$((i+1))
    fi
  done
  
  # Chọn file backup
  read -p "Chọn file backup để restore (1-$((i-1))): " choice
  
  if ! [[ "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 1 ] || [ "$choice" -gt $((i-1)) ]; then
    echo -e "${RED}Lựa chọn không hợp lệ${NC}"
    return
  fi
  
  local selected_file="${backup_files[$((choice-1))]}"
  
  echo -e "${YELLOW}CẢNH BÁO: Thao tác này sẽ xóa database hiện tại và restore từ file backup.${NC}"
  read -p "Bạn có chắc chắn muốn tiếp tục? (y/n): " confirm
  
  if [[ "$confirm" =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Đang restore database từ file ${selected_file}...${NC}"
    
    # Drop và tạo lại database
    PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS \"$DB_NAME\";"
    PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE \"$DB_NAME\";"
    
    # Restore từ file backup đã nén sử dụng pg_restore
    gunzip < "$selected_file" | PGPASSWORD=$DB_PASS pg_restore -h $DB_HOST -p $DB_PORT -U $DB_USER -d "$DB_NAME" -v
    
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}Restore thành công.${NC}"
      local success_msg="✅ Restore database '${DB_NAME}' thành công từ file $(basename "$selected_file")"
      log_action "Restored database '${DB_NAME}' from file '${selected_file}'"
      send_telegram_notification "$success_msg"
    else
      echo -e "${RED}Restore thất bại.${NC}"
      local fail_msg="❌ Restore database '${DB_NAME}' thất bại từ file $(basename "$selected_file")"
      log_action "Restore database '${DB_NAME}' from file '${selected_file}' FAILED."
      send_telegram_notification "$fail_msg"
    fi
  else
    echo -e "${YELLOW}Hủy thao tác restore.${NC}"
  fi
}

# Xóa toàn bộ database
drop_database() {
  echo -e "${RED}CẢNH BÁO: Thao tác này sẽ xóa hoàn toàn database ${DB_NAME} và tất cả dữ liệu của nó.${NC}"
  read -p "Nhập tên database (${DB_NAME}) để xác nhận xóa: " confirm_name
  
  if [ "$confirm_name" != "$DB_NAME" ]; then
    echo -e "${YELLOW}Tên database không khớp. Hủy thao tác.${NC}"
    return
  fi
  
  read -p "Bạn có muốn tạo backup trước khi xóa? (y/n): " backup_confirm
  
  if [[ "$backup_confirm" =~ ^[Yy]$ ]]; then
    backup_database
  fi
  
  echo -e "${BLUE}Đang xóa database ${DB_NAME}...${NC}"
  
  PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS \"$DB_NAME\";"
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Đã xóa database ${DB_NAME} thành công.${NC}"
    local msg="💀 Database '${DB_NAME}' đã bị xóa bởi user '$USER'."
    log_action "Dropped database '${DB_NAME}'"
    send_telegram_notification "$msg"
    
    read -p "Bạn có muốn tạo lại database trống? (y/n): " recreate_confirm
    
    if [[ "$recreate_confirm" =~ ^[Yy]$ ]]; then
      PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE \"$DB_NAME\";"
      
      if [ $? -eq 0 ]; then
        echo -e "${GREEN}Đã tạo lại database ${DB_NAME} thành công.${NC}"
        log_action "Re-created empty database '${DB_NAME}'"
      else
        echo -e "${RED}Không thể tạo lại database.${NC}"
        log_action "Failed to re-create database '${DB_NAME}'"
      fi
    fi
  else
    echo -e "${RED}Không thể xóa database.${NC}"
    log_action "Failed to drop database '${DB_NAME}'"
  fi
}

# Lấy danh sách bảng
get_tables() {
  PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d "$DB_NAME" -t -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name;" | sed 's/^ *//;s/ *$//' | grep -v '^$'
}

# Xóa dữ liệu của bảng được chọn
truncate_tables() {
  # Thay thế mapfile bằng cách đọc vào mảng tương thích với nhiều shell
  local tables=()
  while read -r table; do
    if [ -n "$table" ]; then
      tables+=("$table")
    fi
  done < <(get_tables)
  
  if [ ${#tables[@]} -eq 0 ]; then
    echo -e "${RED}Không tìm thấy bảng nào trong database.${NC}"
    return
  fi
  
  echo -e "${BLUE}Các bảng trong database:${NC}"
  # Sửa lỗi STT hiển thị, lặp qua mảng và in STT
  for i in "${!tables[@]}"; do
    echo -e "$((i+1))) ${tables[i]}"
  done
  echo -e "0) Tất cả các bảng"
  
  read -p "Chọn bảng để xóa dữ liệu (0-${#tables[@]}): " choice
  
  if ! [[ "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 0 ] || [ "$choice" -gt ${#tables[@]} ]; then
    echo -e "${RED}Lựa chọn không hợp lệ${NC}"
    return
  fi
  
  if [ "$choice" -eq 0 ]; then
    echo -e "${RED}CẢNH BÁO: Thao tác này sẽ xóa dữ liệu của TẤT CẢ các bảng.${NC}"
    read -p "Bạn có chắc chắn muốn tiếp tục? (y/n): " confirm
    
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
      for table in "${tables[@]}"; do
        echo -e "${BLUE}Đang xóa dữ liệu của bảng ${table}...${NC}"
        PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d "$DB_NAME" -c "TRUNCATE TABLE \"$table\" RESTART IDENTITY CASCADE;"
      done
      echo -e "${GREEN}Đã xóa dữ liệu của tất cả các bảng.${NC}"
      log_action "Truncated all tables in database '${DB_NAME}'"
    else
      echo -e "${YELLOW}Hủy thao tác xóa dữ liệu.${NC}"
    fi
  else
    local selected_table="${tables[$((choice-1))]}"
    echo -e "${RED}CẢNH BÁO: Thao tác này sẽ xóa tất cả dữ liệu của bảng ${selected_table}.${NC}"
    read -p "Bạn có chắc chắn muốn tiếp tục? (y/n): " confirm
    
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
      echo -e "${BLUE}Đang xóa dữ liệu của bảng ${selected_table}...${NC}"
      PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d "$DB_NAME" -c "TRUNCATE TABLE \"$selected_table\" RESTART IDENTITY CASCADE;"
      
      if [ $? -eq 0 ]; then
        echo -e "${GREEN}Đã xóa dữ liệu của bảng ${selected_table} thành công.${NC}"
        log_action "Truncated table '${selected_table}' in database '${DB_NAME}'"
      else
        echo -e "${RED}Không thể xóa dữ liệu của bảng ${selected_table}.${NC}"
        log_action "Failed to truncate table '${selected_table}' in '${DB_NAME}'"
      fi
    else
      echo -e "${YELLOW}Hủy thao tác xóa dữ liệu.${NC}"
    fi
  fi
}

# Hiển thị thông tin database
show_database_info() {
  echo -e "${BLUE}Thông tin database:${NC}"
  echo -e "Host: ${DB_HOST}"
  echo -e "Port: ${DB_PORT}"
  echo -e "Database: ${DB_NAME}"
  echo -e "User: ${DB_USER}"
  
  echo -e "\n${BLUE}Kích thước database:${NC}"
  # Lấy kích thước database bằng bytes để so sánh
  local db_size_bytes=$(PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d "$DB_NAME" -t -c "SELECT pg_database_size('$DB_NAME');" | tr -d '[:space:]')
  local db_size_pretty=$(PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d "$DB_NAME" -t -c "SELECT pg_size_pretty('$db_size_bytes');" | tr -d '[:space:]')
  echo -e "Tổng dung lượng: ${db_size_pretty}"

  # Cảnh báo nếu dung lượng vượt ngưỡng
  if [ -n "$db_size_bytes" ] && [ "$db_size_bytes" -gt "$DB_SIZE_WARNING_THRESHOLD" ]; then
    local threshold_pretty=$(PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -t -c "SELECT pg_size_pretty($DB_SIZE_WARNING_THRESHOLD::bigint);" | tr -d '[:space:]')
    echo -e "${YELLOW}CẢNH BÁO: Dung lượng database (${db_size_pretty}) đã vượt quá ngưỡng thiết lập (${threshold_pretty}).${NC}"
  fi

  echo -e "\n${BLUE}Danh sách bảng và kích thước:${NC}"
  PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d "$DB_NAME" -c "SELECT table_name, pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as size FROM information_schema.tables WHERE table_schema='public' ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC;"
  
  echo -e "\n${BLUE}Tổng số bản ghi theo bảng:${NC}"
  
  local tables=()
  while read -r table; do
    if [ -n "$table" ]; then
      tables+=("$table")
    fi
  done < <(get_tables)
  for table in "${tables[@]}"; do
    local count=$(PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM \"$table\";" | tr -d '[:space:]')
    echo -e "$table: $count bản ghi"
  done
}

# --- CÁC TÍNH NĂNG NÂNG CAO ---

# Restore một bảng cụ thể từ file backup
restore_single_table() {
  local backup_dir="./backups"
  
  if [ ! -d "$backup_dir" ] || [ -z "$(ls -A $backup_dir/*.dump.gz 2>/dev/null)" ]; then
    echo -e "${RED}Không có file backup nào (.dump.gz) được tìm thấy.${NC}"
    return
  fi
  
  echo -e "${BLUE}Chọn file backup chứa bảng bạn muốn restore:${NC}"
  local i=1
  local backup_files=()
  for file in $backup_dir/*.dump.gz; do
    if [ -f "$file" ]; then
      echo -e "${i}) $(basename "$file")"
      backup_files+=("$file")
      i=$((i+1))
    fi
  done
  
  read -p "Chọn file backup (1-$((i-1))): " backup_choice
  
  if ! [[ "$backup_choice" =~ ^[0-9]+$ ]] || [ "$backup_choice" -lt 1 ] || [ "$backup_choice" -gt $((i-1)) ]; then
    echo -e "${RED}Lựa chọn không hợp lệ${NC}"
    return
  fi
  
  local selected_backup="${backup_files[$((backup_choice-1))]}"
  
  echo -e "${BLUE}Đang lấy danh sách các bảng từ file $(basename "$selected_backup")...${NC}"
  # Lấy danh sách bảng từ file backup, bỏ qua các comment và dòng trống
  local tables=()
  while read -r table; do
    if [ -n "$table" ]; then
      tables+=("$table")
    fi
  done < <(gunzip < "$selected_backup" | pg_restore -l | grep "TABLE " | awk '{print $NF}')
  
  if [ ${#tables[@]} -eq 0 ]; then
    echo -e "${RED}Không tìm thấy bảng nào trong file backup này.${NC}"
    return
  fi

  echo -e "${BLUE}Các bảng có trong file backup:${NC}"
  for i in "${!tables[@]}"; do
    echo -e "$((i+1))) ${tables[i]}"
  done
  
  read -p "Chọn bảng để restore (1-${#tables[@]}): " table_choice
  
  if ! [[ "$table_choice" =~ ^[0-9]+$ ]] || [ "$table_choice" -lt 1 ] || [ "$table_choice" -gt ${#tables[@]} ]; then
    echo -e "${RED}Lựa chọn không hợp lệ${NC}"
    return
  fi

  local selected_table="${tables[$((table_choice-1))]}"
  
  echo -e "${YELLOW}CẢNH BÁO: Dữ liệu của bảng '${selected_table}' sẽ bị ghi đè.${NC}"
  read -p "Bạn có chắc chắn muốn tiếp tục? (y/n): " confirm
  
  if [[ "$confirm" =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Đang restore bảng '${selected_table}' từ file ${selected_backup}...${NC}"
    
    # pg_restore sẽ tự xử lý các dependency. Flag --clean sẽ drop object trước khi tạo lại.
    gunzip < "$selected_backup" | PGPASSWORD=$DB_PASS pg_restore -h $DB_HOST -p $DB_PORT -U $DB_USER -d "$DB_NAME" -t "$selected_table" --clean --if-exists
    
    if [ ${PIPESTATUS[1]} -eq 0 ]; then
      echo -e "${GREEN}Restore bảng '${selected_table}' thành công.${NC}"
      log_action "Restored table '${selected_table}' into '${DB_NAME}' from file '${selected_backup}'"
    else
      echo -e "${RED}Restore bảng '${selected_table}' thất bại.${NC}"
      log_action "Restore table '${selected_table}' from file '${selected_backup}' FAILED."
    fi
  else
    echo -e "${YELLOW}Hủy thao tác restore.${NC}"
  fi
}

# Import dữ liệu từ file CSV vào một bảng
import_from_csv() {
  local tables=()
  while read -r table; do
    if [ -n "$table" ]; then
      tables+=("$table")
    fi
  done < <(get_tables)
  
  if [ ${#tables[@]} -eq 0 ]; then
    echo -e "${RED}Không tìm thấy bảng nào trong database.${NC}"
    return
  fi
  
  echo -e "${BLUE}Chọn bảng để import dữ liệu vào:${NC}"
  for i in "${!tables[@]}"; do
    echo -e "$((i+1))) ${tables[i]}"
  done
  
  read -p "Chọn bảng (1-${#tables[@]}): " choice
  
  if ! [[ "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 1 ] || [ "$choice" -gt ${#tables[@]} ]; then
    echo -e "${RED}Lựa chọn không hợp lệ${NC}"
    return
  fi
  
  local selected_table="${tables[$((choice-1))]}"
  
  read -ep "Nhập đường dẫn đầy đủ đến file CSV: " csv_file
  
  if [ ! -f "$csv_file" ]; then
    echo -e "${RED}File CSV không tồn tại: ${csv_file}${NC}"
    return
  fi
  
  echo -e "${BLUE}Đang import dữ liệu từ ${csv_file} vào bảng ${selected_table}...${NC}"
  # Sử dụng \copy từ psql. Yêu cầu file CSV có header khớp với tên cột.
  PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d "$DB_NAME" -c "\copy \"${selected_table}\" FROM '${csv_file}' WITH (FORMAT csv, HEADER true);"
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Import dữ liệu thành công.${NC}"
    log_action "Imported data from '${csv_file}' to table '${selected_table}'"
  else
    echo -e "${RED}Import dữ liệu thất bại.${NC}"
    log_action "Import from '${csv_file}' to table '${selected_table}' FAILED."
  fi
}

# Export dữ liệu từ một bảng ra file CSV
export_to_csv() {
  local tables=()
  while read -r table; do
    if [ -n "$table" ]; then
      tables+=("$table")
    fi
  done < <(get_tables)
  
  if [ ${#tables[@]} -eq 0 ]; then
    echo -e "${RED}Không tìm thấy bảng nào trong database.${NC}"
    return
  fi
  
  echo -e "${BLUE}Chọn bảng để export dữ liệu:${NC}"
  for i in "${!tables[@]}"; do
    echo -e "$((i+1))) ${tables[i]}"
  done
  
  read -p "Chọn bảng (1-${#tables[@]}): " choice
  
  if ! [[ "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 1 ] || [ "$choice" -gt ${#tables[@]} ]; then
    echo -e "${RED}Lựa chọn không hợp lệ${NC}"
    return
  fi
  
  local selected_table="${tables[$((choice-1))]}"
  local output_dir="./exports"
  mkdir -p "$output_dir"
  local csv_file="${output_dir}/${selected_table}_$(date +"%Y%m%d_%H%M%S").csv"
  
  echo -e "${BLUE}Đang export dữ liệu từ bảng ${selected_table} ra file ${csv_file}...${NC}"
  # Sử dụng \copy từ psql để export ra file với header
  PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d "$DB_NAME" -c "\copy \"${selected_table}\" TO '${csv_file}' WITH (FORMAT csv, HEADER true);"
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Export dữ liệu thành công. File lưu tại: ${csv_file}${NC}"
    log_action "Exported data from table '${selected_table}' to file '${csv_file}'"
  else
    echo -e "${RED}Export dữ liệu thất bại.${NC}"
    log_action "Export from table '${selected_table}' to file '${csv_file}' FAILED."
  fi
}

# Kiểm tra trạng thái service PostgreSQL
check_postgres_service() {
  echo -e "${BLUE}Đang kiểm tra trạng thái dịch vụ PostgreSQL...${NC}"
  # pg_isready là một tiện ích client để kiểm tra trạng thái kết nối của server
  pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -q
  local status=$?

  if [ $status -eq 0 ]; then
    echo -e "Host: $DB_HOST, Port: $DB_PORT -> ${GREEN}Running (Chấp nhận kết nối)${NC}"
  elif [ $status -eq 1 ]; then
    echo -e "Host: $DB_HOST, Port: $DB_PORT -> ${RED}Stopped (Từ chối kết nối)${NC}"
  elif [ $status -eq 2 ]; then
    echo -e "Host: $DB_HOST, Port: $DB_PORT -> ${YELLOW}Warning (Không phản hồi)${NC}"
  else
    echo -e "Host: $DB_HOST, Port: $DB_PORT -> ${RED}Lỗi không xác định (Mã lỗi: $status)${NC}"
  fi
}

# Hướng dẫn cài đặt backup tự động (cron job)
setup_cron_job() {
  clear
  display_logo
  echo -e "${BLUE}=== HƯỚNG DẪN CÀI ĐẶT BACKUP TỰ ĐỘNG ===${NC}"
  echo -e "Tính năng này sẽ hướng dẫn bạn tạo một cron job để tự động backup database."
  echo -e "Script sẽ chạy ở chế độ không tương tác theo lịch bạn đặt."
  echo -e "${YELLOW}Lưu ý: Bạn cần có quyền để chỉnh sửa crontab của user đang đăng nhập.${NC}"
  echo ""
  
  echo -e "Đây là một vài ví dụ về cron expression:"
  echo -e "  - ${GREEN}0 2 * * *${NC}       : Chạy vào 2:00 sáng mỗi ngày."
  echo -e "  - ${GREEN}0 3 * * 0${NC}       : Chạy vào 3:00 sáng Chủ Nhật hàng tuần."
  echo -e "  - ${GREEN}0 */6 * * *${NC}      : Chạy mỗi 6 tiếng."
  
  read -p "Nhập cron expression của bạn (ví dụ: '0 2 * * *'): " cron_expression
  
  # Lấy đường dẫn tuyệt đối của script đang chạy
  local script_path
  script_path=$(realpath "$0")
  local script_dir
  script_dir=$(dirname "$script_path")
  
  echo -e "\n${BLUE}Để cài đặt, hãy thêm dòng sau vào crontab của bạn:${NC}"
  echo -e "1. Mở crontab editor bằng lệnh: ${YELLOW}crontab -e${NC}"
  echo -e "2. Thêm dòng sau vào cuối file, sau đó lưu và thoát:"
  echo -e "\n${GREEN}${cron_expression} cd ${script_dir} && ${script_path} auto_backup >> ${script_dir}/cron.log 2>&1${NC}\n"
  
  echo -e "Dòng trên sẽ:"
  echo -e "  - Chuyển vào thư mục của script ('${script_dir}')."
  echo -e "  - Chạy script này với đối số 'auto_backup' để thực hiện backup."
  echo -e "  - Ghi log output của cron job vào file 'cron.log' trong cùng thư mục."
}

# --- MENU CHÍNH VÀ THỰC THI ---

# Menu chính
main_menu() {
  while true; do
    clear
    display_logo
    
    echo -e "${BLUE}=== QUẢN LÝ DATABASE ===${NC}"
    echo -e "Host: ${DB_HOST} | DB: ${DB_NAME} | User: ${DB_USER}"
    echo "--------------------------------------------------"
    echo -e "${YELLOW}1.${NC} Backup database"
    echo -e "${YELLOW}2.${NC} Restore toàn bộ database"
    echo -e "${YELLOW}3.${NC} Restore một bảng từ backup"
    echo -e "${YELLOW}4.${NC} Xóa database (Drop)"
    echo -e "${YELLOW}5.${NC} Xóa dữ liệu của bảng (Truncate)"
    echo -e "${YELLOW}6.${NC} Import dữ liệu từ CSV"
    echo -e "${YELLOW}7.${NC} Export dữ liệu ra CSV"
    echo -e "${YELLOW}8.${NC} Xem thông tin database"
    echo -e "${YELLOW}9.${NC} Kiểm tra trạng thái PostgreSQL"
    echo -e "${YELLOW}10.${NC} Hướng dẫn cài đặt backup tự động"
    echo -e "${YELLOW}0.${NC} Thoát"
    
    read -p "Nhập lựa chọn của bạn (0-10): " choice
    
    case $choice in
      1) backup_database ;;
      2) restore_database ;;
      3) restore_single_table ;;
      4) drop_database ;;
      5) truncate_tables ;;
      6) import_from_csv ;;
      7) export_to_csv ;;
      8) show_database_info ;;
      9) check_postgres_service ;;
      10) setup_cron_job ;;
      0) echo -e "${GREEN}Cảm ơn đã sử dụng công cụ quản lý database!${NC}"; log_action "Exited tool."; exit 0 ;;
      *) echo -e "${RED}Lựa chọn không hợp lệ${NC}" ;;
    esac
    
    echo ""
    read -p "Nhấn Enter để tiếp tục..."
  done
}

# --- ĐIỂM BẮT ĐẦU THỰC THI SCRIPT ---

# Xử lý đối số dòng lệnh cho các tác vụ không tương tác (ví dụ: cron)
if [ "$1" = "auto_backup" ]; then
  # Chuyển đến thư mục của script để các đường dẫn tương đối hoạt động đúng
  cd "$(dirname "$0")"
  
  log_action "Cron job 'auto_backup' started."
  load_env
  if [ -n "$DB_NAME" ]; then
    backup_database
  else
    log_action "AUTO_BACKUP FAILED: DB credentials not loaded from .env"
    echo "Lỗi: Không thể tải thông tin DB từ .env. Vui lòng kiểm tra file .env."
  fi
  log_action "Cron job 'auto_backup' finished."
  exit 0
fi

# Thực thi chương trình ở chế độ tương tác
display_logo
check_requirements
load_env

if test_connection; then
  # Chạy cảnh báo dung lượng DB khi khởi động
  show_database_info > /dev/null
  main_menu
else
  echo -e "${RED}Không thể kết nối đến database. Vui lòng kiểm tra lại thông tin kết nối hoặc chạy lại script.${NC}"
  log_action "Connection test failed. Exiting."
  exit 1
fi
