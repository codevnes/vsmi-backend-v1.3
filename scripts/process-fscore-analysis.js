require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const inquirer = require('inquirer');
const XLSX = require('xlsx');

const prisma = new PrismaClient();
const program = new Command();

// API base URL from environment variable
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3030/api';
// API token for authentication
const API_TOKEN = process.env.API_TOKEN;

const FSCORE_DATA_PATH = path.join(process.cwd(), 'data-fscore', 'F_SCORE.xlsx');

program
  .description('Process F-Score Analysis using ChatGPT')
  .option('-s, --symbol <symbol>', 'Process a specific stock symbol')
  .option('-a, --all', 'Process all stocks with available F-Score data')
  .option('-l, --list', 'List all available stocks with F-Score data')
  .action(main)
  .parse(process.argv);

async function getStocksFromFScoreFile() {
  if (!fs.existsSync(FSCORE_DATA_PATH)) {
    console.error(`F-Score data file not found at: ${FSCORE_DATA_PATH}`);
    return [];
  }
  const workbook = XLSX.readFile(FSCORE_DATA_PATH);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  return data.map(row => row.SYMBOL).filter(Boolean);
}

async function listStocks() {
  try {
    console.log('Fetching stocks from F-Score data file...');
    const symbols = await getStocksFromFScoreFile();

    if (symbols.length === 0) {
      console.log('No stocks found in the F-Score data file.');
      return;
    }

    const stocks = await prisma.stock.findMany({
      where: {
        symbol: {
          in: symbols
        }
      },
      select: {
        symbol: true,
        name: true,
        industry: true
      },
      orderBy: {
        symbol: 'asc'
      }
    });
    
    console.log(`Found ${stocks.length} stocks with F-Score data`);
    
    const tableData = stocks.map(stock => ({
      Symbol: stock.symbol,
      Name: stock.name,
      Industry: stock.industry || 'N/A'
    }));
    
    console.table(tableData);
    
  } catch (error) {
    console.error('Error listing stocks:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function processSingleStock(symbol) {
  try {
    console.log(`Processing F-Score analysis for ${symbol}...`);
    console.log(`Started at: ${new Date().toLocaleTimeString()}`);

    // First check if the stock exists
    const stock = await prisma.stock.findUnique({
      where: { symbol }
    });

    if (!stock) {
      console.error(`Stock with symbol ${symbol} not found.`);
      return;
    }

    console.log(`Found stock: ${stock.symbol} - Sending API request...`);

    // Make API request to process the F-Score analysis
    const response = await axios.get(`${API_BASE_URL}/fscore-analyses/${symbol}`);

    if (response.status === 200) {
      console.log(`✅ Successfully processed F-Score analysis for ${symbol}`);
      console.log(`Completed at: ${new Date().toLocaleTimeString()}`);
      console.log('Analysis result:', response.data.analysisResult);
      
      // Display more details if available
      if (response.data.fscore) {
        console.log('F-Score details:');
        console.table(response.data.fscore);
      }
    } else {
      console.error(`❌ Failed to process F-Score analysis for ${symbol}`);
    }
  } catch (error) {
    console.error(`❌ Error processing F-Score analysis for ${symbol}:`, error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
  }
}

async function processAllStocks() {
  try {
    console.log('Fetching stocks from F-Score data file...');
    const symbols = await getStocksFromFScoreFile();
    
    if (symbols.length === 0) {
      console.log('No stocks found in F-Score data file to process.');
      return;
    }

    console.log(`Found ${symbols.length} stocks to process`);
    
    // Ask for confirmation before proceeding
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Are you sure you want to process F-Score analysis for all ${symbols.length} stocks from the data file? This may take a long time and consume API credits.`,
        default: false
      }
    ]);
    
    if (!confirm) {
      console.log('Operation cancelled.');
      return;
    }
    
    // Prepare batch request data
    
    // Create headers with authorization token if available
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (API_TOKEN) {
      headers['Authorization'] = `Bearer ${API_TOKEN}`;
    } else {
      console.warn('Warning: No API_TOKEN found in environment variables. Authentication may fail.');
    }
    
    // Make API request to batch process F-Score analyses
    console.log('Sending batch request...');
    console.log(`Processing started at: ${new Date().toLocaleTimeString()}`);
    
    const response = await axios.post(`${API_BASE_URL}/fscore-analyses/batch`, { symbols }, {
      headers,
      onUploadProgress: (progressEvent) => {
        console.log(`Upload progress: ${Math.round(progressEvent.loaded / progressEvent.total * 100)}%`);
      }
    });
    
    console.log(`Processing completed at: ${new Date().toLocaleTimeString()}`);
    
    if (response.status === 200) {
      console.log('Batch processing completed:');
      console.log(`- Success: ${response.data.success.length} stocks`);
      console.log(`- Failed: ${response.data.failed.length} stocks`);
      
      // Display successful stock symbols in groups of 10
      if (response.data.success && response.data.success.length > 0) {
        console.log('\nSuccessfully processed stocks:');
        const successGroups = [];
        for (let i = 0; i < response.data.success.length; i += 10) {
          successGroups.push(response.data.success.slice(i, i + 10));
        }
        
        successGroups.forEach((group, index) => {
          console.log(`Group ${index + 1}: ${group.join(', ')}`);
        });
      }
      
      // Display failed stock symbols and their errors
      if (response.data.errors && response.data.errors.length > 0) {
        console.log('\nErrors encountered:');
        console.table(response.data.errors);
      }
    } else {
      console.error('Failed to process batch request');
    }
  } catch (error) {
    console.error('Error processing all stocks:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
  } finally {
    await prisma.$disconnect();
  }
}

async function main(options) {
  console.log('===== F-SCORE ANALYSIS PROCESSOR =====');
  
  if (options.list) {
    console.log('\n🔍 LISTING ALL STOCKS');
    await listStocks();
  } else if (options.symbol) {
    console.log(`\n🔍 PROCESSING SINGLE STOCK: ${options.symbol}`);
    await processSingleStock(options.symbol);
  } else if (options.all) {
    console.log('\n🔍 PROCESSING ALL STOCKS');
    await processAllStocks();
  } else {
    // Interactive mode
    console.log('\n📋 INTERACTIVE MODE');
    
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'Process a single stock', value: 'single' },
          { name: 'Process all stocks', value: 'all' },
          { name: 'List all stocks', value: 'list' }
        ]
      }
    ]);
    
    if (action === 'single') {
      const { symbol } = await inquirer.prompt([
        {
          type: 'input',
          name: 'symbol',
          message: 'Enter the stock symbol:',
          validate: input => input.trim() !== '' || 'Symbol cannot be empty'
        }
      ]);
      
      console.log(`\n🔍 PROCESSING STOCK: ${symbol.trim().toUpperCase()}`);
      await processSingleStock(symbol.trim().toUpperCase());
    } else if (action === 'all') {
      console.log('\n🔍 PROCESSING ALL STOCKS');
      await processAllStocks();
    } else if (action === 'list') {
      console.log('\n🔍 LISTING ALL STOCKS');
      await listStocks();
    }
  }
  
  console.log('\n===== PROCESSING COMPLETED =====');
  await prisma.$disconnect();
}

// main().catch(async (e) => {
//   console.error(e);
//   await prisma.$disconnect();
//   process.exit(1);
// }); 