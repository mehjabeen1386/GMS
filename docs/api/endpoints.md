# API Endpoint Hierarchy Matrix

## Base URL

/api/v1

## Authentication

- POST /auth/register-contractor
- POST /auth/login
- POST /auth/refresh-token
- POST /auth/logout
- POST /auth/forgot-password
- POST /auth/reset-password

## Companies

- GET /companies
- POST /companies
- GET /companies/:id
- PUT /companies/:id
- DELETE /companies/:id

## Workshops

- GET /workshops
- POST /workshops
- GET /workshops/:id/summary
- PUT /workshops/:id

