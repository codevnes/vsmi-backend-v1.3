"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const technicalRecommendation_controller_1 = require("../controllers/technicalRecommendation.controller");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
// Public routes
router.get('/', technicalRecommendation_controller_1.getTechnicalRecommendations);
router.get('/:symbol/latest', technicalRecommendation_controller_1.getLatestTechnicalRecommendationBySymbol);
router.get('/:symbol/:date', technicalRecommendation_controller_1.getTechnicalRecommendationBySymbolAndDate);
// Protected routes - Admin only
router.post('/', middlewares_1.verifyToken, middlewares_1.isAdmin, technicalRecommendation_controller_1.createTechnicalRecommendation);
router.put('/:symbol/:date', middlewares_1.verifyToken, middlewares_1.isAdmin, technicalRecommendation_controller_1.updateTechnicalRecommendation);
router.patch('/:symbol/:date', middlewares_1.verifyToken, middlewares_1.isAdmin, technicalRecommendation_controller_1.upsertTechnicalRecommendation);
router.delete('/:symbol/:date', middlewares_1.verifyToken, middlewares_1.isAdmin, technicalRecommendation_controller_1.deleteTechnicalRecommendation);
exports.default = router;
