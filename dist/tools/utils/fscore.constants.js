"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FSCORE_MESSAGES = void 0;
exports.FSCORE_MESSAGES = {
    // Success messages
    GET_FSCORES_SUCCESS: 'F-Score data retrieved successfully',
    GET_FSCORE_SUCCESS: 'F-Score data retrieved successfully',
    CREATE_FSCORE_SUCCESS: 'F-Score data created successfully',
    UPDATE_FSCORE_SUCCESS: 'F-Score data updated successfully',
    DELETE_FSCORE_SUCCESS: 'F-Score data deleted successfully',
    UPSERT_FSCORE_SUCCESS: 'F-Score data created or updated successfully',
    // Error messages
    GET_FSCORES_ERROR: 'Failed to retrieve F-Score data',
    GET_FSCORE_ERROR: 'Failed to retrieve F-Score data',
    CREATE_FSCORE_ERROR: 'Failed to create F-Score data',
    UPDATE_FSCORE_ERROR: 'Failed to update F-Score data',
    DELETE_FSCORE_ERROR: 'Failed to delete F-Score data',
    UPSERT_FSCORE_ERROR: 'Failed to create or update F-Score data',
    // Validation messages
    FSCORE_NOT_FOUND: 'F-Score data not found',
    FSCORE_NOT_FOUND_FOR_SYMBOL: 'F-Score data not found for this symbol',
    SYMBOL_REQUIRED: 'Stock symbol is required',
    FSCORE_ALREADY_EXISTS: 'F-Score data already exists for this symbol'
};
