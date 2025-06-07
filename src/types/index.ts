import { Request } from 'express';
import { Role } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: Role;
  };
}

export interface TechnicalAnalysisDto {
  symbol: string;
  close?: number;
  
  rsi14?: number;
  rsiEvaluation?: string;
  
  stochasticK?: number;
  stochasticEvaluation?: string;
  
  williamsR?: number;
  williamsEvaluation?: string;
  
  ultimateOscillator?: number;
  ultimateOscillatorEvaluation?: string;
  
  cci20?: number;
  cciEvaluation?: string;
  
  stochasticRsiFast?: number;
  stochasticRsiFastEvaluation?: string;
  
  macdLevel?: number;
  macdEvaluation?: string;
  
  adx14?: number;
  adxEvaluation?: string;
  
  momentum10?: number;
  momentumEvaluation?: string;
  
  ma10?: number;
  ma10Evaluation?: string;
  
  ma20?: number;
  ma20Evaluation?: string;
  
  ma30?: number;
  ma30Evaluation?: string;
  
  ma50?: number;
  ma50Evaluation?: string;
  
  ma100?: number;
  ma100Evaluation?: string;
  
  ma200?: number;
  ma200Evaluation?: string;
  
  hma9?: number;
  hma9Evaluation?: string;
  
  ichimokuBaseLine?: number;
  ichimokuBaseLineEvaluation?: string;
}

export interface TechnicalRecommendationDto {
  symbol: string;
  date: Date;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
  rsi14?: number;
  macdLine?: number;
  macdSignal?: number;
  macdHistogram?: number;
  stochasticK?: number;
  stochasticD?: number;
  williamsR?: number;
  adx14?: number;
  plusDi14?: number;
  minusDi14?: number;
  momentum10?: number;
  ultimateOscillator?: number;
  cci20?: number;
  stochRsiK?: number;
  stochRsiD?: number;
  awesomeOscillator?: number;
  bullPower13?: number;
  bearPower13?: number;
  sma10?: number;
  ema10?: number;
  sma20?: number;
  ema20?: number;
  sma30?: number;
  ema30?: number;
  sma50?: number;
  ema50?: number;
  sma100?: number;
  ema100?: number;
  sma200?: number;
  ema200?: number;
  hma9?: number;
  ichimokuBaseLine26?: number;
}

export * from './auth.types';
