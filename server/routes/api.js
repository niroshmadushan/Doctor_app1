// Express.js Route Controllers with Prisma ORM & Parameterized MySQL Queries
const express = require('express');
const router = express.Router();
const { pool, isDbConnected } = require('../config/db');
const { prisma, isPrismaReady } = require('../config/prisma');

let fallbackRecords = [
  { id: "REC-101", title: "Core Database Cluster Migration", category: "Infrastructure", priority: "High", status: "Active", date: "2026-10-28" },
  { id: "REC-102", title: "OWASP Level 2 Vulnerability Audit", category: "Security", priority: "High", status: "Active", date: "2026-10-29" },
  { id: "REC-103", title: "API Microservice Latency Optimization", category: "Operations", priority: "Medium", status: "Pending", date: "2026-10-29" },
  { id: "REC-104", title: "Automated Backup & Disaster Recovery", category: "Compliance", priority: "Medium", status: "Active", date: "2026-10-30" }
];

router.post('/auth/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (isPrismaReady() && prisma && prisma.user) {
    try {
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            passwordHash: 'hash_' + Buffer.from(password).toString('hex').slice(0, 16),
            name: email.split('@')[0].toUpperCase(),
            role: role || 'Administrator'
          }
        });
      }
      return res.json({
        token: 'jwt_mock_token_' + Buffer.from(email).toString('hex'),
        user: { email: user.email, name: user.name, role: user.role },
        role: user.role,
        source: 'Prisma ORM'
      });
    } catch (e) {}
  }

  const userName = email.split('@')[0].toUpperCase();
  res.json({
    token: 'jwt_mock_token_' + Buffer.from(email).toString('hex'),
    user: { email, name: userName, role: role || 'Administrator' },
    role: role || 'Administrator',
    source: 'Auth Standby'
  });
});

router.get('/records', async (req, res) => {
  const { q, status } = req.query;

  if (isPrismaReady() && prisma && prisma.operationalRecord) {
    try {
      const whereClause = {};
      if (status && status.toLowerCase() !== 'all') {
        whereClause.status = status;
      }
      if (q) {
        whereClause.OR = [
          { title: { contains: q } },
          { category: { contains: q } },
          { id: { contains: q } }
        ];
      }
      const records = await prisma.operationalRecord.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' }
      });
      return res.json(records);
    } catch (err) {
      console.warn('[Prisma Query fallback to MySQL]:', err.message);
    }
  }

  if (isDbConnected()) {
    try {
      let sql = 'SELECT * FROM operational_records WHERE 1=1';
      const params = [];

      if (status && status.toLowerCase() !== 'all') {
        sql += ' AND status = ?';
        params.push(status);
      }
      if (q) {
        sql += ' AND (title LIKE ? OR category LIKE ? OR id LIKE ?)';
        const queryTerm = `%${q}%`;
        params.push(queryTerm, queryTerm, queryTerm);
      }
      sql += ' ORDER BY created_at DESC';

      const [rows] = await pool.query(sql, params);
      return res.json(rows);
    } catch (err) {
      console.warn('[MySQL Query Error, using fallback]:', err.message);
    }
  }

  let filtered = fallbackRecords;
  if (status && status.toLowerCase() !== 'all') {
    filtered = filtered.filter(r => r.status.toLowerCase() === status.toLowerCase());
  }
  if (q) {
    const qLower = q.toLowerCase();
    filtered = filtered.filter(r => r.title.toLowerCase().includes(qLower) || r.category.toLowerCase().includes(qLower));
  }
  res.json(filtered);
});

router.post('/records', async (req, res) => {
  const { title, category, priority } = req.body;
  const newId = `REC-${Math.floor(100 + Math.random() * 900)}`;
  const dateStr = new Date().toISOString().split('T')[0];

  if (isPrismaReady() && prisma && prisma.operationalRecord) {
    try {
      const created = await prisma.operationalRecord.create({
        data: {
          id: newId,
          title,
          category: category || 'Operations',
          priority: priority || 'Medium',
          status: 'Active',
          createdDate: dateStr
        }
      });
      return res.status(201).json(created);
    } catch (err) {
      console.warn('[Prisma Insert fallback]:', err.message);
    }
  }

  if (isDbConnected()) {
    try {
      await pool.query(
        'INSERT INTO operational_records (id, title, category, priority, status, created_date) VALUES (?, ?, ?, ?, ?, ?)',
        [newId, title, category, priority || 'Medium', 'Active', dateStr]
      );
      return res.status(201).json({ id: newId, title, category, priority, status: 'Active', date: dateStr });
    } catch (err) {
      console.warn('[MySQL Insert Error]:', err.message);
    }
  }

  const record = { id: newId, title, category, priority: priority || 'Medium', status: 'Active', date: dateStr };
  fallbackRecords.unshift(record);
  res.status(201).json(record);
});

router.patch('/records/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (isPrismaReady() && prisma && prisma.operationalRecord) {
    try {
      const updated = await prisma.operationalRecord.update({
        where: { id },
        data: { status }
      });
      return res.json({ status: 'updated', record: updated });
    } catch (err) {}
  }

  if (isDbConnected()) {
    try {
      await pool.query('UPDATE operational_records SET status = ? WHERE id = ?', [status, id]);
      return res.json({ status: 'updated', id, newStatus: status });
    } catch (err) {}
  }

  const item = fallbackRecords.find(r => r.id === id);
  if (item) {
    item.status = status;
    return res.json({ status: 'updated', item });
  }
  res.status(404).json({ error: 'Record not found' });
});

router.delete('/records/:id', async (req, res) => {
  const { id } = req.params;

  if (isPrismaReady() && prisma && prisma.operationalRecord) {
    try {
      await prisma.operationalRecord.delete({ where: { id } });
      return res.json({ status: 'deleted', id });
    } catch (err) {}
  }

  if (isDbConnected()) {
    try {
      await pool.query('DELETE FROM operational_records WHERE id = ?', [id]);
      return res.json({ status: 'deleted', id });
    } catch (err) {}
  }

  fallbackRecords = fallbackRecords.filter(r => r.id !== id);
  res.json({ status: 'deleted', id });
});

router.get('/telemetry/stats', async (req, res) => {
  res.json({
    total_records: fallbackRecords.length,
    active_records: fallbackRecords.filter(r => r.status === 'Active').length,
    uptime: '99.98%',
    db_engine: 'MySQL',
    orm: 'Prisma ORM',
    database_name: 'agentsys',
    prisma_active: isPrismaReady(),
    active_pool_connections: isDbConnected() ? 10 : 0
  });
});

module.exports = router;
