"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const technicalAnalysis_controller_1 = require("../controllers/technicalAnalysis.controller");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
// Public routes
router.get('/', technicalAnalysis_controller_1.getTechnicalAnalyses);
router.get('/:symbol', technicalAnalysis_controller_1.getTechnicalAnalysisBySymbol);
// Protected routes - Admin only
router.post('/', middlewares_1.verifyToken, middlewares_1.isAdmin, technicalAnalysis_controller_1.createTechnicalAnalysis);
router.put('/:symbol', middlewares_1.verifyToken, middlewares_1.isAdmin, technicalAnalysis_controller_1.updateTechnicalAnalysis);
router.patch('/:symbol', middlewares_1.verifyToken, middlewares_1.isAdmin, technicalAnalysis_controller_1.upsertTechnicalAnalysis);
router.delete('/:symbol', middlewares_1.verifyToken, middlewares_1.isAdmin, technicalAnalysis_controller_1.deleteTechnicalAnalysis);
exports.default = router;
