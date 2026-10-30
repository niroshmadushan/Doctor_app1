// Express.js REST API Server for Customer Request Managemnt Potal
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { pool, isDbConnected } = require('./config/db');
const { prisma, isPrismaReady } = require('./config/prisma');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'operational',
    project: 'Customer Request Managemnt Potal',
    stack: 'Express.js + Prisma ORM + MySQL + Next.js',
    database: {
      engine: 'MySQL',
      orm: 'Prisma ORM',
      connected: isDbConnected() || isPrismaReady(),
      host: process.env.DB_HOST || '127.0.0.1',
      database: process.env.DB_NAME || 'doctordb'
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/db/status', async (req, res) => {
  try {
    if (isPrismaReady() && prisma) {
      await prisma.$queryRaw`SELECT 1`;
      return res.json({
        engine: 'mysql',
        orm: 'Prisma ORM',
        database: 'doctordb',
        connected: true,
        status: 'prisma_connected'
      });
    }
    if (isDbConnected()) {
      const [rows] = await pool.query('SELECT VERSION() as version');
      return res.json({
        engine: 'mysql',
        connected: true,
        version: rows[0].version,
        pool_limit: 10
      });
    }
  } catch (e) {}
  res.json({
    engine: 'mysql',
    connected: isDbConnected() || isPrismaReady(),
    status: (isDbConnected() || isPrismaReady()) ? 'connected' : 'standby_mock_resilient'
  });
});

app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
  console.error('[Express Error]:', err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`[Express API]: Server running on http://127.0.0.1:${PORT}`);
});
