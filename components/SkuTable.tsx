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
      <div className="flex flex-col gap-1 border-b border-border px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted">
          SKU Performance · Unified
        </h2>
        <span className="font-mono text-[10px] text-muted sm:hidden">
          Swipe table →
        </span>
        <span className="hidden font-mono text-[10px] text-muted sm:inline">
          Sorted by severity
        </span>
      </div>

      {records.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-muted">
          Connect sources to see performance.
        </p>
      ) : (
      <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
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
                  <td className="px-3 py-3 font-mono text-xs text-muted sm:px-4 sm:py-2.5">
                    {row.SKU_ID}
                  </td>
                  <td className="max-w-[160px] truncate px-3 py-3 text-platinum sm:max-w-[200px] sm:py-2.5">
                    {row.product_name}
                  </td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums sm:py-2.5">
                    {row.stock_level}
                  </td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums sm:py-2.5">
                    {formatDays(row.days_of_supply)}
                  </td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums sm:py-2.5">
                    {formatUsd(row.ad_spend)}
                  </td>
                  <td
                    className={`px-3 py-3 text-right font-mono tabular-nums sm:py-2.5 ${
                      row.contribution_margin >= 0
                        ? "text-emerald"
                        : "text-crimson"
                    }`}
                  >
                    {formatUsd(row.contribution_margin)}
                  </td>
                  <td className="px-3 py-3 sm:py-2.5">
                    <StatusChip status={row.status} />
                  </td>
                  <td className="px-3 py-3 sm:px-4 sm:py-2.5">
                    {taken ? (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-emerald">
                        {taken === "PAUSE_AD" ? "Ad paused" : "Reorder queued"}
                      </span>
                    ) : row.recommended_action === "PAUSE_AD" ? (
                      <button
                        type="button"
                        onClick={() => onAction(row.SKU_ID, "PAUSE_AD")}
                        className="min-h-10 border border-crimson px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-crimson transition-colors hover:bg-crimson/10 sm:min-h-0 sm:px-2 sm:py-1"
                      >
                        Pause Ad
                      </button>
                    ) : row.recommended_action === "REORDER" ? (
                      <button
                        type="button"
                        onClick={() => onAction(row.SKU_ID, "REORDER")}
                        className="min-h-10 border border-amber px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-amber transition-colors hover:bg-amber/10 sm:min-h-0 sm:px-2 sm:py-1"
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
      )}
    </section>
  );
}
