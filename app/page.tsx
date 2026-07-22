import shopifyData from "@/data/shopify_mock.json";
import metaAdsData from "@/data/meta_ads_mock.json";
import { Dashboard } from "@/components/Dashboard";
import type { AdCampaign, SKUItem } from "@/lib/types";

export default function Home() {
  return (
    <Dashboard
      defaultShopify={shopifyData as SKUItem[]}
      defaultMeta={metaAdsData as AdCampaign[]}
    />
  );
}
