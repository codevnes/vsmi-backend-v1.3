-- CreateTable
CREATE TABLE "FScore" (
    "id" UUID NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "roa" DOUBLE PRECISION,
    "cfo" DOUBLE PRECISION,
    "deltaRoa" DOUBLE PRECISION,
    "cfoMinusNetProfit" DOUBLE PRECISION,
    "deltaLongTermDebt" DOUBLE PRECISION,
    "deltaCurrentRatio" DOUBLE PRECISION,
    "newlyIssuedShares" DOUBLE PRECISION,
    "deltaGrossMargin" DOUBLE PRECISION,
    "deltaAssetTurnover" DOUBLE PRECISION,
    "priceToForecastEps" DOUBLE PRECISION,
    "roaPositive" BOOLEAN,
    "cfoPositive" BOOLEAN,
    "deltaRoaPositive" BOOLEAN,
    "cfoGreaterThanNetProfit" BOOLEAN,
    "deltaLongTermDebtNegative" BOOLEAN,
    "deltaCurrentRatioPositive" BOOLEAN,
    "noNewSharesIssued" BOOLEAN,
    "deltaGrossMarginPositive" BOOLEAN,
    "deltaAssetTurnoverPositive" BOOLEAN,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "FScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FScore_symbol_key" ON "FScore"("symbol");

-- CreateIndex
CREATE INDEX "FScore_symbol_idx" ON "FScore"("symbol");

-- AddForeignKey
ALTER TABLE "FScore" ADD CONSTRAINT "FScore_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Stock"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;
