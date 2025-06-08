#!/usr/bin/env node

/**
 * This script processes technical recommendations with ChatGPT
 * It takes a list of symbols and a date and sends the data to ChatGPT for analysis
 * The results are stored in the ChatGptAnalysis table
 * 
 * Usage:
 * node scripts/process-chatgpt-analysis.js --symbol=VNM,FPT,VCB --date=2023-06-01
 * or
 * node scripts/process-chatgpt-analysis.js --all --date=2023-06-01
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const axios = require('axios');

const prisma = new PrismaClient();
const PROMPT_PATH = path.join(process.cwd(), 'src/prompt/technical-recommendations.txt');
const BATCH_SIZE = 5; // Number of symbols to process in a batch
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4.1';

// Define command line options
program
  .option('-s, --symbol <symbols>', 'Comma-separated list of stock symbols to process')
  .option('-a, --all', 'Process all symbols that have technical recommendations')
  .option('-d, --date <date>', 'Date to process (YYYY-MM-DD format)')
  .option('-f, --from-date <date>', 'Start date for processing (YYYY-MM-DD format)')
  .option('-t, --to-date <date>', 'End date for processing (YYYY-MM-DD format)')
  .option('-l, --latest', 'Process only the latest date for each symbol')
  .parse(process.argv);

const options = program.opts();

// Check that required options are provided
if ((!options.symbol && !options.all) || (!options.date && !options.latest && !options.fromDate)) {
  console.error('Error: You must provide either --symbol or --all option, and either --date, --latest, or --from-date option.');
  program.help();
  process.exit(1);
}

// Load the prompt template
let promptTemplate;
try {
  promptTemplate = fs.readFileSync(PROMPT_PATH, 'utf8');
} catch (error) {
  console.error('Error loading prompt template:', error);
  process.exit(1);
}

// Function to call OpenAI API
async function callOpenAI(data) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in .env file');
    }

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: MODEL,
        messages: [
          { role: 'system', content: promptTemplate },
          { role: 'user', content: JSON.stringify(data, null, 2) }
        ],
        temperature: 0.2,
        max_tokens: 1500,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response?.data || error.message);
    throw error;
  }
}

// Extract structured data from analysis text
function extractStructuredData(analysisText) {
  // Default values
  let tradingRecommendation = '';
  let suggestedBuyRange = '';
  let stopLossLevel = '';

  // Extract trading recommendation
  const recommendationMatch = analysisText.match(/Khuyến nghị.*?:(.*?)(?:\n|$)/i);
  if (recommendationMatch && recommendationMatch[1]) {
    tradingRecommendation = recommendationMatch[1].trim();
  }

  // Extract suggested buy range
  const buyRangeMatch = analysisText.match(/Vùng giá mua.*?:(.*?)(?:\n|$)/i);
  if (buyRangeMatch && buyRangeMatch[1]) {
    suggestedBuyRange = buyRangeMatch[1].trim();
  }

  // Extract stop loss level
  const stopLossMatch = analysisText.match(/Cắt lỗ.*?:(.*?)(?:\n|$)/i);
  if (stopLossMatch && stopLossMatch[1]) {
    stopLossLevel = stopLossMatch[1].trim();
  }

  return {
    tradingRecommendation,
    suggestedBuyRange,
    stopLossLevel
  };
}

// Format data for OpenAI
function formatData(recommendations) {
  return {
    symbol: recommendations[0].symbol,
    data: recommendations.map(rec => ({
      date: new Date(rec.date).toISOString().split('T')[0],
      open: rec.open,
      high: rec.high,
      low: rec.low,
      close: rec.close,
      volume: rec.volume,
      rsi14: rec.rsi14,
      macdLine: rec.macdLine,
      macdSignal: rec.macdSignal,
      macdHistogram: rec.macdHistogram,
      stochasticK: rec.stochasticK,
      stochasticD: rec.stochasticD,
      williamsR: rec.williamsR,
      ultimateOscillator: rec.ultimateOscillator,
      adx14: rec.adx14,
      sma10: rec.sma10,
      sma20: rec.sma20,
      sma50: rec.sma50,
      sma100: rec.sma100,
      sma200: rec.sma200,
      ema10: rec.ema10,
      ema20: rec.ema20,
      ema50: rec.ema50,
      ema100: rec.ema100,
      ema200: rec.ema200,
      hma9: rec.hma9,
      ichimokuBaseLine26: rec.ichimokuBaseLine26,
      awesomeOscillator: rec.awesomeOscillator,
      bearPower13: rec.bearPower13,
      bullPower13: rec.bullPower13,
      cci20: rec.cci20,
      minusDi14: rec.minusDi14,
      momentum10: rec.momentum10,
      plusDi14: rec.plusDi14,
      stochRsiD: rec.stochRsiD,
      stochRsiK: rec.stochRsiK,
    }))
  };
}

async function processSymbol(symbol, date) {
  try {
    console.log(`Processing ${symbol} for ${date}...`);
    
    // Get the last 20 technical recommendations for the symbol
    const recommendations = await prisma.technicalRecommendation.findMany({
      where: { symbol },
      orderBy: { date: 'desc' },
      take: 20,
    });

    if (!recommendations || recommendations.length === 0) {
      console.log(`No technical recommendations found for symbol: ${symbol}`);
      return null;
    }

    // Sort recommendations from oldest to newest for proper analysis
    const sortedData = [...recommendations].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Format data for ChatGPT input
    const formattedData = formatData(sortedData);
    
    // Get analysis from ChatGPT
    const analysisResult = await callOpenAI(formattedData);
    
    // Extract structured data from the analysis
    const extractedData = extractStructuredData(analysisResult);

    // Store the analysis in the database
    const savedAnalysis = await prisma.chatGptAnalysis.upsert({
      where: {
        symbol_analysisDate: {
          symbol,
          analysisDate: new Date(date),
        },
      },
      update: {
        inputData: formattedData,
        analysisResult,
        tradingRecommendation: extractedData.tradingRecommendation,
        suggestedBuyRange: extractedData.suggestedBuyRange,
        stopLossLevel: extractedData.stopLossLevel,
        updatedAt: new Date(),
      },
      create: {
        symbol,
        analysisDate: new Date(date),
        inputData: formattedData,
        analysisResult,
        tradingRecommendation: extractedData.tradingRecommendation,
        suggestedBuyRange: extractedData.suggestedBuyRange,
        stopLossLevel: extractedData.stopLossLevel,
      },
    });

    console.log(`Successfully processed ${symbol} for ${date}`);
    return savedAnalysis;
  } catch (error) {
    console.error(`Error processing ${symbol} for ${date}:`, error.message);
    return null;
  }
}

async function processAllSymbols(date) {
  // Get all symbols that have technical recommendations for the specified date
  const recommendations = await prisma.technicalRecommendation.findMany({
    where: {
      date: new Date(date)
    },
    select: {
      symbol: true
    }
  });
  
  if (recommendations.length === 0) {
    console.log(`No technical recommendations found for ${date}`);
    return;
  }
  
  const symbols = [...new Set(recommendations.map(rec => rec.symbol))]; // Remove duplicates
  console.log(`Found ${symbols.length} symbols with technical recommendations for ${date}`);
  
  // Process in batches to avoid rate limiting
  for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
    const batch = symbols.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(symbols.length / BATCH_SIZE)}`);
    
    await Promise.all(batch.map(symbol => processSymbol(symbol, date)));
    
    // Add a delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < symbols.length) {
      console.log('Waiting 5 seconds before next batch...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

async function processLatestForSymbols(symbols) {
  for (const symbol of symbols) {
    // Get the latest date for this symbol
    const latestRec = await prisma.technicalRecommendation.findFirst({
      where: {
        symbol
      },
      orderBy: {
        date: 'desc'
      },
      select: {
        date: true
      }
    });
    
    if (latestRec) {
      const latestDate = latestRec.date.toISOString().split('T')[0];
      await processSymbol(symbol, latestDate);
    } else {
      console.log(`No technical recommendations found for ${symbol}`);
    }
  }
}

async function processDateRange(symbols, fromDate, toDate) {
  const startDate = new Date(fromDate);
  const endDate = toDate ? new Date(toDate) : new Date();
  
  // Get all dates between start and end date where we have technical recommendations
  const dates = await prisma.technicalRecommendation.findMany({
    where: {
      symbol: {
        in: symbols.length > 0 ? symbols : undefined
      },
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      date: true
    },
    distinct: ['date'],
    orderBy: {
      date: 'asc'
    }
  });
  
  const uniqueDates = [...new Set(dates.map(d => d.date.toISOString().split('T')[0]))];
  console.log(`Found ${uniqueDates.length} dates to process between ${fromDate} and ${toDate || 'today'}`);
  
  for (const date of uniqueDates) {
    await processAllSymbols(date);
  }
}

async function main() {
  try {
    if (options.all) {
      if (options.date) {
        // Process all symbols for a specific date
        await processAllSymbols(options.date);
      } else if (options.fromDate) {
        // Process all symbols for a date range
        await processDateRange([], options.fromDate, options.toDate);
      } else if (options.latest) {
        // Process all symbols for their latest date
        const symbols = await prisma.stock.findMany({
          select: {
            symbol: true
          }
        });
        
        await processLatestForSymbols(symbols.map(s => s.symbol));
      }
    } else {
      // Process specific symbols
      const symbols = options.symbol.split(',').map(s => s.trim());
      
      if (options.date) {
        // Process specific symbols for a specific date
        for (const symbol of symbols) {
          await processSymbol(symbol, options.date);
        }
      } else if (options.fromDate) {
        // Process specific symbols for a date range
        await processDateRange(symbols, options.fromDate, options.toDate);
      } else if (options.latest) {
        // Process specific symbols for their latest date
        await processLatestForSymbols(symbols);
      }
    }
    
    console.log('Processing completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 