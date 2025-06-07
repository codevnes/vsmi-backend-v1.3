"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTechnicalRecommendation = exports.upsertTechnicalRecommendation = exports.updateTechnicalRecommendation = exports.createTechnicalRecommendation = exports.getLatestTechnicalRecommendationBySymbol = exports.getTechnicalRecommendationBySymbolAndDate = exports.getTechnicalRecommendations = void 0;
const services_1 = require("../services");
const technicalRecommendation_constants_1 = require("../utils/technicalRecommendation.constants");
/**
 * Get all technical recommendations with pagination
 */
const getTechnicalRecommendations = async (req, res) => {
    try {
        const { page = '1', limit = '10', symbol, startDate, endDate } = req.query;
        const result = await services_1.technicalRecommendationService.getAll({
            page: parseInt(page),
            limit: parseInt(limit),
            symbol: symbol,
            startDate: startDate,
            endDate: endDate,
        });
        return res.status(200).json({
            message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.GET_RECOMMENDATIONS_SUCCESS,
            ...result
        });
    }
    catch (error) {
        console.error('Error fetching technical recommendations:', error);
        return res.status(500).json({
            message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.GET_RECOMMENDATIONS_ERROR
        });
    }
};
exports.getTechnicalRecommendations = getTechnicalRecommendations;
/**
 * Get technical recommendation by symbol and date
 */
const getTechnicalRecommendationBySymbolAndDate = async (req, res) => {
    try {
        const { symbol, date } = req.params;
        if (!symbol) {
            return res.status(400).json({
                message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.SYMBOL_REQUIRED
            });
        }
        if (!date) {
            return res.status(400).json({
                message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.DATE_REQUIRED
            });
        }
        const recommendation = await services_1.technicalRecommendationService.getBySymbolAndDate(symbol, date);
        if (!recommendation) {
            return res.status(404).json({
                message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.RECOMMENDATION_NOT_FOUND_FOR_SYMBOL_AND_DATE
            });
        }
        return res.status(200).json({
            message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.GET_RECOMMENDATION_SUCCESS,
            data: recommendation,
        });
    }
    catch (error) {
        console.error('Error fetching technical recommendation:', error);
        return res.status(500).json({
            message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.GET_RECOMMENDATION_ERROR
        });
    }
};
exports.getTechnicalRecommendationBySymbolAndDate = getTechnicalRecommendationBySymbolAndDate;
/**
 * Get latest technical recommendation by symbol
 */
const getLatestTechnicalRecommendationBySymbol = async (req, res) => {
    try {
        const { symbol } = req.params;
        if (!symbol) {
            return res.status(400).json({
                message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.SYMBOL_REQUIRED
            });
        }
        const recommendation = await services_1.technicalRecommendationService.getLatestBySymbol(symbol);
        if (!recommendation) {
            return res.status(404).json({
                message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.RECOMMENDATION_NOT_FOUND_FOR_SYMBOL_AND_DATE
            });
        }
        return res.status(200).json({
            message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.GET_RECOMMENDATION_SUCCESS,
            data: recommendation,
        });
    }
    catch (error) {
        console.error('Error fetching latest technical recommendation:', error);
        return res.status(500).json({
            message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.GET_RECOMMENDATION_ERROR
        });
    }
};
exports.getLatestTechnicalRecommendationBySymbol = getLatestTechnicalRecommendationBySymbol;
/**
 * Create a new technical recommendation
 */
const createTechnicalRecommendation = async (req, res) => {
    try {
        const data = req.body;
        if (!data.symbol) {
            return res.status(400).json({
                message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.SYMBOL_REQUIRED
            });
        }
        if (!data.date) {
            return res.status(400).json({
                message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.DATE_REQUIRED
            });
        }
        // Check if recommendation already exists for this symbol and date
        const existing = await services_1.technicalRecommendationService.getBySymbolAndDate(data.symbol, data.date);
        if (existing) {
            return res.status(409).json({
                message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.RECOMMENDATION_ALREADY_EXISTS
            });
        }
        const recommendation = await services_1.technicalRecommendationService.create(data);
        return res.status(201).json({
            message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.CREATE_RECOMMENDATION_SUCCESS,
            data: recommendation,
        });
    }
    catch (error) {
        console.error('Error creating technical recommendation:', error);
        return res.status(500).json({
            message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.CREATE_RECOMMENDATION_ERROR
        });
    }
};
exports.createTechnicalRecommendation = createTechnicalRecommendation;
/**
 * Update an existing technical recommendation
 */
const updateTechnicalRecommendation = async (req, res) => {
    try {
        const { symbol, date } = req.params;
        const data = req.body;
        if (!symbol) {
            return res.status(400).json({
                message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.SYMBOL_REQUIRED
            });
        }
        if (!date) {
            return res.status(400).json({
                message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.DATE_REQUIRED
            });
        }
        // Check if recommendation exists
        const existing = await services_1.technicalRecommendationService.getBySymbolAndDate(symbol, date);
        if (!existing) {
            return res.status(404).json({
                message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.RECOMMENDATION_NOT_FOUND_FOR_SYMBOL_AND_DATE
            });
        }
        const recommendation = await services_1.technicalRecommendationService.update(symbol, date, data);
        return res.status(200).json({
            message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.UPDATE_RECOMMENDATION_SUCCESS,
            data: recommendation,
        });
    }
    catch (error) {
        console.error('Error updating technical recommendation:', error);
        return res.status(500).json({
            message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.UPDATE_RECOMMENDATION_ERROR
        });
    }
};
exports.updateTechnicalRecommendation = updateTechnicalRecommendation;
/**
 * Upsert technical recommendation (create if not exists, update if exists)
 */
const upsertTechnicalRecommendation = async (req, res) => {
    try {
        const { symbol, date } = req.params;
        const data = req.body;
        if (!symbol) {
            return res.status(400).json({
                message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.SYMBOL_REQUIRED
            });
        }
        if (!date) {
            return res.status(400).json({
                message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.DATE_REQUIRED
            });
        }
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({
                message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.INVALID_DATE_FORMAT
            });
        }
        const recommendation = await services_1.technicalRecommendationService.upsert(symbol, dateObj, data);
        return res.status(200).json({
            message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.UPSERT_RECOMMENDATION_SUCCESS,
            data: recommendation,
        });
    }
    catch (error) {
        console.error('Error upserting technical recommendation:', error);
        return res.status(500).json({
            message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.UPSERT_RECOMMENDATION_ERROR
        });
    }
};
exports.upsertTechnicalRecommendation = upsertTechnicalRecommendation;
/**
 * Delete a technical recommendation
 */
const deleteTechnicalRecommendation = async (req, res) => {
    try {
        const { symbol, date } = req.params;
        if (!symbol) {
            return res.status(400).json({
                message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.SYMBOL_REQUIRED
            });
        }
        if (!date) {
            return res.status(400).json({
                message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.DATE_REQUIRED
            });
        }
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({
                message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.INVALID_DATE_FORMAT
            });
        }
        // Check if recommendation exists
        const existing = await services_1.technicalRecommendationService.getBySymbolAndDate(symbol, date);
        if (!existing) {
            return res.status(404).json({
                message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.RECOMMENDATION_NOT_FOUND_FOR_SYMBOL_AND_DATE
            });
        }
        await services_1.technicalRecommendationService.delete(symbol, dateObj);
        return res.status(200).json({
            message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.DELETE_RECOMMENDATION_SUCCESS
        });
    }
    catch (error) {
        console.error('Error deleting technical recommendation:', error);
        return res.status(500).json({
            message: technicalRecommendation_constants_1.TECHNICAL_RECOMMENDATION_MESSAGES.DELETE_RECOMMENDATION_ERROR
        });
    }
};
exports.deleteTechnicalRecommendation = deleteTechnicalRecommendation;
