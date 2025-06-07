"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkCreateFinancialMetrics = exports.deleteFinancialMetrics = exports.updateFinancialMetrics = exports.createFinancialMetrics = exports.getFinancialMetricsBySymbolYearQuarter = exports.getFinancialMetricsBySymbol = exports.getFinancialMetricsById = exports.getFinancialMetrics = void 0;
const services_1 = require("../services");
const financialMetrics_constants_1 = require("../utils/financialMetrics.constants");
const helpers_1 = require("../utils/helpers");
/**
 * Get financial metrics with pagination
 */
const getFinancialMetrics = async (req, res) => {
    try {
        const { page = '1', limit = '20', symbol, year, quarter } = req.query;
        const result = await services_1.financialMetricsService.getFinancialMetricsList({
            symbol: symbol,
            year: year ? parseInt(year) : undefined,
            quarter: quarter ? parseInt(quarter) : undefined,
            page: parseInt(page),
            limit: parseInt(limit),
        });
        return res.status(200).json({
            message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.GET_METRICS_SUCCESS,
            ...(0, helpers_1.bigIntSerializer)(result)
        });
    }
    catch (error) {
        console.error('Error fetching financial metrics:', error);
        return res.status(500).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.GET_METRICS_ERROR });
    }
};
exports.getFinancialMetrics = getFinancialMetrics;
/**
 * Get financial metrics by ID
 */
const getFinancialMetricsById = async (req, res) => {
    try {
        const { id } = req.params;
        const metrics = await services_1.financialMetricsService.getFinancialMetricsById(id);
        if (!metrics) {
            return res.status(404).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.METRICS_NOT_FOUND });
        }
        return res.status(200).json({
            message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.GET_METRICS_BY_ID_SUCCESS,
            metrics: (0, helpers_1.bigIntSerializer)(metrics)
        });
    }
    catch (error) {
        console.error('Error fetching financial metrics by ID:', error);
        return res.status(500).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.GET_METRICS_BY_ID_ERROR });
    }
};
exports.getFinancialMetricsById = getFinancialMetricsById;
/**
 * Get all financial metrics for a given stock symbol
 */
const getFinancialMetricsBySymbol = async (req, res) => {
    try {
        const { symbol } = req.params;
        const metrics = await services_1.financialMetricsService.getFinancialMetricsBySymbol(symbol);
        if (!metrics || metrics.length === 0) {
            return res.status(404).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.METRICS_NOT_FOUND });
        }
        return res.status(200).json({
            message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.GET_METRICS_BY_SYMBOL_SUCCESS,
            data: (0, helpers_1.bigIntSerializer)(metrics)
        });
    }
    catch (error) {
        console.error('Error fetching financial metrics by symbol:', error);
        return res.status(500).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.GET_METRICS_BY_SYMBOL_ERROR });
    }
};
exports.getFinancialMetricsBySymbol = getFinancialMetricsBySymbol;
/**
 * Get financial metrics by symbol, year, and quarter
 */
const getFinancialMetricsBySymbolYearQuarter = async (req, res) => {
    try {
        const { symbol, year, quarter } = req.params;
        const metrics = await services_1.financialMetricsService.getFinancialMetricsBySymbolYearQuarter(symbol, parseInt(year), quarter ? parseInt(quarter) : null);
        if (!metrics) {
            return res.status(404).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.METRICS_NOT_FOUND });
        }
        return res.status(200).json({
            message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.GET_METRICS_BY_ID_SUCCESS,
            metrics: (0, helpers_1.bigIntSerializer)(metrics)
        });
    }
    catch (error) {
        console.error('Error fetching financial metrics by symbol/year/quarter:', error);
        return res.status(500).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.GET_METRICS_BY_ID_ERROR });
    }
};
exports.getFinancialMetricsBySymbolYearQuarter = getFinancialMetricsBySymbolYearQuarter;
/**
 * Create financial metrics
 */
const createFinancialMetrics = async (req, res) => {
    try {
        const { symbol, year, quarter, eps, epsIndustry, pe, peIndustry, roa, roe, roaIndustry, roeIndustry, revenue, margin, totalDebtToEquity, totalAssetsToEquity } = req.body;
        if (!symbol || !year) {
            return res.status(400).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.REQUIRED_FIELDS });
        }
        const metrics = await services_1.financialMetricsService.createFinancialMetrics({
            symbol,
            year: parseInt(year),
            quarter: quarter ? parseInt(quarter) : null,
            eps: eps ? parseFloat(eps) : null,
            epsIndustry: epsIndustry ? parseFloat(epsIndustry) : null,
            pe: pe ? parseFloat(pe) : null,
            peIndustry: peIndustry ? parseFloat(peIndustry) : null,
            roa: roa ? parseFloat(roa) : null,
            roe: roe ? parseFloat(roe) : null,
            roaIndustry: roaIndustry ? parseFloat(roaIndustry) : null,
            roeIndustry: roeIndustry ? parseFloat(roeIndustry) : null,
            revenue: revenue ? parseFloat(revenue) : null,
            margin: margin ? parseFloat(margin) : null,
            totalDebtToEquity: totalDebtToEquity ? parseFloat(totalDebtToEquity) : null,
            totalAssetsToEquity: totalAssetsToEquity ? parseFloat(totalAssetsToEquity) : null,
        });
        return res.status(201).json({
            message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.CREATE_METRICS_SUCCESS,
            metrics: (0, helpers_1.bigIntSerializer)(metrics)
        });
    }
    catch (error) {
        console.error('Error creating financial metrics:', error);
        if (error instanceof Error) {
            if (error.message === 'STOCK_NOT_FOUND') {
                return res.status(404).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.STOCK_NOT_FOUND });
            }
            if (error.message === 'FINANCIAL_METRICS_ALREADY_EXISTS') {
                return res.status(409).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.METRICS_ALREADY_EXISTS });
            }
        }
        return res.status(500).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.CREATE_METRICS_ERROR });
    }
};
exports.createFinancialMetrics = createFinancialMetrics;
/**
 * Update financial metrics
 */
const updateFinancialMetrics = async (req, res) => {
    try {
        const { id } = req.params;
        const { eps, epsIndustry, pe, peIndustry, roa, roe, roaIndustry, roeIndustry, revenue, margin, totalDebtToEquity, totalAssetsToEquity } = req.body;
        const updateData = {};
        if (eps !== undefined)
            updateData.eps = parseFloat(eps);
        if (epsIndustry !== undefined)
            updateData.epsIndustry = parseFloat(epsIndustry);
        if (pe !== undefined)
            updateData.pe = parseFloat(pe);
        if (peIndustry !== undefined)
            updateData.peIndustry = parseFloat(peIndustry);
        if (roa !== undefined)
            updateData.roa = parseFloat(roa);
        if (roe !== undefined)
            updateData.roe = parseFloat(roe);
        if (roaIndustry !== undefined)
            updateData.roaIndustry = parseFloat(roaIndustry);
        if (roeIndustry !== undefined)
            updateData.roeIndustry = parseFloat(roeIndustry);
        if (revenue !== undefined)
            updateData.revenue = parseFloat(revenue);
        if (margin !== undefined)
            updateData.margin = parseFloat(margin);
        if (totalDebtToEquity !== undefined)
            updateData.totalDebtToEquity = parseFloat(totalDebtToEquity);
        if (totalAssetsToEquity !== undefined)
            updateData.totalAssetsToEquity = parseFloat(totalAssetsToEquity);
        const metrics = await services_1.financialMetricsService.updateFinancialMetrics(id, updateData);
        if (!metrics) {
            return res.status(404).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.METRICS_NOT_FOUND });
        }
        return res.status(200).json({
            message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.UPDATE_METRICS_SUCCESS,
            metrics: (0, helpers_1.bigIntSerializer)(metrics)
        });
    }
    catch (error) {
        console.error('Error updating financial metrics:', error);
        return res.status(500).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.UPDATE_METRICS_ERROR });
    }
};
exports.updateFinancialMetrics = updateFinancialMetrics;
/**
 * Delete financial metrics
 */
const deleteFinancialMetrics = async (req, res) => {
    try {
        const { id } = req.params;
        await services_1.financialMetricsService.deleteFinancialMetricsById(id);
        return res.status(200).json({
            message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.DELETE_METRICS_SUCCESS
        });
    }
    catch (error) {
        console.error('Error deleting financial metrics:', error);
        if (error instanceof Error && error.message === 'FINANCIAL_METRICS_NOT_FOUND') {
            return res.status(404).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.METRICS_NOT_FOUND });
        }
        return res.status(500).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.DELETE_METRICS_ERROR });
    }
};
exports.deleteFinancialMetrics = deleteFinancialMetrics;
/**
 * Bulk create financial metrics
 */
const bulkCreateFinancialMetrics = async (req, res) => {
    try {
        const { financialMetrics } = req.body;
        if (!Array.isArray(financialMetrics) || financialMetrics.length === 0) {
            return res.status(400).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.INVALID_DATA });
        }
        // Process and prepare data for bulk creation
        const processedData = financialMetrics.map(item => ({
            symbol: item.symbol,
            year: parseInt(item.year),
            quarter: item.quarter ? parseInt(item.quarter) : null,
            eps: item.eps ? parseFloat(item.eps) : null,
            epsIndustry: item.epsIndustry ? parseFloat(item.epsIndustry) : null,
            pe: item.pe ? parseFloat(item.pe) : null,
            peIndustry: item.peIndustry ? parseFloat(item.peIndustry) : null,
            roa: item.roa ? parseFloat(item.roa) : null,
            roe: item.roe ? parseFloat(item.roe) : null,
            roaIndustry: item.roaIndustry ? parseFloat(item.roaIndustry) : null,
            roeIndustry: item.roeIndustry ? parseFloat(item.roeIndustry) : null,
            revenue: item.revenue ? parseFloat(item.revenue) : null,
            margin: item.margin ? parseFloat(item.margin) : null,
            totalDebtToEquity: item.totalDebtToEquity ? parseFloat(item.totalDebtToEquity) : null,
            totalAssetsToEquity: item.totalAssetsToEquity ? parseFloat(item.totalAssetsToEquity) : null,
        }));
        const count = await services_1.financialMetricsService.bulkCreateFinancialMetrics(processedData);
        return res.status(201).json({
            message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.BULK_CREATE_SUCCESS,
            count: (0, helpers_1.bigIntSerializer)(count)
        });
    }
    catch (error) {
        console.error('Error bulk creating financial metrics:', error);
        return res.status(500).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.BULK_CREATE_ERROR });
    }
};
exports.bulkCreateFinancialMetrics = bulkCreateFinancialMetrics;
