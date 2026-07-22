import type { UnifiedPerformanceRecord } from "@/lib/types";
import { StatusChip } from "@/components/StatusChip";

type ActionTaken = "PAUSE_AD" | "REORDER";

interface SkuTableProps {
  records: UnifiedPerformanceRecord[];
  actions: Record<string, ActionTaken>;
  onAction: (skuId: string, action: ActionTaken) => void;
}

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDays(n: number) {
  if (!Number.isFinite(n)) return "∞";
  return n.toFixed(1);
}

export function SkuTable({ records, actions, onAction }: SkuTableProps) {
  return (
    <section className="telemetry-panel overflow-hidden" aria-label="SKU performance">
      <div className="flex items-center justify-between border-b border-border px-3 py-2 sm:px-4">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted">
          SKU Performance · Unified
        </h2>
        <span className="font-mono text-[10px] text-muted">
          Sorted by severity
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border font-mono text-[10px] uppercase tracking-wider text-muted">
              <th className="px-3 py-2 font-normal sm:px-4">SKU</th>
              <th className="px-3 py-2 font-normal">Product</th>
              <th className="px-3 py-2 font-normal text-right">Stock</th>
              <th className="px-3 py-2 font-normal text-right">Days Supply</th>
              <th className="px-3 py-2 font-normal text-right">Ad Spend</th>
              <th className="px-3 py-2 font-normal text-right">Margin</th>
              <th className="px-3 py-2 font-normal">Status</th>
              <th className="px-3 py-2 font-normal sm:px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((row) => {
              const taken = actions[row.SKU_ID];
              return (
                <tr
                  key={row.SKU_ID}
                  className="border-b border-border last:border-b-0 hover:bg-white/[0.02]"
                >
                  <td className="px-3 py-2.5 font-mono text-xs text-muted sm:px-4">
                    {row.SKU_ID}
                  </td>
                  <td className="max-w-[200px] truncate px-3 py-2.5 text-platinum">
                    {row.product_name}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums">
                    {row.stock_level}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums">
                    {formatDays(row.days_of_supply)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums">
                    {formatUsd(row.ad_spend)}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-mono tabular-nums ${
                      row.contribution_margin >= 0
                        ? "text-emerald"
                        : "text-crimson"
                    }`}
                  >
                    {formatUsd(row.contribution_margin)}
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusChip status={row.status} />
                  </td>
                  <td className="px-3 py-2.5 sm:px-4">
                    {taken ? (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-emerald">
                        {taken === "PAUSE_AD" ? "Ad paused" : "Reorder queued"}
                      </span>
                    ) : row.recommended_action === "PAUSE_AD" ? (
                      <button
                        type="button"
                        onClick={() => onAction(row.SKU_ID, "PAUSE_AD")}
                        className="border border-crimson px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-crimson transition-colors hover:bg-crimson/10"
                      >
                        Pause Ad
                      </button>
                    ) : row.recommended_action === "REORDER" ? (
                      <button
                        type="button"
                        onClick={() => onAction(row.SKU_ID, "REORDER")}
                        className="border border-amber px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-amber transition-colors hover:bg-amber/10"
                      >
                        Reorder
                      </button>
                    ) : (
                      <span className="font-mono text-[10px] text-muted">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
