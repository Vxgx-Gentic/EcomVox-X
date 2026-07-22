interface Summary {
  criticalCount: number;
  warningCount: number;
  adSpendAtRisk: number;
  totalMargin: number;
  skuCount: number;
}

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function KpiStrip({ summary }: { summary: Summary }) {
  const items = [
    {
      label: "Ad Spend at Risk",
      value: formatUsd(summary.adSpendAtRisk),
      tone: "text-crimson",
    },
    {
      label: "Critical Alerts",
      value: String(summary.criticalCount),
      tone: "text-crimson",
    },
    {
      label: "Stockout Warnings",
      value: String(summary.warningCount),
      tone: "text-amber",
    },
    {
      label: "Contribution Margin",
      value: formatUsd(summary.totalMargin),
      tone: summary.totalMargin >= 0 ? "text-emerald" : "text-crimson",
    },
    {
      label: "SKUs Tracked",
      value: String(summary.skuCount),
      tone: "text-platinum",
    },
  ];

  return (
    <section
      aria-label="KPI summary"
      className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-5"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="telemetry-panel border-0 bg-surface px-3 py-3 sm:px-4"
        >
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
            {item.label}
          </p>
          <p className={`mt-1 font-mono text-xl tabular-nums ${item.tone}`}>
            {item.value}
          </p>
        </div>
      ))}
    </section>
  );
}
