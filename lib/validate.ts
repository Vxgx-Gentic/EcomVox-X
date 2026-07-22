import type { AdCampaign, SKUItem } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

export function parseJsonFile(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("File is not valid JSON.");
  }
}

export function validateShopifyData(data: unknown): SKUItem[] {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Shopify file must be a non-empty JSON array.");
  }

  return data.map((row, index) => {
    if (!isRecord(row)) {
      throw new Error(`Shopify row ${index} is not an object.`);
    }

    const required = [
      "SKU_ID",
      "product_name",
      "category",
      "stock_level",
      "unit_cost",
      "retail_price",
      "units_sold",
      "avg_daily_units",
    ] as const;

    for (const key of required) {
      if (!(key in row)) {
        throw new Error(`Shopify row ${index} missing "${key}".`);
      }
    }

    if (
      !isString(row.SKU_ID) ||
      !isString(row.product_name) ||
      !isString(row.category) ||
      !isNumber(row.stock_level) ||
      !isNumber(row.unit_cost) ||
      !isNumber(row.retail_price) ||
      !isNumber(row.units_sold) ||
      !isNumber(row.avg_daily_units)
    ) {
      throw new Error(
        `Shopify row ${index} has invalid field types (check strings/numbers).`
      );
    }

    return {
      SKU_ID: row.SKU_ID,
      product_name: row.product_name,
      category: row.category,
      stock_level: row.stock_level,
      unit_cost: row.unit_cost,
      retail_price: row.retail_price,
      units_sold: row.units_sold,
      avg_daily_units: row.avg_daily_units,
    };
  });
}

export function validateMetaAdsData(data: unknown): AdCampaign[] {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Meta Ads file must be a non-empty JSON array.");
  }

  return data.map((row, index) => {
    if (!isRecord(row)) {
      throw new Error(`Meta Ads row ${index} is not an object.`);
    }

    const required = [
      "campaign_id",
      "campaign_name",
      "SKU_ID",
      "ad_spend",
      "impressions",
      "conversions",
    ] as const;

    for (const key of required) {
      if (!(key in row)) {
        throw new Error(`Meta Ads row ${index} missing "${key}".`);
      }
    }

    if (
      !isString(row.campaign_id) ||
      !isString(row.campaign_name) ||
      !isString(row.SKU_ID) ||
      !isNumber(row.ad_spend) ||
      !isNumber(row.impressions) ||
      !isNumber(row.conversions)
    ) {
      throw new Error(
        `Meta Ads row ${index} has invalid field types (check strings/numbers).`
      );
    }

    return {
      campaign_id: row.campaign_id,
      campaign_name: row.campaign_name,
      SKU_ID: row.SKU_ID,
      ad_spend: row.ad_spend,
      impressions: row.impressions,
      conversions: row.conversions,
    };
  });
}
