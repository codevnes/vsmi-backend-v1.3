/*
  Warnings:

  - You are about to drop the column `qIndex` on the `SelectedStocks` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "SelectedStocks_qIndex_idx";

-- AlterTable
ALTER TABLE "SelectedStocks" DROP COLUMN "qIndex";
