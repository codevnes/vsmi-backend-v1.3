const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const columns = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'TechnicalAnalysis' ORDER BY ordinal_position;`;
  console.log(columns);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 