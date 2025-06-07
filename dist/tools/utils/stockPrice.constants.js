"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STOCK_PRICE_MESSAGES = void 0;
exports.STOCK_PRICE_MESSAGES = {
    // Success messages
    GET_STOCK_PRICES_SUCCESS: 'Stock prices retrieved successfully',
    GET_STOCK_PRICE_SUCCESS: 'Stock price retrieved successfully',
    CREATE_STOCK_PRICE_SUCCESS: 'Stock price created successfully',
    UPDATE_STOCK_PRICE_SUCCESS: 'Stock price updated successfully',
    DELETE_STOCK_PRICE_SUCCESS: 'Stock price deleted successfully',
    BULK_CREATE_SUCCESS: 'Stock price data processed successfully',
    // Error messages
    GET_STOCK_PRICES_ERROR: 'Failed to retrieve stock prices',
    GET_STOCK_PRICE_ERROR: 'Failed to retrieve stock price',
    CREATE_STOCK_PRICE_ERROR: 'Failed to create stock price',
    UPDATE_STOCK_PRICE_ERROR: 'Failed to update stock price',
    DELETE_STOCK_PRICE_ERROR: 'Failed to delete stock price',
    BULK_CREATE_ERROR: 'Failed to process stock price data',
    STOCK_PRICE_NOT_FOUND: 'Stock price not found for the specified date',
    STOCK_PRICE_ALREADY_EXISTS: 'Stock price for this date already exists',
    REQUIRED_FIELDS: 'Required fields missing',
    INVALID_DATA: 'Invalid stock price data'
};
