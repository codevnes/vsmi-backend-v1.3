export interface ISelectedStocks {
  id: string;
  symbol: string;
  close: number | null;
  return: number | null;
  volume: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISelectedStocksCreate {
  symbol: string;
  date?: Date;
  close?: number | null;
  return?: number | null;
  volume?: number | null;
}

export interface ISelectedStocksUpdate {
  symbol?: string;
  close?: number | null;
  return?: number | null;
  volume?: number | null;
}

export interface ISelectedStocksPublic {
  id: string;
  symbol: string;
  close: number | null;
  return: number | null;
  volume: number | null;
  createdAt: Date;
  updatedAt: Date;
} 