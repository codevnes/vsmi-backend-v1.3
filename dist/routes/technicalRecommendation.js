"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
// Public routes
router.get('/', controllers_1.getTechnicalRecommendations);
router.get('/:symbol/latest', controllers_1.getLatestTechnicalRecommendationBySymbol);
router.get('/:symbol/:date', controllers_1.getTechnicalRecommendationBySymbolAndDate);
// Protected routes - Admin only
router.post('/', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.createTechnicalRecommendation);
router.put('/:symbol/:date', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.updateTechnicalRecommendation);
router.patch('/:symbol/:date', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.upsertTechnicalRecommendation);
router.delete('/:symbol/:date', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.deleteTechnicalRecommendation);
exports.default = router;
