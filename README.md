# EcomVox - X

Class MVP: unify **Shopify inventory** with **Meta Ads** spend by `SKU_ID`, compute contribution margin, and surface actionable alerts — wasted ad spend on low stock and impending stockouts.

> **Mock data only.** No live Shopify/Meta APIs, OAuth, auth, or paid backend. Drop-in JSON → rules engine → telemetry dashboard.

**Repo:** https://github.com/Vxgx-Gentic/EcomVox-X

## Problem

An e-commerce analyst struggles with stale performance reporting because multi-platform sales, inventory, and marketing data are not unified at ingestion — which means wasted ad budget, preventable stockouts, and lost margin.

## Solution

EcomVox - X joins store inventory with ad campaign spend, shows contribution margin per SKU, and alerts when ads drive traffic to critically low stock or when burn rate implies a stockout within 5 days.

## Core engine

`processEcomData(shopifyData, metaAdsData)` in [`lib/engine.ts`](lib/engine.ts):

1. Aggregate Meta campaigns by `SKU_ID`
2. Join to Shopify inventory
3. `contribution_margin = revenue - ad_spend - cogs` where `revenue = units_sold * retail_price` and `cogs = unit_cost * units_sold`
4. Alerts:
   - `stock_level < 10` AND `ad_spend > 0` → `CRITICAL: WASTED_AD_SPEND`
   - `days_of_supply < 5` → `WARNING: IMPENDING_STOCKOUT` (CRITICAL wins if both)

## Stack

- Next.js (App Router) · TypeScript · Tailwind CSS
- Pure React state (no Redux/Zustand)
- Local mocks: [`data/shopify_mock.json`](data/shopify_mock.json), [`data/meta_ads_mock.json`](data/meta_ads_mock.json)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project layout

```
data/           Mock Shopify + Meta payloads
lib/types.ts    SKUItem, AdCampaign, UnifiedPerformanceRecord
lib/engine.ts   processEcomData + summarizePerformance
components/     Dashboard, KPIs, SKU table, status chips
app/            Next.js App Router shell
docs/           Class source PDFs (role research / product card)
```

## Out of scope (by design)

Live API SDKs, OAuth, authentication, databases, GA4, paid hosting.
