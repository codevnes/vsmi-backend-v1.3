-- CreateTable
CREATE TABLE "TechnicalAnalysis" (
    "id" UUID NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "close" DOUBLE PRECISION,
    "rsi14" DOUBLE PRECISION,
    "rsiEvaluation" VARCHAR(50),
    "stochasticK" DOUBLE PRECISION,
    "stochasticEvaluation" VARCHAR(50),
    "williamsR" DOUBLE PRECISION,
    "williamsEvaluation" VARCHAR(50),
    "ultimateOscillator" DOUBLE PRECISION,
    "ultimateOscillatorEvaluation" VARCHAR(50),
    "ma50" DOUBLE PRECISION,
    "ma50Trend" VARCHAR(20),
    "ma100" DOUBLE PRECISION,
    "ma100Trend" VARCHAR(20),
    "ma200" DOUBLE PRECISION,
    "ma200Trend" VARCHAR(20),
    "hma9" DOUBLE PRECISION,
    "hma9Trend" VARCHAR(20),
    "ichimokuBaseLine" DOUBLE PRECISION,
    "ichimokuBaseLineTrend" VARCHAR(20),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "TechnicalAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalAnalysis_symbol_key" ON "TechnicalAnalysis"("symbol");

-- CreateIndex
CREATE INDEX "TechnicalAnalysis_symbol_idx" ON "TechnicalAnalysis"("symbol");

-- AddForeignKey
ALTER TABLE "TechnicalAnalysis" ADD CONSTRAINT "TechnicalAnalysis_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Stock"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;
