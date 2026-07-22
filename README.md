# EcomVox - X

Unify **Shopify inventory** with **Meta Ads** spend by `SKU_ID`, compute contribution margin, and surface actionable alerts — wasted ad spend on low stock and impending stockouts.

**Cohort path:** Landing → Onboarding → Workspace. Numbers appear only after you connect the demo store. When you’re done, **End session** returns to the landing for the next reviewer.

**Repo:** https://github.com/Vxgx-Gentic/EcomVox-X  
**Live demo:** https://ecomvox-x.vercel.app

## Share / demo (reviewers)

1. Open **https://ecomvox-x.vercel.app** — product intro only (no KPIs yet).
2. Click **Start here** and walk through onboarding:
   - what the tool is for
   - how to read KPIs and alert statuses
   - how to act (Pause Ad / Reorder)
   - connect the demo store
3. **Connect demo store · Enter workspace** opens the live tool with inventory + ads already joined.
4. Review severity-sorted SKUs, try actions, optionally download/edit/upload JSON from **Data sources**.
5. Click **End session** (bottom-left) to clear the session and return to the landing.

You do **not** need real Shopify or Meta accounts. Invalid uploads show an error and keep the last good data. **Reload demo store** restores the bundled samples without leaving the workspace.

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
- Session gate via `sessionStorage` ([`lib/session.ts`](lib/session.ts)) — `/workspace` redirects home without an active session
- Sample payloads: [`data/shopify_mock.json`](data/shopify_mock.json), [`data/meta_ads_mock.json`](data/meta_ads_mock.json)
- Browser upload + [`public/samples/`](public/samples/) for shareable play files

> **Developers:** UI speaks “demo store,” not “mock.” Payloads are still local JSON — no live Shopify/Meta APIs, OAuth, auth, or paid backend.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project layout

```
data/           Bundled Shopify + Meta payloads (demo store)
public/samples/ Downloadable copies for reviewers
lib/types.ts    SKUItem, AdCampaign, UnifiedPerformanceRecord
lib/engine.ts   processEcomData + summarizePerformance
lib/validate.ts Upload schema checks
lib/session.ts  Workspace session start / clear / gate
components/     Landing, Onboarding, Dashboard, upload, KPIs, table
app/            / · /onboarding · /workspace
docs/           Class source PDFs
```

## Out of scope (by design)

Live API SDKs, OAuth, authentication, databases, GA4.
