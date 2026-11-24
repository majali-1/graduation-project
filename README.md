# InsightFlow — Customer Intelligence Frontend

A responsive React + TypeScript dashboard skeleton. All analytics remain empty and no mock records are included.

## Stack
- React + TypeScript + Vite
- Tailwind CSS
- Recharts dependency included for future chart integration
- Lucide React icons

## Run locally
1. Install Node.js 18+.
2. Unzip this project.
3. From the project folder run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the Vite local URL shown in the terminal.

## Build
```bash
npm run build
npm run preview
```

## Pages
- Executive Overview
- Sales Performance
- Customer Intelligence
- Customer 360
- Customer Risk & Retention
- Cross-Selling Opportunities
- Customer Growth Opportunities
- Data Management

## Frontend-only notes
- Navigation, filters, customer 360 tabs, mapping selects, upload file selection, modal open/close, and empty table controls are UI-only.
- File selection does not read, parse, validate, or process contents.
- Charts, tables, KPIs, risk, segmentation, rankings, and recommendations remain placeholders.
- No API, backend, database, model, or fabricated analytical data is included.

## Suggested next steps
1. Finalize business field definitions and source column mapping.
2. Connect data ingestion and customer/product master data.
3. Populate visualizations with real data.
4. Add analytics, scoring, and recommendation logic in a later phase.
