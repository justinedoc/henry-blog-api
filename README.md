# Article API - 
## NAME: Uche Chukwuma Henry (SIWES 300L Project)

A beginner-friendly, clean RESTful Article API built using **Hono**, **Drizzle ORM**, **SQLite**, and **Zod OpenAPI**.

---

## Architecture Overview

This project implements a clean 3-layer architecture:
`Routes -> Controllers -> Services -> Database Model`

- **Routes (`src/routes/`)**: Define HTTP routes, OpenAPI metadata, request/response contracts, and parameter validation.
- **Controllers (`src/controllers/`)**: Parse HTTP context, invoke business services, and formulate typed JSON responses.
- **Services (`src/services/`)**: Implement business logic, permission checks, password hashing, and database queries.
- **Model (`src/model/`)**: Native Drizzle table definitions and database client (`henry_article.sqlite`) with foreign key enforcement.
- **Lib (`src/lib/`)**: Shared utilities including typed `ApiError`, OpenAPI schema generators, and pagination helpers.
- **Validations (`src/validations/`)**: Reusable Zod validation schemas separated cleanly with personalized examples.
- **E2E Tests (`e2e/`)**: Automated integration tests utilizing Vitest and Hono's `app.request()` test harness.

---

## Tech Stack

- **Framework**: [Hono](https://hono.dev/) with `@hono/zod-openapi`
- **Runtime**: Node.js 22+ with native `DatabaseSync` SQLite
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) (Native SQL syntax without relations.ts)
- **Database**: SQLite (`henry_article.sqlite`)
- **Authentication**: JWT (`hono/jwt`) + `bcryptjs`
- **Documentation**: OpenAPI 3.1.0 JSON (`/api/doc`) and Scalar UI (`/api/reference`)
- **Testing**: [Vitest](https://vitest.dev/)

---

## Getting Started

### 1. Installation

```bash
pnpm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Contents of `.env`:
```env
PORT=3000
NODE_ENV=development
DB_FILE_NAME=henry_article.sqlite
JWT_SECRET=henry_secret_siwes_300l_key
```

### 3. Database Migration

Generate and apply the SQLite schema migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

### 4. Running the Application

Development mode with live reload:
```bash
pnpm dev
```

Production build and execution:
```bash
pnpm build
pnpm start
```

### 5. Running Automated Tests

Run the end-to-end Vitest test suite:
```bash
pnpm test
```

---

## API Documentation

Once the server is running, visit:
- **Interactive Documentation (Scalar)**: `http://localhost:3000/api/reference`
- **OpenAPI Specification**: `http://localhost:3000/api/doc`

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new author account
- `POST /api/auth/login` - Authenticate and receive JWT token
- `GET /api/auth/me` - Get current authenticated user details
- `PATCH /api/auth/change-password` - Change account password

### Users
- `GET /api/users` - List users with pagination and search
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update profile (bio, displayName, avatar, username)
- `DELETE /api/users/me` - Delete account (cascades to profile, articles, comments)
- `GET /api/users/:username` - Get public profile
- `GET /api/users/:username/articles` - Get articles by author username

### Articles
- `POST /api/articles` - Create a new article
- `GET /api/articles` - List articles with pagination and search
- `GET /api/articles/me` - List articles by current authenticated user
- `GET /api/articles/:id` - Get article by ID or slug
- `PATCH /api/articles/:id` - Update article (author only)
- `DELETE /api/articles/:id` - Delete article (author only)

### Comments
- `POST /api/articles/:articleId/comments` - Create comment on article
- `GET /api/articles/:articleId/comments` - List comments for article with pagination
- `GET /api/comments/:commentId` - Get comment by ID
- `PATCH /api/comments/:commentId` - Update comment (author only)
- `DELETE /api/comments/:commentId` - Delete comment (author only)
