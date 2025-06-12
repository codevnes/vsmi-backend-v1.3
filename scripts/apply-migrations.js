#!/usr/bin/env node

/**
 * Script to manually apply SQL migrations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Applying migration to remove date field from SelectedStocks...');
    
    // Get the SQL migration file content
    const migrationPath = path.join(__dirname, '..', 'prisma', 'migrations', 'migration_remove_date_field.sql');
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }
    
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    
    // Execute the SQL directly using Prisma's executeRaw
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);
    
    for (const command of commands) {
      console.log(`Executing: ${command}`);
      await prisma.$executeRawUnsafe(`${command};`);
    }
    
    console.log('Migration completed successfully');
    
    // Create a new Prisma migration to sync the schema file
    console.log('Creating new Prisma migration to update schema...');
    execSync('npx prisma migrate dev --name remove_date_from_selected_stocks', { stdio: 'inherit' });
    
    console.log('Generating updated Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('All done! The database has been updated successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main(); 