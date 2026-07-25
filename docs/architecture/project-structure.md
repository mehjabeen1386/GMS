# Phase 5: Project Repository & Code Structure Setup

We are adopting a clean, modular mono-repository architecture separating the Frontend (/frontend) and Backend (/backend).

aigcwms-production/
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Automated Linting & Tests
│       └── deploy.yml                 # Automated Staging/Production Deployment
│
├── backend/
│   ├── config/                        # DB, Redis, Logger & JWT Config
│   │   ├── db.js
│   │   ├── jwt.js
│   │   └── logger.js
│   │
│   ├── src/
│   │   ├── controllers/               # Express Request Controllers
│   │   ├── middleware/                # Authentication, RBAC, Rate Limiting & Error Handlers
│   │   ├── models/                    # Database Models
│   │   ├── repositories/              # Database Access Layer (DAL)
│   │   ├── routes/                    # REST API Route Definitions
│   │   ├── services/                  # Business Logic & AI Services
│   │   ├── utils/                     # Helper Functions, PDF Generators & Calculators
│   │   └── app.js                     # Express Application
│   │
│   ├── server.js                      # HTTP Server Entry Point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── locales/
│   │       ├── en/
│   │       │   └── translation.json
│   │       └── hi/
│   │           └── translation.json
│   │
│   ├── src/
│   │   ├── assets/                    # Images, Icons & Static Files
│   │   ├── components/                # Reusable React Components
│   │   ├── context/                   # Global Context (Authentication, Socket)
│   │   ├── hooks/                     # Custom React Hooks
│   │   ├── layouts/                   # Application Layouts
│   │   ├── pages/                     # Page Components
│   │   ├── services/                  # API Integration (Axios)
│   │   ├── utils/                     # Utility Functions
│   │   ├── App.jsx                    # Main Application Component
│   │   ├── index.css                  # Global Styles
│   │   └── main.jsx                   # React Entry Point
│   │
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
