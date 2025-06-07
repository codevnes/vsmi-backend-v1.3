# API Quản lý Chỉ số Tài chính (Financial Metrics)

API này cung cấp các endpoint để quản lý chỉ số tài chính của các mã chứng khoán theo quý/năm.

## Endpoints

### 1. Lấy danh sách chỉ số tài chính

```
GET /api/financial-metrics
```

**Query Parameters:**
- `page` (optional): Số trang, mặc định là 1
- `limit` (optional): Số lượng kết quả trên mỗi trang, mặc định là 20
- `symbol` (optional): Lọc theo mã chứng khoán
- `year` (optional): Lọc theo năm
- `quarter` (optional): Lọc theo quý

**Response:**
```json
{
  "message": "Financial metrics retrieved successfully",
  "data": [
    {
      "id": "uuid-string",
      "symbol": "VNM",
      "year": 2023,
      "quarter": 4,
      "eps": 1500.5,
      "epsIndustry": 1200.3,
      "pe": 15.2,
      "peIndustry": 14.5,
      "roa": 12.5,
      "roe": 18.7,
      "roaIndustry": 10.2,
      "roeIndustry": 15.3,
      "revenue": 15000000000,
      "margin": 25.5,
      "totalDebtToEquity": 0.5,
      "totalAssetsToEquity": 1.8,
      "createdAt": "2023-01-15T08:30:00.000Z",
      "updatedAt": "2023-01-15T08:30:00.000Z",
      "stock": {
        "name": "Vinamilk",
        "exchange": "HOSE"
      }
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### 2. Lấy chỉ số tài chính theo ID

```
GET /api/financial-metrics/:id
```

**Response:**
```json
{
  "message": "Financial metrics retrieved successfully",
  "metrics": {
    "id": "uuid-string",
    "symbol": "VNM",
    "year": 2023,
    "quarter": 4,
    "eps": 1500.5,
    "epsIndustry": 1200.3,
    "pe": 15.2,
    "peIndustry": 14.5,
    "roa": 12.5,
    "roe": 18.7,
    "roaIndustry": 10.2,
    "roeIndustry": 15.3,
    "revenue": 15000000000,
    "margin": 25.5,
    "totalDebtToEquity": 0.5,
    "totalAssetsToEquity": 1.8,
    "createdAt": "2023-01-15T08:30:00.000Z",
    "updatedAt": "2023-01-15T08:30:00.000Z",
    "stock": {
      "name": "Vinamilk",
      "exchange": "HOSE"
    }
  }
}
```

### 3. Lấy chỉ số tài chính theo mã chứng khoán, năm và quý

```
GET /api/financial-metrics/stock/:symbol/year/:year/quarter/:quarter
```

**Response:**
```json
{
  "message": "Financial metrics retrieved successfully",
  "metrics": {
    "id": "uuid-string",
    "symbol": "VNM",
    "year": 2023,
    "quarter": 4,
    "eps": 1500.5,
    "epsIndustry": 1200.3,
    "pe": 15.2,
    "peIndustry": 14.5,
    "roa": 12.5,
    "roe": 18.7,
    "roaIndustry": 10.2,
    "roeIndustry": 15.3,
    "revenue": 15000000000,
    "margin": 25.5,
    "totalDebtToEquity": 0.5,
    "totalAssetsToEquity": 1.8,
    "createdAt": "2023-01-15T08:30:00.000Z",
    "updatedAt": "2023-01-15T08:30:00.000Z",
    "stock": {
      "name": "Vinamilk",
      "exchange": "HOSE"
    }
  }
}
```

### 4. Lấy chỉ số tài chính theo mã chứng khoán và năm (dữ liệu năm)

```
GET /api/financial-metrics/stock/:symbol/year/:year
```

**Response:**
```json
{
  "message": "Financial metrics retrieved successfully",
  "metrics": {
    "id": "uuid-string",
    "symbol": "VNM",
    "year": 2023,
    "quarter": null,
    "eps": 4500.5,
    "epsIndustry": 3800.3,
    "pe": 15.2,
    "peIndustry": 14.5,
    "roa": 12.5,
    "roe": 18.7,
    "roaIndustry": 10.2,
    "roeIndustry": 15.3,
    "revenue": 60000000000,
    "margin": 25.5,
    "totalDebtToEquity": 0.5,
    "totalAssetsToEquity": 1.8,
    "createdAt": "2023-01-15T08:30:00.000Z",
    "updatedAt": "2023-01-15T08:30:00.000Z",
    "stock": {
      "name": "Vinamilk",
      "exchange": "HOSE"
    }
  }
}
```

### 5. Lấy toàn bộ chỉ số tài chính của một mã chứng khoán

Cung cấp toàn bộ dữ liệu tài chính (cả năm và quý) cho một mã chứng khoán cụ thể. Kết quả được trả về dưới dạng một danh sách không phân trang.

```
GET /api/financial-metrics/stock/:symbol
```

**Response:**
```json
{
  "message": "All financial metrics for symbol retrieved successfully",
  "data": [
    {
      "id": "uuid-string-1",
      "symbol": "VNM",
      "year": 2023,
      "quarter": null,
      "eps": 4500.5,
      "epsIndustry": 3800.3,
      "pe": 15.2,
      "peIndustry": 14.5,
      "roa": 12.5,
      "roe": 18.7,
      "roaIndustry": 10.2,
      "roeIndustry": 15.3,
      "revenue": 60000000000,
      "margin": 25.5,
      "totalDebtToEquity": 0.5,
      "totalAssetsToEquity": 1.8,
      "createdAt": "2023-01-15T08:30:00.000Z",
      "updatedAt": "2023-01-15T08:30:00.000Z",
      "stock": {
        "name": "Vinamilk",
        "exchange": "HOSE"
      }
    },
    {
      "id": "uuid-string-2",
      "symbol": "VNM",
      "year": 2023,
      "quarter": 4,
      "eps": 1500.5,
      "epsIndustry": 1200.3,
      "pe": 15.2,
      "peIndustry": 14.5,
      "roa": 12.5,
      "roe": 18.7,
      "roaIndustry": 10.2,
      "roeIndustry": 15.3,
      "revenue": 15000000000,
      "margin": 25.5,
      "totalDebtToEquity": 0.5,
      "totalAssetsToEquity": 1.8,
      "createdAt": "2023-01-15T08:30:00.000Z",
      "updatedAt": "2023-01-15T08:30:00.000Z",
      "stock": {
        "name": "Vinamilk",
        "exchange": "HOSE"
      }
    }
  ]
}
```

### 6. Tạo chỉ số tài chính mới (Yêu cầu quyền Admin)

```
POST /api/financial-metrics
```

**Request Body:**
```json
{
  "symbol": "VNM",
  "year": 2023,
  "quarter": 4,
  "eps": 1500.5,
  "epsIndustry": 1200.3,
  "pe": 15.2,
  "peIndustry": 14.5,
  "roa": 12.5,
  "roe": 18.7,
  "roaIndustry": 10.2,
  "roeIndustry": 15.3,
  "revenue": 15000000000,
  "margin": 25.5,
  "totalDebtToEquity": 0.5,
  "totalAssetsToEquity": 1.8
}
```

**Response:**
```json
{
  "message": "Financial metrics created successfully",
  "metrics": {
    "id": "uuid-string",
    "symbol": "VNM",
    "year": 2023,
    "quarter": 4,
    "eps": 1500.5,
    "epsIndustry": 1200.3,
    "pe": 15.2,
    "peIndustry": 14.5,
    "roa": 12.5,
    "roe": 18.7,
    "roaIndustry": 10.2,
    "roeIndustry": 15.3,
    "revenue": 15000000000,
    "margin": 25.5,
    "totalDebtToEquity": 0.5,
    "totalAssetsToEquity": 1.8,
    "createdAt": "2023-01-15T08:30:00.000Z",
    "updatedAt": "2023-01-15T08:30:00.000Z"
  }
}
```

### 7. Cập nhật chỉ số tài chính (Yêu cầu quyền Admin)

```
PUT /api/financial-metrics/:id
```

**Request Body:**
```json
{
  "eps": 1550.5,
  "pe": 14.8,
  "revenue": 15500000000,
  "margin": 26.2
}
```

**Response:**
```json
{
  "message": "Financial metrics updated successfully",
  "metrics": {
    "id": "uuid-string",
    "symbol": "VNM",
    "year": 2023,
    "quarter": 4,
    "eps": 1550.5,
    "epsIndustry": 1200.3,
    "pe": 14.8,
    "peIndustry": 14.5,
    "roa": 12.5,
    "roe": 18.7,
    "roaIndustry": 10.2,
    "roeIndustry": 15.3,
    "revenue": 15500000000,
    "margin": 26.2,
    "totalDebtToEquity": 0.5,
    "totalAssetsToEquity": 1.8,
    "createdAt": "2023-01-15T08:30:00.000Z",
    "updatedAt": "2023-01-16T10:45:00.000Z"
  }
}
```

### 8. Xóa chỉ số tài chính (Yêu cầu quyền Admin)

```
DELETE /api/financial-metrics/:id
```

**Response:**
```json
{
  "message": "Financial metrics deleted successfully"
}
```

### 9. Tạo nhiều chỉ số tài chính cùng lúc (Yêu cầu quyền Admin)

```
POST /api/financial-metrics/bulk
```

**Request Body:**
```json
{
  "financialMetrics": [
    {
      "symbol": "VNM",
      "year": 2023,
      "quarter": 3,
      "eps": 1400.5,
      "pe": 15.8,
      "roa": 12.1,
      "roe": 18.2
    },
    {
      "symbol": "VNM",
      "year": 2023,
      "quarter": 2,
      "eps": 1350.2,
      "pe": 16.1,
      "roa": 11.9,
      "roe": 17.8
    }
  ]
}
```

**Response:**
```json
{
  "message": "Financial metrics bulk created successfully",
  "count": 2
}
```

## Mô hình dữ liệu

### FinancialMetrics

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| id | String (UUID) | ID duy nhất của chỉ số tài chính |
| symbol | String | Mã chứng khoán |
| year | Integer | Năm của dữ liệu |
| quarter | Integer (nullable) | Quý của dữ liệu (null nếu là dữ liệu năm) |
| eps | Float | Thu nhập trên mỗi cổ phiếu |
| epsIndustry | Float | Thu nhập trên mỗi cổ phiếu trung bình ngành |
| pe | Float | Tỷ lệ giá trên thu nhập |
| peIndustry | Float | Tỷ lệ giá trên thu nhập trung bình ngành |
| roa | Float | Tỷ suất lợi nhuận trên tài sản |
| roe | Float | Tỷ suất lợi nhuận trên vốn chủ sở hữu |
| roaIndustry | Float | Tỷ suất lợi nhuận trên tài sản trung bình ngành |
| roeIndustry | Float | Tỷ suất lợi nhuận trên vốn chủ sở hữu trung bình ngành |
| revenue | Float | Doanh thu |
| margin | Float | Biên lợi nhuận |
| totalDebtToEquity | Float | Tỷ lệ nợ trên vốn chủ sở hữu |
| totalAssetsToEquity | Float | Tỷ lệ tài sản trên vốn chủ sở hữu |
| createdAt | DateTime | Thời điểm tạo |
| updatedAt | DateTime | Thời điểm cập nhật gần nhất |