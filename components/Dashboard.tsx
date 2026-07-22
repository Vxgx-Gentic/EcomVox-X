"use client";

import { useMemo, useState } from "react";
import { processEcomData, summarizePerformance } from "@/lib/engine";
import type { AdCampaign, SKUItem, UnifiedPerformanceRecord } from "@/lib/types";
import { KpiStrip } from "@/components/KpiStrip";
import { SkuTable } from "@/components/SkuTable";

type ActionTaken = "PAUSE_AD" | "REORDER";

interface DashboardProps {
  shopifyData: SKUItem[];
  metaAdsData: AdCampaign[];
}

export function Dashboard({ shopifyData, metaAdsData }: DashboardProps) {
  const records = useMemo(
    () => processEcomData(shopifyData, metaAdsData),
    [shopifyData, metaAdsData]
  );

  const summary = useMemo(() => summarizePerformance(records), [records]);

  const [actions, setActions] = useState<Record<string, ActionTaken>>({});

  function handleAction(skuId: string, action: ActionTaken) {
    setActions((prev) => ({ ...prev, [skuId]: action }));
  }

  const sorted: UnifiedPerformanceRecord[] = useMemo(() => {
    const rank = (s: string) =>
      s.startsWith("CRITICAL") ? 0 : s.startsWith("WARNING") ? 1 : 2;
    return [...records].sort((a, b) => rank(a.status) - rank(b.status));
  }, [records]);

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              Mock Pipeline · Shopify + Meta
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-platinum sm:text-3xl">
              EcomVox - X
            </h1>
          </div>
          <p className="font-mono text-xs text-emerald">
            ● Mock Shopify + Meta connected
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        <KpiStrip summary={summary} />
        <SkuTable
          records={sorted}
          actions={actions}
          onAction={handleAction}
        />
      </main>
    </div>
  );
}
