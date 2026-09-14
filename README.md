# AI Powered Garments Contractor and Worker Management System

An enterprise-grade, high-performance web application designed for garment contractors, factory managers, and textile warehouses. This system unifies end-to-end garment operations—from buyer tracking and inventory ledgers to real-time piece-rate labor tracking, automated payroll calculations, and AI-driven stock optimization.

---

## 🚀 Key Features

* **Dashboard & AI Smart Operations Advisor:** Live operational metrics overview featuring automated bottleneck risk monitoring, AI efficiency scoring, and scrap reduction recommendations.
* **Brand & Clients (Buyers) Management:** Track buyer contacts, total active purchase orders (POs), lifetime order volumes, and outstanding accounts receivable balances.
* **Fabric Inventory Ledger:** Real-time stock meter tracking, low-stock threshold alerts (< 20m), trash archive management, and integrated AI fabric utilization estimators.
* **Job Orders Management:** Create and track production job orders with target piece quantities, garment style specifications, per-piece fabric consumption, and target delivery dates.
* **Production Floor Monitor:** Live assembly line tracking for completed vs. remaining order pieces, total piece-rate earnings, and manual or barcode scan logs.
* **Workforce & Tailor Directory:** Centralized labor management tracking skill categories (Tailor, Helper, Collar Specialist), lifetime production output, and unpaid piece-rate balance ledgers.
* **Factory Reports & Analytics:** Comprehensive output summary, disbursed payroll tracking, active scan logs, and CSV data export capabilities.
* **Factory Settings & Configuration:** Custom plant profile setup (GSTIN, factory identity), base currency configuration, and auto-scan roll reduction toggles.

---

## 🛠️ Tech Stack

* **Framework:** React / Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Validation:** Zod

---

## 📦 Getting Started

### Prerequisites

Ensure you have Node.js (v18.x or higher) installed on your system.

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/mehjabeen1386/GMS.git](https://github.com/mehjabeen1386/GMS.git)
   cd GMS

Install dependencies:
   npm install

Run the development server:
   npm run dev
   Open http://localhost:3000 in your browser to launch the system.

## 📁 Project Structure
<pre><code>.
├── src/
│   └── app/
│       ├── login/        # Sign in & Authentication Page
│       ├── dashboard/    # Operational Overview & AI Advisor
│       ├── buyers/       # Client Directory & Accounts Receivable
│       ├── inventory/    # Fabric Roll Ledger & AI Estimator
│       ├── orders/       # Job Orders Management & Creation
│       ├── production/   # Real-time Production Floor Scan Monitor
│       ├── reports/      # Factory Analytics & CSV Data Export
│       ├── workers/      # Workforce Directory & Piece-Rate Balances
│       └── settings/     # Factory Configuration & Plant Identity</code></pre>

💡 Usage Workflow
   Sign In: Log in via the entry portal using contractor credentials.
   Configure Plant Profile: Set up factory unit name, GSTIN, registered address, and default currency in Settings.
   Manage Clients: Add new client profiles and review active purchase orders in Buyers.
   Log Fabric Stock: Record incoming fabric rolls in Inventory and leverage the AI estimator for resource planning.
   Issue Job Orders: Create production job orders under Orders detailing style, target pieces, and fabric requirements.
   Monitor Floor Operations: Log live bundle scans under Production to automatically update worker piece-rate balances in Workers and generate operational logs in Reports.

License

​Copyright © 2026 AI Powered Garments Contractor and Worker Management System (GMS). 

All rights reserved.

This repository is shared for portfolio and demonstration purposes only. Unauthorized copying, modification, distribution, or reuse of this code is strictly prohibited.
