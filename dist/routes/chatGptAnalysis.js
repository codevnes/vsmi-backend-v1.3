"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatGptAnalysis_controller_1 = require("../controllers/chatGptAnalysis.controller");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
// Public routes
router.get('/', chatGptAnalysis_controller_1.getChatGptAnalyses);
router.get('/:symbol', chatGptAnalysis_controller_1.getLatestChatGptAnalysisBySymbol);
router.get('/:symbol/:date', chatGptAnalysis_controller_1.getChatGptAnalysisBySymbolAndDate);
// Protected routes - Admin only
router.post('/', middlewares_1.verifyToken, middlewares_1.isAdmin, chatGptAnalysis_controller_1.processChatGptAnalysis);
router.post('/batch', middlewares_1.verifyToken, middlewares_1.isAdmin, chatGptAnalysis_controller_1.batchProcessChatGptAnalyses);
router.delete('/:symbol/:date', middlewares_1.verifyToken, middlewares_1.isAdmin, chatGptAnalysis_controller_1.deleteChatGptAnalysis);
exports.default = router;
