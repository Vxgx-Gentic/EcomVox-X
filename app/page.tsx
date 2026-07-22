import shopifyData from "@/data/shopify_mock.json";
import metaAdsData from "@/data/meta_ads_mock.json";
import { Dashboard } from "@/components/Dashboard";
import type { AdCampaign, SKUItem } from "@/lib/types";

export default function Home() {
  return (
    <Dashboard
      shopifyData={shopifyData as SKUItem[]}
      metaAdsData={metaAdsData as AdCampaign[]}
    />
  );
}
