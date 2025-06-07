"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FINANCIAL_METRICS_MESSAGES = void 0;
exports.FINANCIAL_METRICS_MESSAGES = {
    // Success Messages
    GET_METRICS_SUCCESS: 'Financial metrics retrieved successfully',
    GET_METRICS_BY_ID_SUCCESS: 'Financial metrics retrieved successfully',
    CREATE_METRICS_SUCCESS: 'Financial metrics created successfully',
    UPDATE_METRICS_SUCCESS: 'Financial metrics updated successfully',
    DELETE_METRICS_SUCCESS: 'Financial metrics deleted successfully',
    BULK_CREATE_SUCCESS: 'Financial metrics bulk created successfully',
    // Error Messages
    GET_METRICS_ERROR: 'Error retrieving financial metrics',
    GET_METRICS_BY_ID_ERROR: 'Error retrieving financial metrics',
    CREATE_METRICS_ERROR: 'Error creating financial metrics',
    UPDATE_METRICS_ERROR: 'Error updating financial metrics',
    DELETE_METRICS_ERROR: 'Error deleting financial metrics',
    BULK_CREATE_ERROR: 'Error bulk creating financial metrics',
    // Validation Messages
    METRICS_NOT_FOUND: 'Financial metrics not found',
    METRICS_ALREADY_EXISTS: 'Financial metrics already exist for this symbol, year, and quarter',
    STOCK_NOT_FOUND: 'Stock not found',
    REQUIRED_FIELDS: 'Symbol and year are required',
    INVALID_DATA: 'Invalid financial metrics data provided',
};
