import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { CategoryService } from './category.service';
import { ImageService } from './image.service';
import { PostService } from './post.service';
import { StockService } from './stock.service';
import { StockPriceService } from './stockPrice.service';
import { FinancialMetricsService } from './financialMetrics.service';
import { FScoreService } from './fscore.service';
import { StockProfileService } from './stockProfile.service';
import { TechnicalAnalysisService } from './technicalAnalysis.service';
import { TechnicalRecommendationService } from './technicalRecommendation.service';
import { OpenAIService } from './openai.service';
import { SubscriptionPlanService } from './subscriptionPlan.service';
import { SubscriptionService } from './subscription.service';
import fscoreService from './fscore.service';

// Export instances
export const authService = new AuthService();
export const userService = new UserService();
export const categoryService = new CategoryService();
export const imageService = new ImageService();
export const postService = new PostService();
export const stockService = new StockService();
export const stockPriceService = new StockPriceService();
export const financialMetricsService = new FinancialMetricsService();
export const stockProfileService = new StockProfileService();
export const technicalAnalysisService = new TechnicalAnalysisService();
export const technicalRecommendationService = new TechnicalRecommendationService();
export const openAIService = new OpenAIService();
export const subscriptionPlanService = new SubscriptionPlanService();
export const subscriptionService = new SubscriptionService();
export { fscoreService };

// Export classes
export { 
  AuthService, 
  UserService, 
  CategoryService, 
  ImageService, 
  PostService, 
  StockService,
  StockPriceService,
  FinancialMetricsService,
  StockProfileService,
  TechnicalAnalysisService,
  TechnicalRecommendationService,
  OpenAIService,
  SubscriptionPlanService,
  SubscriptionService
};
