-- CreateTable
CREATE TABLE "TechnicalRecommendation" (
    "id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "open" DOUBLE PRECISION,
    "high" DOUBLE PRECISION,
    "low" DOUBLE PRECISION,
    "close" DOUBLE PRECISION,
    "volume" DOUBLE PRECISION,
    "rsi14" DOUBLE PRECISION,
    "macdLine" DOUBLE PRECISION,
    "macdSignal" DOUBLE PRECISION,
    "macdHistogram" DOUBLE PRECISION,
    "stochasticK" DOUBLE PRECISION,
    "stochasticD" DOUBLE PRECISION,
    "stochasticRsiK" DOUBLE PRECISION,
    "stochasticRsiD" DOUBLE PRECISION,
    "williamsR" DOUBLE PRECISION,
    "ultimateOscillator" DOUBLE PRECISION,
    "sma10" DOUBLE PRECISION,
    "ema10" DOUBLE PRECISION,
    "sma20" DOUBLE PRECISION,
    "ema20" DOUBLE PRECISION,
    "sma30" DOUBLE PRECISION,
    "ema30" DOUBLE PRECISION,
    "sma50" DOUBLE PRECISION,
    "ema50" DOUBLE PRECISION,
    "sma100" DOUBLE PRECISION,
    "ema100" DOUBLE PRECISION,
    "sma200" DOUBLE PRECISION,
    "ema200" DOUBLE PRECISION,
    "hma9" DOUBLE PRECISION,
    "ichimokuBaseLine26" DOUBLE PRECISION,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "TechnicalRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TechnicalRecommendation_symbol_idx" ON "TechnicalRecommendation"("symbol");

-- CreateIndex
CREATE INDEX "TechnicalRecommendation_date_idx" ON "TechnicalRecommendation"("date");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalRecommendation_date_symbol_key" ON "TechnicalRecommendation"("date", "symbol");

-- AddForeignKey
ALTER TABLE "TechnicalRecommendation" ADD CONSTRAINT "TechnicalRecommendation_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Stock"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;
