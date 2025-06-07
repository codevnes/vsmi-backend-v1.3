"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchProcessChatGptAnalyses = exports.deleteChatGptAnalysis = exports.processChatGptAnalysis = exports.getLatestChatGptAnalysisBySymbol = exports.getChatGptAnalysisBySymbolAndDate = exports.getChatGptAnalyses = void 0;
const app_1 = require("../app");
const services_1 = require("../services");
/**
 * Get all ChatGPT analyses with pagination
 */
const getChatGptAnalyses = async (req, res) => {
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
            app_1.prisma.chatGptAnalysis.findMany({
                where,
                orderBy: {
                    analysisDate: 'desc'
                },
                skip,
                take: parsedLimit
            }),
            app_1.prisma.chatGptAnalysis.count({
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
        console.error('Error getting ChatGPT analyses:', error);
        return res.status(500).json({
            message: 'Lỗi khi truy vấn phân tích ChatGPT',
            error: error.message
        });
    }
};
exports.getChatGptAnalyses = getChatGptAnalyses;
/**
 * Get a specific ChatGPT analysis by symbol and date
 */
const getChatGptAnalysisBySymbolAndDate = async (req, res) => {
    try {
        const { symbol, date } = req.params;
        const analysis = await app_1.prisma.chatGptAnalysis.findUnique({
            where: {
                symbol_analysisDate: {
                    symbol,
                    analysisDate: new Date(date)
                }
            }
        });
        if (!analysis) {
            return res.status(404).json({
                message: `Không tìm thấy phân tích ChatGPT cho mã ${symbol} vào ngày ${date}`
            });
        }
        return res.status(200).json(analysis);
    }
    catch (error) {
        console.error('Error getting ChatGPT analysis by symbol and date:', error);
        return res.status(500).json({
            message: 'Lỗi khi truy vấn phân tích ChatGPT',
            error: error.message
        });
    }
};
exports.getChatGptAnalysisBySymbolAndDate = getChatGptAnalysisBySymbolAndDate;
/**
 * Get latest ChatGPT analysis for a symbol
 */
const getLatestChatGptAnalysisBySymbol = async (req, res) => {
    try {
        const { symbol } = req.params;
        const analysis = await app_1.prisma.chatGptAnalysis.findFirst({
            where: {
                symbol
            },
            orderBy: {
                analysisDate: 'desc'
            }
        });
        if (!analysis) {
            return res.status(404).json({
                message: `Không tìm thấy phân tích ChatGPT mới nhất cho mã ${symbol}`
            });
        }
        return res.status(200).json(analysis);
    }
    catch (error) {
        console.error('Error getting latest ChatGPT analysis for symbol:', error);
        return res.status(500).json({
            message: 'Lỗi khi truy vấn phân tích ChatGPT mới nhất',
            error: error.message
        });
    }
};
exports.getLatestChatGptAnalysisBySymbol = getLatestChatGptAnalysisBySymbol;
/**
 * Process and create a new ChatGPT analysis
 */
const processChatGptAnalysis = async (req, res) => {
    try {
        const { symbol, date } = req.body;
        if (!symbol || !date) {
            return res.status(400).json({
                message: 'Thiếu thông tin cần thiết: symbol và date là bắt buộc'
            });
        }
        const analysis = await services_1.openAIService.processTechnicalRecommendation(symbol, date);
        return res.status(201).json({
            message: 'Phân tích ChatGPT được tạo thành công',
            data: analysis
        });
    }
    catch (error) {
        console.error('Error processing ChatGPT analysis:', error);
        return res.status(500).json({
            message: 'Lỗi khi xử lý phân tích ChatGPT',
            error: error.message
        });
    }
};
exports.processChatGptAnalysis = processChatGptAnalysis;
/**
 * Delete a ChatGPT analysis
 */
const deleteChatGptAnalysis = async (req, res) => {
    try {
        const { symbol, date } = req.params;
        await app_1.prisma.chatGptAnalysis.delete({
            where: {
                symbol_analysisDate: {
                    symbol,
                    analysisDate: new Date(date)
                }
            }
        });
        return res.status(200).json({
            message: 'Phân tích ChatGPT đã được xóa thành công'
        });
    }
    catch (error) {
        console.error('Error deleting ChatGPT analysis:', error);
        return res.status(500).json({
            message: 'Lỗi khi xóa phân tích ChatGPT',
            error: error.message
        });
    }
};
exports.deleteChatGptAnalysis = deleteChatGptAnalysis;
/**
 * Batch process multiple ChatGPT analyses
 */
const batchProcessChatGptAnalyses = async (req, res) => {
    try {
        const { items } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: 'Thiếu thông tin cần thiết: items phải là một mảng không rỗng'
            });
        }
        const results = [];
        const errors = [];
        // Process each item sequentially to avoid rate limiting
        for (const item of items) {
            try {
                const { symbol, date } = item;
                if (!symbol || !date) {
                    errors.push({
                        symbol,
                        date,
                        error: 'Thiếu thông tin cần thiết: symbol và date là bắt buộc'
                    });
                    continue;
                }
                const analysis = await services_1.openAIService.processTechnicalRecommendation(symbol, date);
                results.push(analysis);
            }
            catch (error) {
                errors.push({
                    ...item,
                    error: error.message
                });
            }
        }
        return res.status(200).json({
            message: 'Quá trình xử lý hàng loạt hoàn tất',
            results,
            errors,
            success: results.length,
            failed: errors.length
        });
    }
    catch (error) {
        console.error('Error batch processing ChatGPT analyses:', error);
        return res.status(500).json({
            message: 'Lỗi khi xử lý hàng loạt phân tích ChatGPT',
            error: error.message
        });
    }
};
exports.batchProcessChatGptAnalyses = batchProcessChatGptAnalyses;
