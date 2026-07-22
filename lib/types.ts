/** Shopify inventory / sales row */
export interface SKUItem {
  SKU_ID: string;
  product_name: string;
  category: string;
  stock_level: number;
  unit_cost: number;
  retail_price: number;
  /** Units sold in the reporting window */
  units_sold: number;
  /** Average daily sell-through used for burn / days-of-supply */
  avg_daily_units: number;
}

/** Meta Ads campaign targeting a SKU */
export interface AdCampaign {
  campaign_id: string;
  campaign_name: string;
  SKU_ID: string;
  ad_spend: number;
  impressions: number;
  conversions: number;
}

export type AlertStatus =
  | "CRITICAL: WASTED_AD_SPEND"
  | "WARNING: IMPENDING_STOCKOUT"
  | "HEALTHY";

/** Unified per-SKU performance after join + rules engine */
export interface UnifiedPerformanceRecord {
  SKU_ID: string;
  product_name: string;
  category: string;
  stock_level: number;
  unit_cost: number;
  retail_price: number;
  units_sold: number;
  avg_daily_units: number;
  revenue: number;
  ad_spend: number;
  impressions: number;
  conversions: number;
  /** COGS for the period = unit_cost * units_sold */
  cogs: number;
  /** Revenue - Ad Spend - COGS */
  contribution_margin: number;
  /** stock_level / avg_daily_units (Infinity if no burn) */
  days_of_supply: number;
  status: AlertStatus;
  recommended_action: "PAUSE_AD" | "REORDER" | "NONE";
}
