"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var fscore_controller_1 = require("../controllers/fscore.controller");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var app_1 = require("../app");
var fscoreController = new fscore_controller_1.FScoreController();
var router = (0, express_1.Router)();
/**
 * Debug route to check Prisma client models
 */
router.get('/debug/models', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var models;
    return __generator(this, function (_a) {
        try {
            models = Object.keys(app_1.prisma);
            console.log('Available Prisma models:', models);
            res.json({ models: models });
        }
        catch (error) {
            console.error('Debug route error:', error);
            res.status(500).json({ error: 'Failed to inspect Prisma models' });
        }
        return [2 /*return*/];
    });
}); });
/**
 * @swagger
 * tags:
 *   name: FScores
 *   description: Endpoints for managing F-Score data
 */
/**
 * @swagger
 * /api/fscores:
 *   get:
 *     summary: Get all FScores
 *     tags: [FScores]
 *     responses:
 *       200:
 *         description: A list of FScores
 *       500:
 *         description: Server error
 */
router.get('/', fscoreController.getAll);
/**
 * @swagger
 * /api/fscores/symbol/{symbol}:
 *   get:
 *     summary: Get FScore by stock symbol
 *     tags: [FScores]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         schema:
 *           type: string
 *         required: true
 *         description: Stock symbol
 *     responses:
 *       200:
 *         description: FScore found
 *       404:
 *         description: FScore not found
 *       500:
 *         description: Server error
 */
router.get('/symbol/:symbol', fscoreController.getBySymbol);
/**
 * @swagger
 * /api/fscores/{id}:
 *   get:
 *     summary: Get FScore by ID
 *     tags: [FScores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: FScore ID
 *     responses:
 *       200:
 *         description: FScore found
 *       404:
 *         description: FScore not found
 *       500:
 *         description: Server error
 */
router.get('/:id', fscoreController.getById);
/**
 * @swagger
 * /api/fscores:
 *   post:
 *     summary: Create a new FScore
 *     tags: [FScores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - symbol
 *             properties:
 *               symbol:
 *                 type: string
 *                 description: Stock symbol
 *     responses:
 *       201:
 *         description: FScore created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, fscoreController.create);
/**
 * @swagger
 * /api/fscores/symbol/{symbol}:
 *   put:
 *     summary: Update FScore by stock symbol
 *     tags: [FScores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: symbol
 *         schema:
 *           type: string
 *         required: true
 *         description: Stock symbol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: FScore updated
 *       404:
 *         description: FScore not found
 *       500:
 *         description: Server error
 */
router.put('/symbol/:symbol', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, fscoreController.updateBySymbol);
/**
 * @swagger
 * /api/fscores/{id}:
 *   put:
 *     summary: Update FScore by ID
 *     tags: [FScores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: FScore ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: FScore updated
 *       404:
 *         description: FScore not found
 *       500:
 *         description: Server error
 */
router.put('/:id', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, fscoreController.update);
/**
 * @swagger
 * /api/fscores/symbol/{symbol}:
 *   delete:
 *     summary: Delete FScore by stock symbol
 *     tags: [FScores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: symbol
 *         schema:
 *           type: string
 *         required: true
 *         description: Stock symbol
 *     responses:
 *       204:
 *         description: FScore deleted
 *       404:
 *         description: FScore not found
 *       500:
 *         description: Server error
 */
router.delete('/symbol/:symbol', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, fscoreController.deleteBySymbol);
/**
 * @swagger
 * /api/fscores/{id}:
 *   delete:
 *     summary: Delete FScore by ID
 *     tags: [FScores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: FScore ID
 *     responses:
 *       204:
 *         description: FScore deleted
 *       404:
 *         description: FScore not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, fscoreController.delete);
/**
 * @swagger
 * /api/fscores/upsert/{symbol}:
 *   post:
 *     summary: Create or update FScore by stock symbol
 *     tags: [FScores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: symbol
 *         schema:
 *           type: string
 *         required: true
 *         description: Stock symbol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: FScore created or updated
 *       500:
 *         description: Server error
 */
router.post('/upsert/:symbol', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, fscoreController.upsert);
exports.default = router;
