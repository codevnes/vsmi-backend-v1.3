import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { envConfig } from '../config/env.config';
import { prisma } from '../app';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4.1';
const TECHNICAL_RECOMMENDATION_PROMPT_PATH = path.join(process.cwd(), 'src/prompt/technical-recommendations.txt');

export class OpenAIService {
  private apiKey: string;
  private promptTemplate: string;

  constructor() {
    this.apiKey = envConfig.openaiApiKey || '';
    
    if (!this.apiKey) {
      console.error('OpenAI API key is not set. Please set OPENAI_API_KEY in your environment variables.');
    }
    
    // Load the prompt template
    try {
      this.promptTemplate = fs.readFileSync(TECHNICAL_RECOMMENDATION_PROMPT_PATH, 'utf8');
    } catch (error) {
      console.error('Error loading prompt template:', error);
      this.promptTemplate = '';
    }
  }

  /**
   * Process technical recommendations with ChatGPT
   * @param symbol Stock symbol
   * @param date Analysis date
   */
  async processTechnicalRecommendation(symbol: string, date: string): Promise<any> {
    try {
      // Get the last 20 technical recommendations for the symbol
      const recommendations = await prisma.technicalRecommendation.findMany({
        where: { symbol },
        orderBy: { date: 'desc' },
        take: 20,
      });

      if (!recommendations || recommendations.length === 0) {
        throw new Error(`No technical recommendations found for symbol: ${symbol}`);
      }

      // Sort recommendations from oldest to newest for proper analysis
      const sortedData = [...recommendations].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Format data for ChatGPT input
      const formattedData = this.formatTechnicalRecommendationsForGPT(sortedData);
      
      // Get analysis from ChatGPT
      const analysisResult = await this.getAnalysisFromChatGPT(formattedData);
      
      // Extract structured data from the analysis
      const extractedData = this.extractStructuredDataFromAnalysis(analysisResult);

      // Store the analysis in the database
      const savedAnalysis = await prisma.chatGptAnalysis.upsert({
        where: {
          symbol_analysisDate: {
            symbol,
            analysisDate: new Date(date),
          },
        },
        update: {
          inputData: formattedData,
          analysisResult,
          tradingRecommendation: extractedData.tradingRecommendation,
          suggestedBuyRange: extractedData.suggestedBuyRange,
          stopLossLevel: extractedData.stopLossLevel,
          updatedAt: new Date(),
        },
        create: {
          symbol,
          analysisDate: new Date(date),
          inputData: formattedData,
          analysisResult,
          tradingRecommendation: extractedData.tradingRecommendation,
          suggestedBuyRange: extractedData.suggestedBuyRange,
          stopLossLevel: extractedData.stopLossLevel,
        },
      });

      return savedAnalysis;
    } catch (error) {
      console.error('Error processing technical recommendation:', error);
      throw error;
    }
  }

  /**
   * Format technical recommendations data for ChatGPT input
   * @param recommendations Technical recommendations data
   */
  private formatTechnicalRecommendationsForGPT(recommendations: any[]): any {
    // Convert the array of recommendations into a readable tabular format
    // Include all relevant technical indicators and price data
    const formattedData = {
      symbol: recommendations[0].symbol,
      data: recommendations.map(rec => ({
        date: new Date(rec.date).toISOString().split('T')[0],
        open: rec.open,
        high: rec.high,
        low: rec.low,
        close: rec.close,
        volume: rec.volume,
        rsi14: rec.rsi14,
        macdLine: rec.macdLine,
        macdSignal: rec.macdSignal,
        macdHistogram: rec.macdHistogram,
        stochasticK: rec.stochasticK,
        stochasticD: rec.stochasticD,
        williamsR: rec.williamsR,
        ultimateOscillator: rec.ultimateOscillator,
        adx14: rec.adx14,
        sma10: rec.sma10,
        sma20: rec.sma20,
        sma50: rec.sma50,
        sma100: rec.sma100,
        sma200: rec.sma200,
        ema10: rec.ema10,
        ema20: rec.ema20,
        ema50: rec.ema50,
        ema100: rec.ema100,
        ema200: rec.ema200,
        hma9: rec.hma9,
        ichimokuBaseLine26: rec.ichimokuBaseLine26,
        awesomeOscillator: rec.awesomeOscillator,
        bearPower13: rec.bearPower13,
        bullPower13: rec.bullPower13,
        cci20: rec.cci20,
        minusDi14: rec.minusDi14,
        momentum10: rec.momentum10,
        plusDi14: rec.plusDi14,
        stochRsiD: rec.stochRsiD,
        stochRsiK: rec.stochRsiK,
      }))
    };

    return formattedData;
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
          max_tokens: 1500,
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
    const buyRangeMatch = analysisText.match(/Vùng giá mua.*?:(.*?)(?:\n|$)/i);
    if (buyRangeMatch && buyRangeMatch[1]) {
      suggestedBuyRange = buyRangeMatch[1].trim();
    }

    // Extract stop loss level
    const stopLossMatch = analysisText.match(/Cắt lỗ.*?:(.*?)(?:\n|$)/i);
    if (stopLossMatch && stopLossMatch[1]) {
      stopLossLevel = stopLossMatch[1].trim();
    }

    return {
      tradingRecommendation,
      suggestedBuyRange,
      stopLossLevel
    };
  }
}

export default new OpenAIService(); 