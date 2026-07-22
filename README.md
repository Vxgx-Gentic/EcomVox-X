# EcomVox - X

Class MVP: unify **Shopify inventory** with **Meta Ads** spend by `SKU_ID`, compute contribution margin, and surface actionable alerts — wasted ad spend on low stock and impending stockouts.

> **Mock data only.** No live Shopify/Meta APIs, OAuth, auth, or paid backend. Drop-in JSON → rules engine → telemetry dashboard.

**Repo:** https://github.com/Vxgx-Gentic/EcomVox-X  
**Live demo:** https://ecomvox-x.vercel.app

## Share / demo

1. Open **https://ecomvox-x.vercel.app** (or run locally).
2. Defaults are already loaded — you can review alerts immediately.
3. Optional: download the sample files from the UI (or `/samples/shopify_mock.json` and `/samples/meta_ads_mock.json`).
4. Edit numbers locally (e.g. set `stock_level` to `3` while that SKU still has `ad_spend` > 0 to force a CRITICAL).
5. Upload **one or both** JSON files in the Data sources panel. The other side keeps its current data (default or previous upload).
6. Use **Reset defaults** to restore the bundled mocks.

You do **not** connect real Shopify or Meta accounts for this class demo.

### Do reviewers need both files?

For a full join/review, both inventory and ads matter. They can upload only Shopify (ads stay default) or only Meta (inventory stays default). Invalid JSON shows an error; the last good data stays on screen.

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
- Browser upload + [`public/samples/`](public/samples/) for shareable play files

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project layout

```
data/           Bundled Shopify + Meta payloads (defaults)
public/samples/ Downloadable copies for reviewers
lib/types.ts    SKUItem, AdCampaign, UnifiedPerformanceRecord
lib/engine.ts   processEcomData + summarizePerformance
lib/validate.ts Upload schema checks
components/     Dashboard, upload panel, KPIs, SKU table
app/            Next.js App Router shell
docs/           Class source PDFs
```

## Out of scope (by design)

Live API SDKs, OAuth, authentication, databases, GA4, paid hosting.
