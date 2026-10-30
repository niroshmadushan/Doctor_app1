// Prisma Client connector for Customer Request Managemnt Potal
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

let prisma = null;
let isPrismaReady = false;

try {
  prisma = new PrismaClient();
  prisma.$connect()
    .then(() => {
      isPrismaReady = true;
      console.log('[Prisma ORM]: Successfully connected to MySQL database agentsys at 127.0.0.1:3306');
    })
    .catch(() => {
      console.warn('[Prisma Notice]: Run "npx prisma db push" to synchronize models with MySQL agentsys.');
    });
} catch (err) {
  console.warn('[Prisma Notice]: Run "npx prisma generate" to activate Prisma Client.');
}

module.exports = {
  prisma,
  isPrismaReady: () => isPrismaReady
};
