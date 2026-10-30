# Product Requirement Document: ReqFlow Portal

**Version:** 1.0.0  
**Status:** Draft / Ready for Development  
**Tech Stack:** Next.js (App Router), Express.js, Prisma, MySQL

---

## 1. Executive Summary & Product Vision
**ReqFlow Portal** is a centralized request management system designed to streamline the lifecycle of customer inquiries, from submission to administrative resolution. By bridging the gap between customer input and administrative oversight, ReqFlow provides real-time visibility into request status and financial impact. The product vision is to minimize operational friction through a clean, performant, and secure interface.

---

## 2. User Personas & Target Audience
*   **The Customer:** Needs a frictionless way to submit requests and track their status without manual follow-ups.
*   **The Admin:** Requires high-level visibility into request volume, status distribution, and total financial value to prioritize resource allocation.

---

## 3. Page & Module Specifications

### Next.js Frontend Architecture
*   **`/login`**: Stateless form utilizing `POST /api/auth/login`. Stores JWT in an `httpOnly` cookie.
*   **`/dashboard`**: 
    *   *Components:* Metric Cards (Total Requests, Pending Count, Total Value), Status Distribution Chart.
    *   *Data Fetching:* Server-side rendering (SSR) via `GET /api/analytics`.
*   **`/requests`**: 
    *   *Components:* Data table with sorting/filtering. 
    *   *Actions:* "Edit" (redirects to `/requests/[id]/edit`) and "Delete" (triggered via `DELETE /api/requests/:id`).
*   **`/requests/create` & `/requests/[id]/edit`**: 
    *   *Components:* Controlled forms using `react-hook-form` + `zod` validation.
    *   *Workflow:* Redirects to `/requests` upon successful submission.

---

## 4. User Stories & Acceptance Criteria

**US-01: User Authentication**
*   **Given** a user is on the `/login` page
*   **When** they enter valid credentials
*   **Then** they receive a JWT and are redirected to the `/dashboard`

**US-02: Request Submission**
*   **Given** a logged-in customer
*   **When** they fill out the request form with valid title, description, and value
*   **Then** the request is persisted in MySQL and the user is redirected to the list view

**US-03: Admin Analytics**
*   **Given** an admin user
*   **When** they access the `/dashboard`
*   **Then** the system displays aggregated metrics calculated from the `Request` table

---

## 5. Backend API & MySQL Data Requirements

### Express.js API Contract
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Returns JWT | No |
| `GET` | `/api/requests` | Fetch list (Filtered by role) | Yes |
| `POST` | `/api/requests` | Create new record | Yes |
| `PUT` | `/api/requests/:id` | Update status/details | Yes |
| `DELETE` | `/api/requests/:id` | Soft/Hard delete | Yes |
| `GET` | `/api/analytics` | Aggregate dashboard data | Yes (Admin) |

### MySQL Schema (Prisma)
*   **Database:** `agentsys`
*   **Constraint:** Ensure `userId` in `Request` model is indexed for performance during `GET /api/requests` queries.
*   **Decimal Handling:** Use `Decimal` type for `value` to ensure financial precision.

---

## 6. Non-Functional & Quality Standards

### Security
*   **Password Hashing:** Use `bcrypt` with a salt round of 12.
*   **JWT:** Implement `jsonwebtoken` with short-lived access tokens (15m) and refresh token strategy.
*   **Validation:** All API inputs must be sanitized using `express-validator` or `zod`.

### Performance
*   **Database:** Prisma `findMany` queries for the dashboard must use `select` to fetch only required fields, avoiding `SELECT *`.
*   **Caching:** Implement SWR (Stale-While-Revalidate) on the frontend to minimize redundant API calls.

### UI/UX & Accessibility
*   **Design System:** Tailwind CSS utility classes.
*   **Responsiveness:** Mobile-first approach; tables must use horizontal scrolling on viewports < 768px.
*   **Status Indicators:** Use color-coded badges (e.g., `PENDING` = Amber, `COMPLETED` = Green, `REJECTED` = Red).

### Deployment
*   **Environment:** Ensure `DATABASE_URL="mysql://root:@localhost:3306/agentsys"` is configured in `.env`.
*   **Error Handling:** Global Express error-handling middleware to return consistent JSON error structures.