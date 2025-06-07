-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'AUTHOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "thumbnailId" INTEGER,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currency" (
    "code" VARCHAR(10) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" UUID NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "exchange" VARCHAR(100),
    "industry" VARCHAR(100),
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "thumbnailId" INTEGER,
    "description" TEXT,
    "parentId" UUID,
    "deletedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockPrice" (
    "id" UUID NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "date" DATE NOT NULL,
    "open" DECIMAL(10,4) NOT NULL,
    "high" DECIMAL(10,4) NOT NULL,
    "low" DECIMAL(10,4) NOT NULL,
    "close" DECIMAL(10,4) NOT NULL,
    "volume" BIGINT,
    "trendQ" DECIMAL(10,4),
    "fq" DECIMAL(10,4),
    "bandDown" DECIMAL(10,4),
    "bandUp" DECIMAL(10,4),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "StockPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrencyPrice" (
    "id" UUID NOT NULL,
    "currencyCode" VARCHAR(10) NOT NULL,
    "date" DATE NOT NULL,
    "open" DECIMAL(10,4) NOT NULL,
    "high" DECIMAL(10,4) NOT NULL,
    "low" DECIMAL(10,4) NOT NULL,
    "close" DECIMAL(10,4) NOT NULL,
    "trendQ" DECIMAL(10,4),
    "fq" DECIMAL(10,4),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "CurrencyPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialMetrics" (
    "id" UUID NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "year" INTEGER NOT NULL,
    "quarter" INTEGER,
    "eps" DOUBLE PRECISION,
    "epsIndustry" DOUBLE PRECISION,
    "pe" DOUBLE PRECISION,
    "peIndustry" DOUBLE PRECISION,
    "roa" DOUBLE PRECISION,
    "roe" DOUBLE PRECISION,
    "roaIndustry" DOUBLE PRECISION,
    "roeIndustry" DOUBLE PRECISION,
    "revenue" DOUBLE PRECISION,
    "margin" DOUBLE PRECISION,
    "totalDebtToEquity" DOUBLE PRECISION,
    "totalAssetsToEquity" DOUBLE PRECISION,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "FinancialMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlanSymbol" (
    "id" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionPlanSymbol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "startDate" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMPTZ(3) NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdBy" UUID,
    "updatedBy" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "thumbnailId" INTEGER,
    "categoryId" UUID NOT NULL,
    "symbol" VARCHAR(10),
    "userId" UUID NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "filename" VARCHAR(191) NOT NULL,
    "processedFilename" VARCHAR(191) NOT NULL,
    "path" VARCHAR(191) NOT NULL,
    "url" VARCHAR(191) NOT NULL,
    "altText" VARCHAR(191),
    "mimetype" VARCHAR(191),
    "size" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockProfile" (
    "id" UUID NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "price" DOUBLE PRECISION,
    "profit" DOUBLE PRECISION,
    "volume" DOUBLE PRECISION,
    "pe" DOUBLE PRECISION,
    "eps" DOUBLE PRECISION,
    "roa" DOUBLE PRECISION,
    "roe" DOUBLE PRECISION,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "StockProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelectedStocks" (
    "id" UUID NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "date" DATE NOT NULL,
    "close" DOUBLE PRECISION,
    "return" DOUBLE PRECISION,
    "qIndex" DOUBLE PRECISION,
    "volume" DOUBLE PRECISION,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "SelectedStocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "symbol" VARCHAR(10),
    "amount" DECIMAL(10,2) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "createdBy" UUID NOT NULL,
    "updatedBy" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Watchlist" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_symbol_key" ON "Stock"("symbol");

-- CreateIndex
CREATE INDEX "Stock_symbol_idx" ON "Stock"("symbol");

-- CreateIndex
CREATE INDEX "Stock_industry_idx" ON "Stock"("industry");

-- CreateIndex
CREATE INDEX "Stock_exchange_idx" ON "Stock"("exchange");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "StockPrice_date_idx" ON "StockPrice"("date");

-- CreateIndex
CREATE INDEX "StockPrice_symbol_idx" ON "StockPrice"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "StockPrice_symbol_date_key" ON "StockPrice"("symbol", "date");

-- CreateIndex
CREATE INDEX "CurrencyPrice_date_idx" ON "CurrencyPrice"("date");

-- CreateIndex
CREATE INDEX "CurrencyPrice_currencyCode_idx" ON "CurrencyPrice"("currencyCode");

-- CreateIndex
CREATE UNIQUE INDEX "CurrencyPrice_currencyCode_date_key" ON "CurrencyPrice"("currencyCode", "date");

-- CreateIndex
CREATE INDEX "FinancialMetrics_symbol_idx" ON "FinancialMetrics"("symbol");

-- CreateIndex
CREATE INDEX "FinancialMetrics_year_quarter_idx" ON "FinancialMetrics"("year", "quarter");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialMetrics_symbol_year_quarter_key" ON "FinancialMetrics"("symbol", "year", "quarter");

-- CreateIndex
CREATE INDEX "SubscriptionPlanSymbol_planId_idx" ON "SubscriptionPlanSymbol"("planId");

-- CreateIndex
CREATE INDEX "SubscriptionPlanSymbol_symbol_idx" ON "SubscriptionPlanSymbol"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlanSymbol_planId_symbol_key" ON "SubscriptionPlanSymbol"("planId", "symbol");

-- CreateIndex
CREATE INDEX "Subscription_startDate_endDate_idx" ON "Subscription"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_planId_idx" ON "Subscription"("planId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE INDEX "Post_categoryId_idx" ON "Post"("categoryId");

-- CreateIndex
CREATE INDEX "Post_userId_idx" ON "Post"("userId");

-- CreateIndex
CREATE INDEX "Post_symbol_idx" ON "Post"("symbol");

-- CreateIndex
CREATE INDEX "Post_slug_idx" ON "Post"("slug");

-- CreateIndex
CREATE INDEX "Post_isPremium_idx" ON "Post"("isPremium");

-- CreateIndex
CREATE INDEX "Post_deletedAt_idx" ON "Post"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Image_url_key" ON "Image"("url");

-- CreateIndex
CREATE INDEX "Image_url_idx" ON "Image"("url");

-- CreateIndex
CREATE UNIQUE INDEX "StockProfile_symbol_key" ON "StockProfile"("symbol");

-- CreateIndex
CREATE INDEX "StockProfile_symbol_idx" ON "StockProfile"("symbol");

-- CreateIndex
CREATE INDEX "SelectedStocks_symbol_idx" ON "SelectedStocks"("symbol");

-- CreateIndex
CREATE INDEX "SelectedStocks_date_idx" ON "SelectedStocks"("date");

-- CreateIndex
CREATE INDEX "SelectedStocks_qIndex_idx" ON "SelectedStocks"("qIndex");

-- CreateIndex
CREATE UNIQUE INDEX "SelectedStocks_symbol_date_key" ON "SelectedStocks"("symbol", "date");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_symbol_idx" ON "Transaction"("symbol");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Watchlist_userId_idx" ON "Watchlist"("userId");

-- CreateIndex
CREATE INDEX "Watchlist_symbol_idx" ON "Watchlist"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_userId_symbol_key" ON "Watchlist"("userId", "symbol");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockPrice" ADD CONSTRAINT "StockPrice_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Stock"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrencyPrice" ADD CONSTRAINT "CurrencyPrice_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "Currency"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialMetrics" ADD CONSTRAINT "FinancialMetrics_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Stock"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionPlanSymbol" ADD CONSTRAINT "SubscriptionPlanSymbol_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionPlanSymbol" ADD CONSTRAINT "SubscriptionPlanSymbol_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Stock"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Stock"("symbol") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockProfile" ADD CONSTRAINT "StockProfile_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Stock"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedStocks" ADD CONSTRAINT "SelectedStocks_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Stock"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Stock"("symbol") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Stock"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;
