/*
  Warnings:

  - You are about to drop the column `stochasticRsiD` on the `TechnicalRecommendation` table. All the data in the column will be lost.
  - You are about to drop the column `stochasticRsiK` on the `TechnicalRecommendation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[date,symbol]` on the table `TechnicalRecommendation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TechnicalRecommendation_symbol_date_key";

-- AlterTable
ALTER TABLE "TechnicalRecommendation" DROP COLUMN "stochasticRsiD",
DROP COLUMN "stochasticRsiK",
ADD COLUMN     "adx14" DOUBLE PRECISION,
ADD COLUMN     "awesomeOscillator" DOUBLE PRECISION,
ADD COLUMN     "bearPower13" DOUBLE PRECISION,
ADD COLUMN     "bullPower13" DOUBLE PRECISION,
ADD COLUMN     "cci20" DOUBLE PRECISION,
ADD COLUMN     "minusDi14" DOUBLE PRECISION,
ADD COLUMN     "momentum10" DOUBLE PRECISION,
ADD COLUMN     "plusDi14" DOUBLE PRECISION,
ADD COLUMN     "stochRsiD" DOUBLE PRECISION,
ADD COLUMN     "stochRsiK" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalRecommendation_date_symbol_key" ON "TechnicalRecommendation"("date", "symbol");
