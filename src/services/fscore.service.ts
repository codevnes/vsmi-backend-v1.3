import { FScoreRepository, IFScore, IFScoreCreate, IFScoreUpdate } from '../repositories/fscore.repository';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { envConfig } from '../config/env.config';
import { prisma } from '../app';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4.1';
const FSCORE_PROMPT_PATH = path.join(process.cwd(), 'src/prompt/fscore.txt');
const DATA_FSCORE_DIR = path.join(process.cwd(), 'data-fscore');

export class FScoreService {
  private fscoreRepository: FScoreRepository;
  private apiKey: string;
  private promptTemplate: string;

  constructor() {
    this.fscoreRepository = new FScoreRepository();
    this.apiKey = envConfig.openaiApiKey || '';
    
    if (!this.apiKey) {
      console.error('OpenAI API key is not set. Please set OPENAI_API_KEY in your environment variables.');
    }
    
    // Load the prompt template
    try {
      this.promptTemplate = fs.readFileSync(FSCORE_PROMPT_PATH, 'utf8');
    } catch (error) {
      console.error('Error loading prompt template:', error);
      this.promptTemplate = '';
    }
  }

  /**
   * Get FScore by ID
   */
  async getById(id: string): Promise<IFScore | null> {
    return this.fscoreRepository.findById(id);
  }

  /**
   * Get FScore by symbol
   */
  async getBySymbol(symbol: string): Promise<IFScore | null> {
    return this.fscoreRepository.findBySymbol(symbol);
  }

  /**
   * Get all FScores
   */
  async getAll(): Promise<IFScore[]> {
    return this.fscoreRepository.findAll();
  }

  /**
   * Create a new FScore
   */
  async create(data: IFScoreCreate): Promise<IFScore> {
    return this.fscoreRepository.create(data);
  }

  /**
   * Update FScore by ID
   */
  async update(id: string, data: IFScoreUpdate): Promise<IFScore> {
    return this.fscoreRepository.update(id, data);
  }

  /**
   * Update FScore by symbol
   */
  async updateBySymbol(symbol: string, data: IFScoreUpdate): Promise<IFScore> {
    return this.fscoreRepository.updateBySymbol(symbol, data);
  }

  /**
   * Delete FScore by ID
   */
  async delete(id: string): Promise<IFScore> {
    return this.fscoreRepository.delete(id);
  }

  /**
   * Delete FScore by symbol
   */
  async deleteBySymbol(symbol: string): Promise<IFScore> {
    return this.fscoreRepository.deleteBySymbol(symbol);
  }

  /**
   * Create or update FScore by symbol
   */
  async upsert(symbol: string, data: IFScoreCreate): Promise<IFScore> {
    return this.fscoreRepository.upsert(symbol, data);
  }

  /**
   * Process F-Score data with ChatGPT
   * @param symbol Stock symbol
   */
  async processFScoreAnalysis(symbol: string): Promise<any> {
    try {
      // Check if the analysis already exists
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingAnalysis = await prisma.fScoreAnalysis.findFirst({
        where: { 
          symbol,
          analysisDate: {
            gte: today
          }
        },
        orderBy: { analysisDate: 'desc' }
      });

      if (existingAnalysis) {
        return existingAnalysis;
      }

      // If no existing analysis, proceed to fetch data and send to ChatGPT
      const formattedData = await this.getFScoreData(symbol);
      
      if (!formattedData) {
        throw new Error(`No F-Score data found for symbol: ${symbol}`);
      }
      
      // Get analysis from ChatGPT
      const analysisResult = await this.getAnalysisFromChatGPT(formattedData);
      
      // Extract structured data from the analysis
      const extractedData = this.extractStructuredDataFromAnalysis(analysisResult);

      // Store the analysis in the database using upsert to handle duplicates
      const savedAnalysis = await prisma.fScoreAnalysis.upsert({
        where: {
          symbol_analysisDate: {
            symbol,
            analysisDate: today
          }
        },
        update: {
          inputData: formattedData,
          analysisResult,
          tradingRecommendation: extractedData.tradingRecommendation,
          suggestedBuyRange: extractedData.suggestedBuyRange,
          stopLossLevel: extractedData.stopLossLevel,
          updatedAt: new Date()
        },
        create: {
          symbol,
          analysisDate: today,
          inputData: formattedData,
          analysisResult,
          tradingRecommendation: extractedData.tradingRecommendation,
          suggestedBuyRange: extractedData.suggestedBuyRange,
          stopLossLevel: extractedData.stopLossLevel,
        },
      });

      return savedAnalysis;
    } catch (error) {
      console.error('Error processing F-Score analysis:', error);
      throw error;
    }
  }

  /**
   * Get F-Score data for a symbol from Excel files
   * @param symbol Stock symbol
   */
  private async getFScoreData(symbol: string): Promise<any> {
    try {
      // Load data from all Excel files
      const fscoreData = this.readExcelFile(path.join(DATA_FSCORE_DIR, 'F_SCORE.xlsx'), symbol);
      const zscoreData = this.readExcelFile(path.join(DATA_FSCORE_DIR, 'Z_SCORE.xlsx'), symbol);
      const data2023 = this.readExcelFile(path.join(DATA_FSCORE_DIR, 'data_2023.xlsx'), symbol);
      const data2024 = this.readExcelFile(path.join(DATA_FSCORE_DIR, 'data_2024.xlsx'), symbol);
      const balanceSheet = this.readExcelFile(path.join(DATA_FSCORE_DIR, 'BalanceSheet_Q1.2025.xlsx'), symbol);
      const incomeStatement = this.readExcelFile(path.join(DATA_FSCORE_DIR, 'INCOME_Q1.2025.xlsx'), symbol);
      const cashFlow = this.readExcelFile(path.join(DATA_FSCORE_DIR, 'CASHFLOW_Q1.2025.xlsx'), symbol);

      if (!fscoreData || !zscoreData) {
        throw new Error(`No F-Score or Z-Score data found for symbol: ${symbol}`);
      }

      // Format the data for ChatGPT
      return {
        symbol,
        fScore: fscoreData,
        zScore: zscoreData,
        data_2023: data2023,
        data_2024: data2024,
        balanceSheet: balanceSheet,
        incomeStatement: incomeStatement,
        cashFlow: cashFlow
      };
    } catch (error) {
      console.error(`Error getting F-Score data for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Read Excel file and find data for a specific symbol
   * @param filePath Path to the Excel file
   * @param symbol Stock symbol to search for
   */
  private readExcelFile(filePath: string, symbol: string): any {
    try {
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return null;
      }

      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      // Find the row with the matching symbol
      const symbolData = data.find((row: any) => 
        row.Symbol === symbol || 
        row.symbol === symbol ||
        row.SYMBOL === symbol ||
        row.Mã === symbol ||
        row.mã === symbol ||
        row.MA === symbol ||
        row.ma === symbol
      );

      return symbolData || null;
    } catch (error) {
      console.error(`Error reading Excel file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Send data to ChatGPT and get analysis
   * @param data Formatted data for analysis
   */
  private async getAnalysisFromChatGPT(data: any): Promise<string> {
    try {
      if (!this.apiKey) {
        throw new Error('OpenAI API key is not set');
      }

      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: MODEL,
          messages: [
            { role: 'system', content: this.promptTemplate },
            { role: 'user', content: JSON.stringify(data, null, 2) }
          ],
          temperature: 0.2,
          max_tokens: 2500,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling ChatGPT API:', error);
      throw error;
    }
  }

  /**
   * Extract structured data from ChatGPT analysis text
   * @param analysisText The analysis text from ChatGPT
   */
  private extractStructuredDataFromAnalysis(analysisText: string): {
    tradingRecommendation: string;
    suggestedBuyRange: string;
    stopLossLevel: string;
  } {
    // Default values
    let tradingRecommendation = '';
    let suggestedBuyRange = '';
    let stopLossLevel = '';

    // Extract trading recommendation
    const recommendationMatch = analysisText.match(/Khuyến nghị.*?:(.*?)(?:\n|$)/i);
    if (recommendationMatch && recommendationMatch[1]) {
      tradingRecommendation = recommendationMatch[1].trim();
    }

    // Extract suggested buy range
    const buyRangeMatch = analysisText.match(/Vùng giá mua.*?:(.*?)(?:\n|$)/i) || 
                          analysisText.match(/Vùng giá.*?:(.*?)(?:\n|$)/i);
    if (buyRangeMatch && buyRangeMatch[1]) {
      suggestedBuyRange = buyRangeMatch[1].trim();
    }

    // Extract stop loss level
    const stopLossMatch = analysisText.match(/Cắt lỗ.*?:(.*?)(?:\n|$)/i) ||
                          analysisText.match(/Mức cắt lỗ.*?:(.*?)(?:\n|$)/i);
    if (stopLossMatch && stopLossMatch[1]) {
      stopLossLevel = stopLossMatch[1].trim();
    }

    return {
      tradingRecommendation,
      suggestedBuyRange,
      stopLossLevel
    };
  }

  /**
   * Batch process F-Score analyses for multiple symbols
   * @param symbols Array of stock symbols
   */
  async batchProcessFScoreAnalyses(symbols: string[]): Promise<any> {
    const results = [];
    const errors = [];

    // Process each symbol sequentially to avoid rate limiting
    for (const symbol of symbols) {
      try {
        const analysis = await this.processFScoreAnalysis(symbol);
        results.push(analysis);
      } catch (error) {
        errors.push({ 
          symbol, 
          error: (error as Error).message 
        });
      }
    }

    return {
      results,
      errors,
      success: results.length,
      failed: errors.length
    };
  }
}

export default new FScoreService(); 