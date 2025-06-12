-- Migration to remove date field from SelectedStocks table

-- Remove existing indexes and constraints
DROP INDEX IF EXISTS "SelectedStocks_date_idx";
DROP INDEX IF EXISTS "SelectedStocks_symbol_date_idx";
ALTER TABLE "SelectedStocks" DROP CONSTRAINT IF EXISTS "SelectedStocks_symbol_date_key";

-- Drop the date column
ALTER TABLE "SelectedStocks" DROP COLUMN "date";

-- Add unique constraint to symbol
ALTER TABLE "SelectedStocks" ADD CONSTRAINT "SelectedStocks_symbol_key" UNIQUE ("symbol"); 