-- CreateTable
CREATE TABLE "ChatGptAnalysis" (
    "id" UUID NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "analysisDate" DATE NOT NULL,
    "inputData" JSONB,
    "analysisResult" TEXT,
    "tradingRecommendation" VARCHAR(50),
    "suggestedBuyRange" VARCHAR(100),
    "stopLossLevel" VARCHAR(100),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ChatGptAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChatGptAnalysis_symbol_idx" ON "ChatGptAnalysis"("symbol");

-- CreateIndex
CREATE INDEX "ChatGptAnalysis_analysisDate_idx" ON "ChatGptAnalysis"("analysisDate");

-- CreateIndex
CREATE UNIQUE INDEX "ChatGptAnalysis_symbol_analysisDate_key" ON "ChatGptAnalysis"("symbol", "analysisDate");

-- AddForeignKey
ALTER TABLE "ChatGptAnalysis" ADD CONSTRAINT "ChatGptAnalysis_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Stock"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;
