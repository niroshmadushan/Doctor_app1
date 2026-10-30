# 🛠️ Full-Stack Development Plan: Customer Request Managemnt Potal

> Joint Sprint Technical Specification prepared collaboratively by **Product Manager Agent** and **Software Architect Agent**.
> Focus: High-Throughput Orders Pipeline, Product Catalog, Customer Directory & Database Integration (MYSQL)

---

## 🌳 1. Git Version Control & Branch Strategy
| Branch Name | Role & Scope | Base Branch | Target Release |
|---|---|---|---|
| **`main`** 🚀 | Production Release (Locked & Verified) | - | Production |
| **`dev`** 🌿 | Sprint Staging & Test Runners | `main` | Staging |
| **`feature/frontend-portal`** 🎨 | Orders Pipeline, Catalog, Invoice & Modal SPA | `dev` | UI Staging |
| **`feature/backend-api`** ⚙️ | FastAPI Orders REST APIs & DB Service Pool | `dev` | API Staging |

---

## 🎨 2. Frontend Engineering Track
- **Module 1 (Orders Pipeline):** Searchable table, filter pills (`Pending`, `Processing`, `Shipped`, `Delivered`).
- **Module 2 (Order Placement):** Reactive modal to place new customer orders with live pricing.
- **Module 3 (Product Catalog):** SKU inventory grid with unit prices and stock numbers.
- **Module 4 (Customer Directory):** Client profiles and lifetime value metrics.
- **Module 5 (Invoices):** Printable itemized invoices with total billing.

---

## ⚙️ 3. Backend API Track
- `GET /api/orders` ➡️ List orders with status filters.
- `GET /api/orders/<built-in function id>` ➡️ Retrieve detailed itemized invoice.
- `POST /api/orders` ➡️ Create and place a new order.
- `PATCH /api/orders/<built-in function id>/status` ➡️ Transition order fulfillment state.
- `GET /api/products` ➡️ Retrieve live product catalog and stock levels.
- `GET /api/analytics` ➡️ Retrieve total revenue and fulfillment metrics.

---

## 📋 4. Sprint Task Backlog
1. **TASK-01:** Define Pydantic Domain Schemas (`src/models/schema.py`)
2. **TASK-02:** Build FastAPI REST APIs & Database Handlers (`src/api/server.py`)
3. **TASK-03:** Develop Responsive Order Management SPA with Tailwind (`src/ui/index.html`)
4. **TASK-04:** Automated Unit Test Suite & Billing Math (`tests/test_core.py`)
