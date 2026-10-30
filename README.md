# Customer Request Managemnt Potal

> Autonomously engineered by **Antigravity Multi-Agent Engineering Team** ($0 Cost).
> Domain: **ORDER MANAGEMENT**
> Production Stack: **Next.js (Frontend) + Express.js (Backend) + Prisma ORM + MySQL (Database: doctordb)**

---

## 🏗️ Project Architecture
```text
Customer Request Managemnt Potal/
├── client/                     # Next.js 14 Responsive Frontend App
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── src/app/page.jsx        # Next.js App Router Page
├── server/                     # Express.js REST API Backend
│   ├── package.json
│   ├── server.js               # Express application entrypoint
│   ├── prisma/schema.prisma    # Prisma ORM MySQL Schema
│   ├── config/prisma.js        # Prisma Client Instance & Connection
│   ├── config/db.js            # MySQL connection pool (mysql2/promise)
│   ├── routes/api.js           # REST controllers & Prisma queries
│   └── .env                    # Server environment & DB credentials
├── database/                   # MySQL Relational Database Layer
│   └── schema.sql              # MySQL DDL schema & demo seed records
├── src/ui/index.html           # Standalone bundle for instant Command Center preview
├── tests/test_core.py          # Automated QA test suite & OWASP audit
├── PRD.md                      # Product Requirement Document
├── ARCHITECTURE.md             # Technical Architecture Blueprint
├── DEV_PLAN.md                 # Sprint Task & Git Branch Strategy
└── .env                        # Environment variables & DB credentials
```

---

## 🚀 How to Run the Application

### 1. Database Setup (MySQL - `doctordb`)
Ensure MySQL is running on `127.0.0.1:3306` (User: `root`, No Password). Import the database schema:
```bash
mysql -u root < database/schema.sql
```

### 2. Start Express.js Backend Server (with Prisma ORM)
```bash
cd server
npm install
npx prisma generate
npm run dev
```
Backend will start on: **`http://localhost:5000`** (Health check: `http://localhost:5000/api/health`)

### 3. Start Next.js Frontend App
```bash
cd client
npm install
npm run dev
```
Frontend will be accessible at: **`http://localhost:3000`**

### 4. Instant Live Preview (Command Center)
Open `src/ui/index.html` in any browser or view directly inside the Command Center **Live Preview** tab!
