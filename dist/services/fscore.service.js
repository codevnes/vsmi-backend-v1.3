"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FScoreService = void 0;
const fscore_repository_1 = require("../repositories/fscore.repository");
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const XLSX = __importStar(require("xlsx"));
const env_config_1 = require("../config/env.config");
const app_1 = require("../app");
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4.1';
const FSCORE_PROMPT_PATH = path_1.default.join(process.cwd(), 'src/prompt/fscore.txt');
const DATA_FSCORE_DIR = path_1.default.join(process.cwd(), 'data-fscore');
class FScoreService {
    fscoreRepository;
    apiKey;
    promptTemplate;
    constructor() {
        this.fscoreRepository = new fscore_repository_1.FScoreRepository();
        this.apiKey = env_config_1.envConfig.openaiApiKey || '';
        if (!this.apiKey) {
            console.error('OpenAI API key is not set. Please set OPENAI_API_KEY in your environment variables.');
        }
        // Load the prompt template
        try {
            this.promptTemplate = fs_1.default.readFileSync(FSCORE_PROMPT_PATH, 'utf8');
        }
        catch (error) {
            console.error('Error loading prompt template:', error);
            this.promptTemplate = '';
        }
    }
    /**
     * Get FScore by ID
     */
    async getById(id) {
        return this.fscoreRepository.findById(id);
    }
    /**
     * Get FScore by symbol
     */
    async getBySymbol(symbol) {
        return this.fscoreRepository.findBySymbol(symbol);
    }
    /**
     * Get all FScores
     */
    async getAll() {
        return this.fscoreRepository.findAll();
    }
    /**
     * Create a new FScore
     */
    async create(data) {
        return this.fscoreRepository.create(data);
    }
    /**
     * Update FScore by ID
     */
    async update(id, data) {
        return this.fscoreRepository.update(id, data);
    }
    /**
     * Update FScore by symbol
     */
    async updateBySymbol(symbol, data) {
        return this.fscoreRepository.updateBySymbol(symbol, data);
    }
    /**
     * Delete FScore by ID
     */
    async delete(id) {
        return this.fscoreRepository.delete(id);
    }
    /**
     * Delete FScore by symbol
     */
    async deleteBySymbol(symbol) {
        return this.fscoreRepository.deleteBySymbol(symbol);
    }
    /**
     * Create or update FScore by symbol
     */
    async upsert(symbol, data) {
        return this.fscoreRepository.upsert(symbol, data);
    }
    /**
     * Process F-Score data with ChatGPT
     * @param symbol Stock symbol
     */
    async processFScoreAnalysis(symbol) {
        try {
            // Check if the analysis already exists
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const existingAnalysis = await app_1.prisma.fScoreAnalysis.findFirst({
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
            const savedAnalysis = await app_1.prisma.fScoreAnalysis.upsert({
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
        }
        catch (error) {
            console.error('Error processing F-Score analysis:', error);
            throw error;
        }
    }
    /**
     * Get F-Score data for a symbol from Excel files
     * @param symbol Stock symbol
     */
    async getFScoreData(symbol) {
        try {
            // Load data from all Excel files
            const fscoreData = this.readExcelFile(path_1.default.join(DATA_FSCORE_DIR, 'F_SCORE.xlsx'), symbol);
            const zscoreData = this.readExcelFile(path_1.default.join(DATA_FSCORE_DIR, 'Z_SCORE.xlsx'), symbol);
            const data2023 = this.readExcelFile(path_1.default.join(DATA_FSCORE_DIR, 'data_2023.xlsx'), symbol);
            const data2024 = this.readExcelFile(path_1.default.join(DATA_FSCORE_DIR, 'data_2024.xlsx'), symbol);
            const balanceSheet = this.readExcelFile(path_1.default.join(DATA_FSCORE_DIR, 'BalanceSheet_Q1.2025.xlsx'), symbol);
            const incomeStatement = this.readExcelFile(path_1.default.join(DATA_FSCORE_DIR, 'INCOME_Q1.2025.xlsx'), symbol);
            const cashFlow = this.readExcelFile(path_1.default.join(DATA_FSCORE_DIR, 'CASHFLOW_Q1.2025.xlsx'), symbol);
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
        }
        catch (error) {
            console.error(`Error getting F-Score data for ${symbol}:`, error);
            return null;
        }
    }
    /**
     * Read Excel file and find data for a specific symbol
     * @param filePath Path to the Excel file
     * @param symbol Stock symbol to search for
     */
    readExcelFile(filePath, symbol) {
        try {
            if (!fs_1.default.existsSync(filePath)) {
                console.error(`File not found: ${filePath}`);
                return null;
            }
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            // Find the row with the matching symbol
            const symbolData = data.find((row) => row.Symbol === symbol ||
                row.symbol === symbol ||
                row.SYMBOL === symbol ||
                row.Mã === symbol ||
                row.mã === symbol ||
                row.MA === symbol ||
                row.ma === symbol);
            return symbolData || null;
        }
        catch (error) {
            console.error(`Error reading Excel file ${filePath}:`, error);
            return null;
        }
    }
    /**
     * Send data to ChatGPT and get analysis
     * @param data Formatted data for analysis
     */
    async getAnalysisFromChatGPT(data) {
        try {
            if (!this.apiKey) {
                throw new Error('OpenAI API key is not set');
            }
            const response = await axios_1.default.post(OPENAI_API_URL, {
                model: MODEL,
                messages: [
                    { role: 'system', content: this.promptTemplate },
                    { role: 'user', content: JSON.stringify(data, null, 2) }
                ],
                temperature: 0.2,
                max_tokens: 2500,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            return response.data.choices[0].message.content;
        }
        catch (error) {
            console.error('Error calling ChatGPT API:', error);
            throw error;
        }
    }
    /**
     * Extract structured data from ChatGPT analysis text
     * @param analysisText The analysis text from ChatGPT
     */
    extractStructuredDataFromAnalysis(analysisText) {
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
    async batchProcessFScoreAnalyses(symbols) {
        const results = [];
        const errors = [];
        // Process each symbol sequentially to avoid rate limiting
        for (const symbol of symbols) {
            try {
                const analysis = await this.processFScoreAnalysis(symbol);
                results.push(analysis);
            }
            catch (error) {
                errors.push({
                    symbol,
                    error: error.message
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
exports.FScoreService = FScoreService;
exports.default = new FScoreService();
