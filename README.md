# Finflow — Finance Dashboard

A clean, interactive finance dashboard built with React, Tailwind CSS, Zustand, and Recharts.

## Quick Start

```bash
npm install
npm run dev
```

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 + Vite | Core framework + build tooling |
| Tailwind CSS v3 | Utility-first styling with dark mode |
| Zustand | State management (persisted to localStorage) |
| Recharts | Bar, line, donut charts |
| React Router v6 | Client-side routing |
| date-fns | Date formatting |
| Lucide React | Icons |

## Project Structure

```
src/
├── data/mockData.js              # Mock transactions, monthly data, budgets
├── store/useStore.js             # Zustand store — state + computed selectors
├── components/
│   ├── Sidebar.jsx               # Responsive navigation
│   ├── Topbar.jsx                # Role switcher + dark mode
│   ├── SummaryCard.jsx           # Metric card component
│   └── modals/TransactionModal.jsx
└── pages/
    ├── Overview.jsx              # Summary cards + charts
    ├── Transactions.jsx          # Table with filter/sort/search
    ├── Insights.jsx              # Spending analysis
    └── Budget.jsx                # Budgets + goals
```

## Features

- **Overview** — Balance, income, expenses, savings rate + 3 charts
- **Transactions** — Search, filter by category/type, sort, CSV export; Admin can add/edit/delete
- **Insights** — Month-over-month comparison, category rankings, savings rate analysis
- **Budget & Goals** — Per-category progress bars with traffic-light alerts + savings goals
- **Role-Based UI** — Viewer (read-only) vs Admin (full access), switchable live
- **Dark Mode** — Persisted to localStorage
- **Responsive** — Mobile sidebar with overlay, works on all screen sizes

## Role-Based UI

| Feature | Viewer | Admin |
|---|---|---|
| View data | ✅ | ✅ |
| Add/Edit/Delete transactions | ❌ | ✅ |
| Edit budgets | ❌ | ✅ |
| Export CSV | ✅ | ✅ |

Switch roles via the toggle in the top navbar — no login required (frontend simulation).

## State Management

All state in `src/store/useStore.js` using Zustand with `persist` middleware:
- `transactions[]` — full list, CRUD operations
- `filters` — search, category, type, sortBy
- `budgets[]` — per-category monthly limits
- `role` — 'admin' | 'viewer'
- `darkMode` — boolean
- Computed selectors: `getFilteredTransactions()`, `getSummary()`, `getCategoryBreakdown()`

## 📦 Build

```bash
npm run build
```
