const { PrismaClient } = require('@prisma/client');

// Reuse a single PrismaClient instance across the app (important with nodemon
// hot-reloads too - avoids exhausting DB connections).
const prisma = new PrismaClient();

module.exports = prisma;