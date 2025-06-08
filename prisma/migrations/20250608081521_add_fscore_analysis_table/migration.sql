-- CreateTable
CREATE TABLE "FScoreAnalysis" (
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

    CONSTRAINT "FScoreAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FScoreAnalysis_symbol_idx" ON "FScoreAnalysis"("symbol");

-- CreateIndex
CREATE INDEX "FScoreAnalysis_analysisDate_idx" ON "FScoreAnalysis"("analysisDate");

-- CreateIndex
CREATE UNIQUE INDEX "FScoreAnalysis_symbol_analysisDate_key" ON "FScoreAnalysis"("symbol", "analysisDate");

-- AddForeignKey
ALTER TABLE "FScoreAnalysis" ADD CONSTRAINT "FScoreAnalysis_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Stock"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;
