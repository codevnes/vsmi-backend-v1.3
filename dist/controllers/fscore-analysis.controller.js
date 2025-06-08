"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFScoreAnalyses = exports.batchProcessFScoreAnalyses = exports.getFScoreAnalysis = void 0;
const app_1 = require("../app");
const fscore_service_1 = __importDefault(require("../services/fscore.service"));
/**
 * Get F-Score analysis for a specific symbol
 */
const getFScoreAnalysis = async (req, res) => {
    try {
        const { symbol } = req.params;
        if (!symbol) {
            return res.status(400).json({
                message: 'Symbol parameter is required'
            });
        }
        // Check if an analysis already exists for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existingAnalysis = await app_1.prisma.fScoreAnalysis.findFirst({
            where: {
                symbol,
                analysisDate: {
                    gte: today
                }
            },
            orderBy: {
                analysisDate: 'desc'
            }
        });
        // If analysis exists, return it
        if (existingAnalysis) {
            return res.status(200).json(existingAnalysis);
        }
        // Otherwise, process a new analysis
        const analysis = await fscore_service_1.default.processFScoreAnalysis(symbol);
        return res.status(200).json(analysis);
    }
    catch (error) {
        console.error('Error getting F-Score analysis:', error);
        return res.status(500).json({
            message: 'Error getting F-Score analysis',
            error: error.message
        });
    }
};
exports.getFScoreAnalysis = getFScoreAnalysis;
/**
 * Batch process F-Score analyses for multiple symbols
 */
const batchProcessFScoreAnalyses = async (req, res) => {
    try {
        const { symbols } = req.body;
        if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
            return res.status(400).json({
                message: 'Symbols array is required and cannot be empty'
            });
        }
        const result = await fscore_service_1.default.batchProcessFScoreAnalyses(symbols);
        return res.status(200).json({
            message: 'Batch processing completed',
            ...result
        });
    }
    catch (error) {
        console.error('Error batch processing F-Score analyses:', error);
        return res.status(500).json({
            message: 'Error batch processing F-Score analyses',
            error: error.message
        });
    }
};
exports.batchProcessFScoreAnalyses = batchProcessFScoreAnalyses;
/**
 * Get all F-Score analyses with pagination
 */
const getAllFScoreAnalyses = async (req, res) => {
    try {
        const { page = '1', limit = '10', symbol, fromDate, toDate } = req.query;
        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);
        const skip = (parsedPage - 1) * parsedLimit;
        // Build filter conditions
        const where = {};
        if (symbol) {
            where.symbol = symbol;
        }
        if (fromDate && toDate) {
            where.analysisDate = {
                gte: new Date(fromDate),
                lte: new Date(toDate)
            };
        }
        else if (fromDate) {
            where.analysisDate = {
                gte: new Date(fromDate)
            };
        }
        else if (toDate) {
            where.analysisDate = {
                lte: new Date(toDate)
            };
        }
        // Query with pagination and filtering
        const [analyses, total] = await Promise.all([
            app_1.prisma.fScoreAnalysis.findMany({
                where,
                orderBy: {
                    analysisDate: 'desc'
                },
                skip,
                take: parsedLimit
            }),
            app_1.prisma.fScoreAnalysis.count({
                where
            })
        ]);
        const totalPages = Math.ceil(total / parsedLimit);
        return res.status(200).json({
            data: analyses,
            meta: {
                total,
                page: parsedPage,
                limit: parsedLimit,
                totalPages
            }
        });
    }
    catch (error) {
        console.error('Error getting F-Score analyses:', error);
        return res.status(500).json({
            message: 'Error getting F-Score analyses',
            error: error.message
        });
    }
};
exports.getAllFScoreAnalyses = getAllFScoreAnalyses;
