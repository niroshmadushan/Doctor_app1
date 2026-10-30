# Technical Architecture Blueprint: ReqFlow Portal

This document outlines the production-grade architecture for the **ReqFlow Portal**. The system follows a decoupled architecture, separating the Next.js frontend from the Express.js backend, communicating via RESTful APIs secured by JWT.

---

## 1. Technology Stack & Architectural Rationale

*   **Frontend (Next.js 14+):** Utilizes the App Router for server-side rendering (SSR) and optimized performance. Tailwind CSS is used for utility-first styling, ensuring a responsive, maintainable UI.
*   **Backend (Express.js):** A lightweight, high-performance Node.js framework. It handles business logic, authentication middleware, and ORM integration.
*   **ORM (Prisma):** Provides type-safe database access, reducing runtime errors and simplifying complex queries for dashboard metrics.
*   **Database (MySQL 8.0+):** `agentsys` schema configured with InnoDB for ACID compliance. Connection pooling is managed via Prisma’s internal engine (built on `mysql2`).
*   **Security:** JWT-based stateless authentication, bcrypt password hashing, and strict CORS policies.

---

## 2. Workspace File & Directory Blueprint

```text
reqflow-portal/
├── client/                 # Next.js App Router
│   ├── src/
│   │   ├── app/            # Pages & Layouts
│   │   ├── components/     # Reusable UI components
│   │   └── lib/            # API client (axios/fetch)
├── server/                 # Express.js REST API
│   ├── prisma/             # Schema & Migrations
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth & Validation
│   │   └── routes/         # API endpoints
│   └── index.js            # Server entry point
└── database/               # SQL DDL Scripts
```

---

## 3. Frontend Architecture (Next.js)

*   **State Management:** React `useState`/`useEffect` for local UI state; `SWR` or `TanStack Query` for server state caching.
*   **Routing:** App Router for protected routes. Middleware checks for `httpOnly` cookies before rendering protected pages.
*   **Design System:** Tailwind CSS configured with a centralized `tailwind.config.js` for consistent branding (colors, spacing).

---

## 4. Express.js REST API Specification

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | Public |
| `GET` | `/api/requests` | Fetch requests (filtered by role) | Protected |
| `POST` | `/api/requests` | Create new request | Protected |
| `PUT` | `/api/requests/:id` | Update request status/details | Protected |
| `DELETE` | `/api/requests/:id` | Remove request | Admin Only |
| `GET` | `/api/analytics` | Aggregate dashboard metrics | Admin Only |

---

## 5. Prisma ORM & MySQL Schema (`agentsys`)

### Prisma Schema (`schema.prisma`)
```prisma
datasource db {
  provider = "mysql"
  url      = "mysql://root:@localhost:3306/agentsys"
}

model User {
  id       Int       @id @default(autoincrement())
  username String    @unique
  password String
  role     String    @default("CUSTOMER")
  requests Request[]
}

model Request {
  id          Int      @id @default(autoincrement())
  title       String
  description String   @db.Text
  value       Decimal  @db.Decimal(10, 2)
  status      String   @default("PENDING")
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  @@index([userId])
}
```

### MySQL DDL (Excerpt)
```sql
CREATE DATABASE IF NOT EXISTS agentsys;
USE agentsys;

CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER', 'ADMIN') DEFAULT 'CUSTOMER'
);

CREATE TABLE Request (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    value DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'PENDING',
    userId INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);
```

---

## 6. Security Posture & OWASP Hardening

1.  **Authentication:** Passwords are never stored in plain text. Use `bcrypt` with a salt round of 12.
2.  **JWT Security:** Tokens are stored in `httpOnly`, `Secure`, and `SameSite=Strict` cookies to prevent XSS and CSRF attacks.
3.  **Input Sanitization:** Use `express-validator` to sanitize all incoming request bodies.
4.  **SQL Injection:** Prisma ORM inherently uses parameterized queries, neutralizing SQL injection vectors.
5.  **CORS:** Restrict API access to the specific domain of the Next.js frontend.
6.  **Rate Limiting:** Implement `express-rate-limit` on `/api/auth/login` to prevent brute-force attacks.
7.  **Least Privilege:** The database user `root` should be replaced in production with a restricted user having only `SELECT`, `INSERT`, `UPDATE`, `DELETE` permissions on `agentsys`.