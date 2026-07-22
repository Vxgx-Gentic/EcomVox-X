"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import shopifyData from "@/data/shopify_mock.json";
import metaAdsData from "@/data/meta_ads_mock.json";
import { Dashboard } from "@/components/Dashboard";
import { clearWorkspaceSession, hasWorkspaceSession } from "@/lib/session";
import type { AdCampaign, SKUItem } from "@/lib/types";

export default function WorkspacePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasWorkspaceSession()) {
      router.replace("/");
      return;
    }
    setReady(true);
  }, [router]);

  function handleEndSession() {
    clearWorkspaceSession();
    router.push("/");
  }

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          Opening workspace…
        </p>
      </div>
    );
  }

  return (
    <Dashboard
      defaultShopify={shopifyData as SKUItem[]}
      defaultMeta={metaAdsData as AdCampaign[]}
      onEndSession={handleEndSession}
    />
  );
}
