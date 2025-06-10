import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all news articles with pagination
 */
export const getNewsArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, symbol, sourceWebsite } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Build filter
    const where: any = {};
    if (symbol) {
      where.symbol = String(symbol);
    }
    if (sourceWebsite) {
      where.sourceWebsite = String(sourceWebsite);
    }

    // Get news articles
    const [articles, count] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
        skip,
        take,
        orderBy: {
          publishedAt: 'desc',
        },
      }),
      prisma.newsArticle.count({ where }),
    ]);

    res.json({
      data: articles,
      meta: {
        page: Number(page),
        limit: Number(limit),
        totalRecords: count,
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error getting news articles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get a single news article by ID
 */
export const getNewsArticleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const article = await prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!article) {
      res.status(404).json({ error: 'News article not found' });
      return;
    }

    res.json(article);
  } catch (error) {
    console.error('Error getting news article by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get news articles by stock symbol
 */
export const getNewsArticlesBySymbol = async (req: Request, res: Response): Promise<void> => {
  try {
    const { symbol } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [articles, count] = await Promise.all([
      prisma.newsArticle.findMany({
        where: { symbol },
        skip,
        take,
        orderBy: {
          publishedAt: 'desc',
        },
      }),
      prisma.newsArticle.count({ where: { symbol } }),
    ]);

    res.json({
      data: articles,
      meta: {
        page: Number(page),
        limit: Number(limit),
        totalRecords: count,
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error getting news articles by symbol:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get news sources
 */
export const getNewsSources = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Get distinct sources
    const sources = await prisma.newsArticle.findMany({
      select: {
        sourceWebsite: true,
      },
      distinct: ['sourceWebsite'],
      where: {
        sourceWebsite: {
          not: null,
        },
      },
    });

    res.json(sources.map((s: { sourceWebsite: string | null }) => s.sourceWebsite).filter(Boolean));
  } catch (error) {
    console.error('Error getting news sources:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 