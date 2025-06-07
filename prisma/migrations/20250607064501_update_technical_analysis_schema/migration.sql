/*
  Warnings:

  - You are about to drop the column `hma9Trend` on the `TechnicalAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `ichimokuBaseLineTrend` on the `TechnicalAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `ma100Trend` on the `TechnicalAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `ma200Trend` on the `TechnicalAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `ma50Trend` on the `TechnicalAnalysis` table. All the data in the column will be lost.
  - You are about to alter the column `rsiEvaluation` on the `TechnicalAnalysis` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.
  - You are about to alter the column `stochasticEvaluation` on the `TechnicalAnalysis` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.
  - You are about to alter the column `williamsEvaluation` on the `TechnicalAnalysis` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.
  - You are about to alter the column `ultimateOscillatorEvaluation` on the `TechnicalAnalysis` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE "TechnicalAnalysis" DROP COLUMN "hma9Trend",
DROP COLUMN "ichimokuBaseLineTrend",
DROP COLUMN "ma100Trend",
DROP COLUMN "ma200Trend",
DROP COLUMN "ma50Trend",
ADD COLUMN     "adx14" DOUBLE PRECISION,
ADD COLUMN     "adxEvaluation" VARCHAR(20),
ADD COLUMN     "cci20" DOUBLE PRECISION,
ADD COLUMN     "cciEvaluation" VARCHAR(20),
ADD COLUMN     "hma9Evaluation" VARCHAR(20),
ADD COLUMN     "ichimokuBaseLineEvaluation" VARCHAR(20),
ADD COLUMN     "ma10" DOUBLE PRECISION,
ADD COLUMN     "ma100Evaluation" VARCHAR(20),
ADD COLUMN     "ma10Evaluation" VARCHAR(20),
ADD COLUMN     "ma20" DOUBLE PRECISION,
ADD COLUMN     "ma200Evaluation" VARCHAR(20),
ADD COLUMN     "ma20Evaluation" VARCHAR(20),
ADD COLUMN     "ma30" DOUBLE PRECISION,
ADD COLUMN     "ma30Evaluation" VARCHAR(20),
ADD COLUMN     "ma50Evaluation" VARCHAR(20),
ADD COLUMN     "macdEvaluation" VARCHAR(20),
ADD COLUMN     "macdLevel" DOUBLE PRECISION,
ADD COLUMN     "momentum10" DOUBLE PRECISION,
ADD COLUMN     "momentumEvaluation" VARCHAR(20),
ADD COLUMN     "stochasticRsiFast" DOUBLE PRECISION,
ADD COLUMN     "stochasticRsiFastEvaluation" VARCHAR(20),
ALTER COLUMN "rsiEvaluation" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "stochasticEvaluation" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "williamsEvaluation" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "ultimateOscillatorEvaluation" SET DATA TYPE VARCHAR(20);
