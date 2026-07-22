import type {
  AdCampaign,
  AlertStatus,
  SKUItem,
  UnifiedPerformanceRecord,
} from "./types";

const STOCKOUT_DAYS_THRESHOLD = 5;
const CRITICAL_STOCK_THRESHOLD = 10;

interface AggregatedAds {
  ad_spend: number;
  impressions: number;
  conversions: number;
}

function aggregateAdsBySku(metaAdsData: AdCampaign[]): Map<string, AggregatedAds> {
  const map = new Map<string, AggregatedAds>();

  for (const campaign of metaAdsData) {
    const existing = map.get(campaign.SKU_ID) ?? {
      ad_spend: 0,
      impressions: 0,
      conversions: 0,
    };
    existing.ad_spend += campaign.ad_spend;
    existing.impressions += campaign.impressions;
    existing.conversions += campaign.conversions;
    map.set(campaign.SKU_ID, existing);
  }

  return map;
}

function daysOfSupply(stock_level: number, avg_daily_units: number): number {
  if (avg_daily_units <= 0) return Number.POSITIVE_INFINITY;
  return stock_level / avg_daily_units;
}

function evaluateStatus(
  stock_level: number,
  ad_spend: number,
  days: number
): { status: AlertStatus; recommended_action: UnifiedPerformanceRecord["recommended_action"] } {
  const wastedAdSpend =
    stock_level < CRITICAL_STOCK_THRESHOLD && ad_spend > 0;
  const impendingStockout = days < STOCKOUT_DAYS_THRESHOLD;

  // CRITICAL overrides WARNING when both fire
  if (wastedAdSpend) {
    return {
      status: "CRITICAL: WASTED_AD_SPEND",
      recommended_action: "PAUSE_AD",
    };
  }
  if (impendingStockout) {
    return {
      status: "WARNING: IMPENDING_STOCKOUT",
      recommended_action: "REORDER",
    };
  }
  return { status: "HEALTHY", recommended_action: "NONE" };
}

/**
 * Join Shopify inventory with Meta ads on SKU_ID, compute contribution margin,
 * and flag wasted-ad / stockout conditions.
 */
export function processEcomData(
  shopifyData: SKUItem[],
  metaAdsData: AdCampaign[]
): UnifiedPerformanceRecord[] {
  const adsBySku = aggregateAdsBySku(metaAdsData);

  return shopifyData.map((sku) => {
    const ads = adsBySku.get(sku.SKU_ID) ?? {
      ad_spend: 0,
      impressions: 0,
      conversions: 0,
    };

    const revenue = sku.units_sold * sku.retail_price;
    const cogs = sku.unit_cost * sku.units_sold;
    const contribution_margin = revenue - ads.ad_spend - cogs;
    const days = daysOfSupply(sku.stock_level, sku.avg_daily_units);
    const { status, recommended_action } = evaluateStatus(
      sku.stock_level,
      ads.ad_spend,
      days
    );

    return {
      SKU_ID: sku.SKU_ID,
      product_name: sku.product_name,
      category: sku.category,
      stock_level: sku.stock_level,
      unit_cost: sku.unit_cost,
      retail_price: sku.retail_price,
      units_sold: sku.units_sold,
      avg_daily_units: sku.avg_daily_units,
      revenue,
      ad_spend: ads.ad_spend,
      impressions: ads.impressions,
      conversions: ads.conversions,
      cogs,
      contribution_margin,
      days_of_supply: days,
      status,
      recommended_action,
    };
  });
}

export function summarizePerformance(records: UnifiedPerformanceRecord[]) {
  const critical = records.filter((r) => r.status.startsWith("CRITICAL"));
  const warnings = records.filter((r) => r.status.startsWith("WARNING"));
  const adSpendAtRisk = critical.reduce((sum, r) => sum + r.ad_spend, 0);
  const totalMargin = records.reduce((sum, r) => sum + r.contribution_margin, 0);

  return {
    criticalCount: critical.length,
    warningCount: warnings.length,
    adSpendAtRisk,
    totalMargin,
    skuCount: records.length,
  };
}
