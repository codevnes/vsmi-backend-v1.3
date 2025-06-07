"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTechnicalAnalysis = exports.upsertTechnicalAnalysis = exports.updateTechnicalAnalysis = exports.createTechnicalAnalysis = exports.getTechnicalAnalysisBySymbol = exports.getTechnicalAnalyses = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
/**
 * Get all technical analyses with pagination
 */
const getTechnicalAnalyses = async (req, res) => {
    try {
        const { page = '1', limit = '10', search } = req.query;
        const result = await services_1.technicalAnalysisService.getAll({
            page: parseInt(page),
            limit: parseInt(limit),
            search: search,
        });
        return res.status(200).json({
            message: utils_1.TECHNICAL_ANALYSIS_MESSAGES.GET_ANALYSES_SUCCESS,
            ...result
        });
    }
    catch (error) {
        console.error('Error fetching technical analyses:', error);
        return res.status(500).json({
            message: utils_1.TECHNICAL_ANALYSIS_MESSAGES.GET_ANALYSES_ERROR
        });
    }
};
exports.getTechnicalAnalyses = getTechnicalAnalyses;
/**
 * Get technical analysis by symbol
 */
const getTechnicalAnalysisBySymbol = async (req, res) => {
    try {
        const { symbol } = req.params;
        const technicalAnalysis = await services_1.technicalAnalysisService.getBySymbol(symbol);
        if (!technicalAnalysis) {
            return res.status(404).json({
                message: utils_1.TECHNICAL_ANALYSIS_MESSAGES.ANALYSIS_NOT_FOUND_FOR_SYMBOL
            });
        }
        return res.status(200).json({
            message: utils_1.TECHNICAL_ANALYSIS_MESSAGES.GET_ANALYSIS_SUCCESS,
            data: technicalAnalysis,
        });
    }
    catch (error) {
        console.error('Error fetching technical analysis:', error);
        return res.status(500).json({
            message: utils_1.TECHNICAL_ANALYSIS_MESSAGES.GET_ANALYSIS_ERROR
        });
    }
};
exports.getTechnicalAnalysisBySymbol = getTechnicalAnalysisBySymbol;
/**
 * Create a new technical analysis
 */
const createTechnicalAnalysis = async (req, res) => {
    try {
        const data = req.body;
        if (!data.symbol) {
            return res.status(400).json({
                message: utils_1.TECHNICAL_ANALYSIS_MESSAGES.SYMBOL_REQUIRED
            });
        }
        // Check if analysis already exists for this symbol
        const existing = await services_1.technicalAnalysisService.getBySymbol(data.symbol);
        if (existing) {
            return res.status(409).json({
                message: utils_1.TECHNICAL_ANALYSIS_MESSAGES.ANALYSIS_ALREADY_EXISTS
            });
        }
        const technicalAnalysis = await services_1.technicalAnalysisService.create(data);
        return res.status(201).json({
            message: utils_1.TECHNICAL_ANALYSIS_MESSAGES.CREATE_ANALYSIS_SUCCESS,
            data: technicalAnalysis,
        });
    }
    catch (error) {
        console.error('Error creating technical analysis:', error);
        return res.status(500).json({
            message: utils_1.TECHNICAL_ANALYSIS_MESSAGES.CREATE_ANALYSIS_ERROR
        });
    }
};
exports.createTechnicalAnalysis = createTechnicalAnalysis;
/**
 * Update an existing technical analysis
 */
const updateTechnicalAnalysis = async (req, res) => {
    try {
        const { symbol } = req.params;
        const data = req.body;
        // Check if analysis exists
        const existing = await services_1.technicalAnalysisService.getBySymbol(symbol);
        if (!existing) {
            return res.status(404).json({
                message: utils_1.TECHNICAL_ANALYSIS_MESSAGES.ANALYSIS_NOT_FOUND_FOR_SYMBOL
            });
        }
        const technicalAnalysis = await services_1.technicalAnalysisService.update(symbol, data);
        return res.status(200).json({
            message: utils_1.TECHNICAL_ANALYSIS_MESSAGES.UPDATE_ANALYSIS_SUCCESS,
            data: technicalAnalysis,
        });
    }
    catch (error) {
        console.error('Error updating technical analysis:', error);
        return res.status(500).json({
            message: utils_1.TECHNICAL_ANALYSIS_MESSAGES.UPDATE_ANALYSIS_ERROR
        });
    }
};
exports.updateTechnicalAnalysis = updateTechnicalAnalysis;
/**
 * Upsert technical analysis (create if not exists, update if exists)
 */
const upsertTechnicalAnalysis = async (req, res) => {
    try {
        const { symbol } = req.params;
        const data = req.body;
        const technicalAnalysis = await services_1.technicalAnalysisService.upsert(symbol, data);
        return res.status(200).json({
            message: utils_1.TECHNICAL_ANALYSIS_MESSAGES.UPSERT_ANALYSIS_SUCCESS,
            data: technicalAnalysis,
        });
    }
    catch (error) {
        console.error('Error upserting technical analysis:', error);
        return res.status(500).json({
            message: utils_1.TECHNICAL_ANALYSIS_MESSAGES.UPSERT_ANALYSIS_ERROR
        });
    }
};
exports.upsertTechnicalAnalysis = upsertTechnicalAnalysis;
/**
 * Delete a technical analysis
 */
const deleteTechnicalAnalysis = async (req, res) => {
    try {
        const { symbol } = req.params;
        // Check if analysis exists
        const existing = await services_1.technicalAnalysisService.getBySymbol(symbol);
        if (!existing) {
            return res.status(404).json({
                message: utils_1.TECHNICAL_ANALYSIS_MESSAGES.ANALYSIS_NOT_FOUND_FOR_SYMBOL
            });
        }
        await services_1.technicalAnalysisService.delete(symbol);
        return res.status(200).json({
            message: utils_1.TECHNICAL_ANALYSIS_MESSAGES.DELETE_ANALYSIS_SUCCESS
        });
    }
    catch (error) {
        console.error('Error deleting technical analysis:', error);
        return res.status(500).json({
            message: utils_1.TECHNICAL_ANALYSIS_MESSAGES.DELETE_ANALYSIS_ERROR
        });
    }
};
exports.deleteTechnicalAnalysis = deleteTechnicalAnalysis;
