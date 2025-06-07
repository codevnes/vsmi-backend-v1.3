/*
  Warnings:

  - A unique constraint covering the columns `[symbol,date]` on the table `TechnicalRecommendation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TechnicalRecommendation_date_symbol_key";

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalRecommendation_symbol_date_key" ON "TechnicalRecommendation"("symbol", "date");
