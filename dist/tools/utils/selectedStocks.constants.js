"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SELECTED_STOCKS_MESSAGES = void 0;
exports.SELECTED_STOCKS_MESSAGES = {
    // Success messages
    GET_SELECTED_STOCKS_SUCCESS: 'Selected stocks retrieved successfully',
    GET_SELECTED_STOCK_SUCCESS: 'Selected stock retrieved successfully',
    CREATE_SELECTED_STOCK_SUCCESS: 'Selected stock created successfully',
    UPDATE_SELECTED_STOCK_SUCCESS: 'Selected stock updated successfully',
    DELETE_SELECTED_STOCK_SUCCESS: 'Selected stock deleted successfully',
    // Error messages
    GET_SELECTED_STOCKS_ERROR: 'Failed to retrieve selected stocks',
    GET_SELECTED_STOCK_ERROR: 'Failed to retrieve selected stock',
    CREATE_SELECTED_STOCK_ERROR: 'Failed to create selected stock',
    UPDATE_SELECTED_STOCK_ERROR: 'Failed to update selected stock',
    DELETE_SELECTED_STOCK_ERROR: 'Failed to delete selected stock',
    // Validation messages
    SELECTED_STOCK_NOT_FOUND: 'Selected stock not found',
    SELECTED_STOCK_ALREADY_EXISTS: 'Selected stock already exists for this symbol and date',
    REQUIRED_FIELDS: 'Symbol and date are required',
    INVALID_DATE_FORMAT: 'Invalid date format',
};
