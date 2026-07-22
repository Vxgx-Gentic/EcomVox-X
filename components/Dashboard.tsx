"use client";

import { useMemo, useState } from "react";
import { processEcomData, summarizePerformance } from "@/lib/engine";
import {
  parseJsonFile,
  validateMetaAdsData,
  validateShopifyData,
} from "@/lib/validate";
import type { AdCampaign, SKUItem, UnifiedPerformanceRecord } from "@/lib/types";
import { DataUploadPanel } from "@/components/DataUploadPanel";
import { KpiStrip } from "@/components/KpiStrip";
import { SkuTable } from "@/components/SkuTable";

type ActionTaken = "PAUSE_AD" | "REORDER";
type SourceLabel = "demo store" | `uploaded: ${string}`;

interface DashboardProps {
  defaultShopify: SKUItem[];
  defaultMeta: AdCampaign[];
  onEndSession: () => void;
}

async function readFileText(file: File): Promise<string> {
  return file.text();
}

export function Dashboard({
  defaultShopify,
  defaultMeta,
  onEndSession,
}: DashboardProps) {
  const [shopifyData, setShopifyData] = useState<SKUItem[]>(defaultShopify);
  const [metaAdsData, setMetaAdsData] = useState<AdCampaign[]>(defaultMeta);
  const [shopifySource, setShopifySource] = useState<SourceLabel>("demo store");
  const [metaSource, setMetaSource] = useState<SourceLabel>("demo store");
  const [error, setError] = useState<string | null>(null);
  const [actions, setActions] = useState<Record<string, ActionTaken>>({});

  const records = useMemo(
    () => processEcomData(shopifyData, metaAdsData),
    [shopifyData, metaAdsData]
  );

  const summary = useMemo(() => summarizePerformance(records), [records]);

  const sorted: UnifiedPerformanceRecord[] = useMemo(() => {
    const rank = (s: string) =>
      s.startsWith("CRITICAL") ? 0 : s.startsWith("WARNING") ? 1 : 2;
    return [...records].sort((a, b) => rank(a.status) - rank(b.status));
  }, [records]);

  function handleAction(skuId: string, action: ActionTaken) {
    setActions((prev) => ({ ...prev, [skuId]: action }));
  }

  async function handleShopifyFile(file: File) {
    try {
      const text = await readFileText(file);
      const parsed = parseJsonFile(text);
      const validated = validateShopifyData(parsed);
      setShopifyData(validated);
      setShopifySource(`uploaded: ${file.name}`);
      setActions({});
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load Shopify file.");
    }
  }

  async function handleMetaFile(file: File) {
    try {
      const text = await readFileText(file);
      const parsed = parseJsonFile(text);
      const validated = validateMetaAdsData(parsed);
      setMetaAdsData(validated);
      setMetaSource(`uploaded: ${file.name}`);
      setActions({});
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load Meta Ads file.");
    }
  }

  function handleReloadDemoStore() {
    setShopifyData(defaultShopify);
    setMetaAdsData(defaultMeta);
    setShopifySource("demo store");
    setMetaSource("demo store");
    setActions({});
    setError(null);
  }

  return (
    <div className="flex flex-1 flex-col pb-16">
      <header className="border-b border-border px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              Demo store · Shopify + Meta
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-platinum sm:text-3xl">
              EcomVox - X
            </h1>
          </div>
          <p className="font-mono text-xs text-emerald">
            ● Connected · demo sources
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        <DataUploadPanel
          shopifySource={shopifySource}
          metaSource={metaSource}
          error={error}
          onShopifyFile={handleShopifyFile}
          onMetaFile={handleMetaFile}
          onReloadDemoStore={handleReloadDemoStore}
        />
        <KpiStrip summary={summary} />
        <SkuTable
          records={sorted}
          actions={actions}
          onAction={handleAction}
        />
      </main>

      <div className="fixed bottom-0 left-0 z-10 p-4 sm:p-5">
        <button
          type="button"
          onClick={onEndSession}
          className="border border-border bg-obsidian/90 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted backdrop-blur-sm transition-colors hover:border-platinum/30 hover:text-platinum"
        >
          End session
        </button>
      </div>
    </div>
  );
}
