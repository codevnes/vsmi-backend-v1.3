import { Router } from 'express';
import { FScoreController } from '../controllers/fscore.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';
import { prisma } from '../app';

const fscoreController = new FScoreController();
const router = Router();

/**
 * Debug route to check Prisma client models
 */
router.get('/debug/models', async (req, res) => {
  try {
    const models = Object.keys(prisma);
    console.log('Available Prisma models:', models);
    res.json({ models });
  } catch (error) {
    console.error('Debug route error:', error);
    res.status(500).json({ error: 'Failed to inspect Prisma models' });
  }
});

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
router.post('/', verifyToken, isAdmin, fscoreController.create);

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
router.put('/symbol/:symbol', verifyToken, isAdmin, fscoreController.updateBySymbol);

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
router.put('/:id', verifyToken, isAdmin, fscoreController.update);

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
router.delete('/symbol/:symbol', verifyToken, isAdmin, fscoreController.deleteBySymbol);

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
router.delete('/:id', verifyToken, isAdmin, fscoreController.delete);

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
router.post('/upsert/:symbol', verifyToken, isAdmin, fscoreController.upsert);

export default router; 