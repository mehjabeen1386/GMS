# GMS - Garment Inventory & AI Analytics System
A modern, high-performance web application designed for garment contractors and textile warehouses to manage fabric rolls, track stock meters, and leverage built-in AI modules for smart resource allocation and labor efficiency.

## 🚀 Key Features
**Fabric Roll Ledger:** Comprehensive tracking of active and deleted rolls, remaining meters, and category details with robust validation.

**FabricMind AI Oracle:** Futuristic autonomous stock auditing tool featuring live health scoring, risk scanners, and automated waste reduction insights.

**Order Feasibility Simulator:** Instantly test client order demands against real-time warehouse stock vectors with optimal roll allocation suggestions.

**Worker Productivity & Performance Prediction:** Floor labor efficiency tracker designed to predict shift bottlenecks and optimize cutting outputs.

## 🛠️ Tech Stack
**Framework/Library:** React / Next.js (App Router)
**Language:** TypeScript
**Styling:** Tailwind CSS
**Icons:** Lucide React
**Validation:** Zod

## 📦 Getting Started
Follow these instructions to get a local copy up and running on your machine.

### Prerequisites
Ensure you have Node.js (version 18.x or higher) installed on your system.

### Installation & Setup
1. **Clone the repository**
   git clone [https://github.com/your-username/garment-inventory-system.git](https://github.com/your-username/garment-inventory-system.git)
   cd garment-inventory-system

1) Navigate to the frontend directory (if structured inside a frontend folder)
   cd frontend

2) Install dependencies
   npm install

4) Run the development server
   npm run dev
   
6) Open http://localhost:3000 in your browser to view the application.

Project Structure
```text
src/
├── app/
│   ├── inventory/
│   │   ├── page.tsx               # Main Inventory Ledger Page
│   │   ├── AIInventoryEstimator.tsx # FabricMind AI Oracle Component
│   │   ├── AIOrderSimulator.tsx     # Order Feasibility Simulator Component
│   │   └── AIWorkerProductivity.tsx # Worker Productivity Component
│   └── layout.tsx                 # Root Layout & Providers


Usage
1) ​Navigate to the Inventory Dashboard to view active fabric rolls and key performance indicators.
2) ​Use the AI Oracle widget for automated stock health audits and waste reduction insights.
3) ​Test custom order lengths in the Order Feasibility Simulator to instantly determine roll allocation plans.
4) ​Monitor floor performance metrics via the Worker Productivity module.
