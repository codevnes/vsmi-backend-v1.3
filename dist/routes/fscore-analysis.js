"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fscore_analysis_controller_1 = require("../controllers/fscore-analysis.controller");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
// Public routes
router.get('/', fscore_analysis_controller_1.getAllFScoreAnalyses);
router.get('/:symbol', fscore_analysis_controller_1.getFScoreAnalysis);
// Protected routes - Admin only
router.post('/batch', middlewares_1.verifyToken, middlewares_1.isAdmin, fscore_analysis_controller_1.batchProcessFScoreAnalyses);
exports.default = router;
