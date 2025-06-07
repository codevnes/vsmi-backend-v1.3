"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertStockProfile = exports.deleteStockProfile = exports.updateStockProfile = exports.createStockProfile = exports.getStockProfileBySymbol = exports.getAllStockProfiles = void 0;
const services_1 = require("../services");
const stockProfile_constants_1 = require("../utils/stockProfile.constants");
/**
 * Get all stock profiles with pagination and filtering options
 */
const getAllStockProfiles = async (req, res) => {
    try {
        const { page = '1', limit = '10', search } = req.query;
        const result = await services_1.stockProfileService.getStockProfiles({
            page: parseInt(page),
            limit: parseInt(limit),
            search: search,
        });
        return res.status(200).json({
            message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.GET_PROFILES_SUCCESS,
            ...result
        });
    }
    catch (error) {
        console.error('Error fetching stock profiles:', error);
        return res.status(500).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.GET_PROFILES_ERROR });
    }
};
exports.getAllStockProfiles = getAllStockProfiles;
/**
 * Get stock profile by symbol
 */
const getStockProfileBySymbol = async (req, res) => {
    try {
        const { symbol } = req.params;
        const profile = await services_1.stockProfileService.getStockProfileBySymbol(symbol);
        if (!profile) {
            return res.status(404).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.PROFILE_NOT_FOUND });
        }
        return res.status(200).json({
            message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.GET_PROFILE_SUCCESS,
            data: profile,
        });
    }
    catch (error) {
        console.error('Error fetching stock profile:', error);
        return res.status(500).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.GET_PROFILE_ERROR });
    }
};
exports.getStockProfileBySymbol = getStockProfileBySymbol;
/**
 * Create a new stock profile
 */
const createStockProfile = async (req, res) => {
    try {
        const { symbol, price, profit, volume, pe, eps, roa, roe } = req.body;
        if (!symbol) {
            return res.status(400).json({ message: 'Symbol is required' });
        }
        const profile = await services_1.stockProfileService.createStockProfile({
            symbol,
            price,
            profit,
            volume,
            pe,
            eps,
            roa,
            roe,
        });
        return res.status(201).json({
            message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.CREATE_PROFILE_SUCCESS,
            data: profile,
        });
    }
    catch (error) {
        console.error('Error creating stock profile:', error);
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.STOCK_NOT_FOUND });
        }
        if (error.message.includes('already exists')) {
            return res.status(409).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.PROFILE_ALREADY_EXISTS });
        }
        return res.status(500).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.CREATE_PROFILE_ERROR });
    }
};
exports.createStockProfile = createStockProfile;
/**
 * Update existing stock profile
 */
const updateStockProfile = async (req, res) => {
    try {
        const { symbol } = req.params;
        const { price, profit, volume, pe, eps, roa, roe } = req.body;
        const profile = await services_1.stockProfileService.updateStockProfile(symbol, {
            price,
            profit,
            volume,
            pe,
            eps,
            roa,
            roe,
        });
        return res.status(200).json({
            message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.UPDATE_PROFILE_SUCCESS,
            data: profile,
        });
    }
    catch (error) {
        console.error('Error updating stock profile:', error);
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.PROFILE_NOT_FOUND });
        }
        return res.status(500).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.UPDATE_PROFILE_ERROR });
    }
};
exports.updateStockProfile = updateStockProfile;
/**
 * Delete a stock profile
 */
const deleteStockProfile = async (req, res) => {
    try {
        const { symbol } = req.params;
        await services_1.stockProfileService.deleteStockProfile(symbol);
        return res.status(200).json({
            message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.DELETE_PROFILE_SUCCESS,
        });
    }
    catch (error) {
        console.error('Error deleting stock profile:', error);
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.PROFILE_NOT_FOUND });
        }
        return res.status(500).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.DELETE_PROFILE_ERROR });
    }
};
exports.deleteStockProfile = deleteStockProfile;
/**
 * Upsert stock profile (create if not exists, update if exists)
 */
const upsertStockProfile = async (req, res) => {
    try {
        const { symbol, price, profit, volume, pe, eps, roa, roe } = req.body;
        if (!symbol) {
            return res.status(400).json({ message: 'Symbol is required' });
        }
        const profile = await services_1.stockProfileService.upsertStockProfile({
            symbol,
            price,
            profit,
            volume,
            pe,
            eps,
            roa,
            roe,
        });
        return res.status(200).json({
            message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.UPSERT_PROFILE_SUCCESS,
            data: profile,
        });
    }
    catch (error) {
        console.error('Error upserting stock profile:', error);
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.STOCK_NOT_FOUND });
        }
        return res.status(500).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.UPSERT_PROFILE_ERROR });
    }
};
exports.upsertStockProfile = upsertStockProfile;
