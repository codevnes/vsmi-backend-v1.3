/*
  Warnings:

  - You are about to drop the column `date` on the `SelectedStocks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[symbol]` on the table `SelectedStocks` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SelectedStocks_date_idx";

-- DropIndex
DROP INDEX "SelectedStocks_symbol_date_key";

-- AlterTable
ALTER TABLE "SelectedStocks" DROP COLUMN "date";

-- CreateIndex
CREATE UNIQUE INDEX "SelectedStocks_symbol_key" ON "SelectedStocks"("symbol");
