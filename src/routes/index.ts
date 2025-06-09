import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import categoryRoutes from './category';
import imageRoutes from './image';
import postRoutes from './post';
import stockRoutes from './stock';
import stockPriceRoutes from './stockPrice';
import financialMetricsRoutes from './financialMetrics';
import stockProfileRoutes from './stockProfile';
import selectedStocksRoutes from './selectedStocks';
import fscoreRoutes from './fscore.routes';
import technicalAnalysisRoutes from './technicalAnalysis';
import technicalRecommendationRoutes from './technicalRecommendation';
import chatGptAnalysis from './chatGptAnalysis';
import fscoreAnalysisRoutes from './fscore-analysis';
import subscriptionPlanRoutes from './subscriptionPlan';
import subscriptionRoutes from './subscription';
import newsArticleRoutes from './newsArticle.routes';

const router = Router();

// Combine all routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/images', imageRoutes);
router.use('/posts', postRoutes);
router.use('/stocks', stockRoutes);
router.use('/stock-prices', stockPriceRoutes);
router.use('/financial-metrics', financialMetricsRoutes);
router.use('/stock-profiles', stockProfileRoutes);
router.use('/selected-stocks', selectedStocksRoutes);
router.use('/fscores', fscoreRoutes);
router.use('/technical-analyses', technicalAnalysisRoutes);
router.use('/technical-recommendations', technicalRecommendationRoutes);
router.use('/chatgpt-analyses', chatGptAnalysis);
router.use('/fscore-analyses', fscoreAnalysisRoutes);
router.use('/subscription-plans', subscriptionPlanRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/news', newsArticleRoutes);

export default router;
