import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const BASE_URL = 'https://cafef.vn';

// Setup OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get the prompt for news summarization
const newsPromptPath = path.join(process.cwd(), 'src/prompt/news.txt');
const NEWS_PROMPT = fs.readFileSync(newsPromptPath, 'utf8');

interface Article {
  title: string;
  href: string;
}

/**
 * Crawl news titles and links from CafeF
 * @param url URL to crawl from
 * @returns Array of titles and links
 */
export async function crawlTitlesLinks(url: string): Promise<Article[]> {
  try {
    // 1. Fetch the page
    const { data } = await axios.get(url);
    
    // 2. Load HTML into cheerio
    const $ = cheerio.load(data);
    
    // 3. Get all articles in the .tlitem class (main article list)
    const articles: Article[] = [];
    
    $('.tlitem.box-category-item').each((i: number, el: any) => {
      const aTag = $(el).find('h3 > a').first();
      const title = aTag.text().trim();
      let href = aTag.attr('href');
      
      // If href is a relative path, add the domain
      if (href && href.startsWith('/')) {
        href = BASE_URL + href;
      }
      
      if (title && href) {
        articles.push({ title, href });
      }
    });
    
    return articles;
  } catch (error) {
    console.error('Error crawling titles and links:', error);
    return [];
  }
}

/**
 * Crawl the content of a news article
 * @param url Article URL
 * @returns Article content as text
 */
export async function crawlArticleContent(url: string): Promise<string> {
  try {
    // 1. Fetch the page
    const { data } = await axios.get(url);
    
    // 2. Load HTML into cheerio
    const $ = cheerio.load(data);
    
    // 3. Extract the main content
    // The content is typically in div#mainContent
    const content = $('#mainContent').text().trim();
    
    return content;
  } catch (error) {
    console.error('Error crawling article content:', error);
    return '';
  }
}

/**
 * Use ChatGPT to summarize article content
 * @param content Original article content
 * @returns Summarized content
 */
export async function summarizeWithChatGPT(content: string): Promise<string> {
  try {
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: `${NEWS_PROMPT}\n\n${content}`,
      max_tokens: 250,
      temperature: 0.7,
    });
    
    return response.choices[0].text.trim();
  } catch (error) {
    console.error('Error summarizing with ChatGPT:', error);
    return '';
  }
}

/**
 * Process a single article: crawl its content, summarize it, and save to database
 * @param article Article with title and URL
 */
export async function processArticle(article: Article): Promise<void> {
  try {
    // Check if article already exists in database
    const existingArticle = await prisma.newsArticle.findUnique({
      where: { url: article.href }
    });
    
    if (existingArticle) {
      console.log(`Article already exists: ${article.title}`);
      return;
    }
    
    // Crawl article content
    const originalContent = await crawlArticleContent(article.href);
    if (!originalContent) {
      console.log(`No content found for article: ${article.title}`);
      return;
    }
    
    // Summarize content using ChatGPT
    const summarizedContent = await summarizeWithChatGPT(originalContent);
    if (!summarizedContent) {
      console.log(`Failed to summarize article: ${article.title}`);
      return;
    }
    
    // Save to database
    const sourceWebsite = new URL(article.href).hostname;
    
    await prisma.newsArticle.create({
      data: {
        title: article.title,
        url: article.href,
        originalContent,
        summarizedContent,
        sourceWebsite,
        publishedAt: new Date(),
      }
    });
    
    console.log(`Successfully processed article: ${article.title}`);
  } catch (error) {
    console.error('Error processing article:', error);
  }
}

/**
 * Crawl and process general market news
 * @param url URL to crawl from
 */
export async function crawlAndProcessMarketNews(url: string): Promise<void> {
  try {
    const articles = await crawlTitlesLinks(url);
    
    for (const article of articles) {
      await processArticle(article);
    }
    
    console.log('Completed processing market news');
  } catch (error) {
    console.error('Error processing market news:', error);
  }
} 