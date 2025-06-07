// Script to check Prisma client models
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('Available Prisma models:');
console.log(Object.keys(prisma));

// Check all specific model references
console.log('\nChecking specific models:');
console.log('technicalRecommendation:', typeof prisma.technicalRecommendation);
console.log('chatGptAnalysis:', typeof prisma.chatGptAnalysis);

// Get actual model names in lowercase for comparison
const modelNames = Object.keys(prisma).map(key => key.toLowerCase());
console.log('\nLowercase model names for comparison:');
console.log(modelNames.filter(name => 
  name !== '$' && 
  name !== '_' && 
  !name.startsWith('$') && 
  !name.startsWith('_')
));

// Close the Prisma client
prisma.$disconnect(); 