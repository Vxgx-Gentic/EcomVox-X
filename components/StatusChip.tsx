import type { AlertStatus } from "@/lib/types";

export function StatusChip({ status }: { status: AlertStatus }) {
  if (status === "CRITICAL: WASTED_AD_SPEND") {
    return (
      <span className="inline-block border border-crimson px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-crimson">
        Critical · Wasted Ad
      </span>
    );
  }
  if (status === "WARNING: IMPENDING_STOCKOUT") {
    return (
      <span className="inline-block border border-amber px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber">
        Warning · Stockout
      </span>
    );
  }
  return (
    <span className="inline-block border border-emerald/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald">
      Healthy
    </span>
  );
}
