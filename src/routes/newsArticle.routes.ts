import express from 'express';
import { getNewsArticles, getNewsArticleById, getNewsArticlesBySymbol, getNewsSources } from '../controllers/newsArticle.controller';

const router = express.Router();

/**
 * @route GET /api/news
 * @desc Get all news articles with pagination
 * @access Public
 */
router.get('/', getNewsArticles);

/**
 * @route GET /api/news/:id
 * @desc Get a single news article by ID
 * @access Public
 */
router.get('/:id', getNewsArticleById);

/**
 * @route GET /api/news/symbol/:symbol
 * @desc Get news articles by stock symbol
 * @access Public
 */
router.get('/symbol/:symbol', getNewsArticlesBySymbol);

/**
 * @route GET /api/news/sources
 * @desc Get all news sources
 * @access Public
 */
router.get('/sources', getNewsSources);

export default router; 