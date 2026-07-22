"use client";

type SourceLabel = "default" | `uploaded: ${string}`;

interface DataUploadPanelProps {
  shopifySource: SourceLabel;
  metaSource: SourceLabel;
  error: string | null;
  onShopifyFile: (file: File) => void;
  onMetaFile: (file: File) => void;
  onReset: () => void;
}

export function DataUploadPanel({
  shopifySource,
  metaSource,
  error,
  onShopifyFile,
  onMetaFile,
  onReset,
}: DataUploadPanelProps) {
  return (
    <section
      className="telemetry-panel flex flex-col gap-3 p-3 sm:p-4"
      aria-label="Mock data upload"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted">
            Data sources
          </h2>
          <p className="mt-1 text-sm text-muted">
            Defaults load automatically. Upload one or both JSON files to play —
            the other side keeps its current data. No live Shopify/Meta accounts.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/samples/shopify_mock.json"
            download
            className="border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-platinum transition-colors hover:bg-white/[0.04]"
          >
            Download Shopify sample
          </a>
          <a
            href="/samples/meta_ads_mock.json"
            download
            className="border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-platinum transition-colors hover:bg-white/[0.04]"
          >
            Download Meta sample
          </a>
          <button
            type="button"
            onClick={onReset}
            className="border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted transition-colors hover:bg-white/[0.04] hover:text-platinum"
          >
            Reset defaults
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex cursor-pointer flex-col gap-2 border border-border bg-obsidian p-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
            Shopify inventory JSON
          </span>
          <span className="font-mono text-xs text-emerald">{shopifySource}</span>
          <input
            type="file"
            accept="application/json,.json"
            className="block w-full text-xs text-muted file:mr-3 file:border file:border-border file:bg-surface file:px-3 file:py-2 file:font-mono file:text-[10px] file:uppercase file:tracking-wider file:text-platinum"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onShopifyFile(file);
              e.target.value = "";
            }}
          />
        </label>

        <label className="flex cursor-pointer flex-col gap-2 border border-border bg-obsidian p-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
            Meta Ads JSON
          </span>
          <span className="font-mono text-xs text-emerald">{metaSource}</span>
          <input
            type="file"
            accept="application/json,.json"
            className="block w-full text-xs text-muted file:mr-3 file:border file:border-border file:bg-surface file:px-3 file:py-2 file:font-mono file:text-[10px] file:uppercase file:tracking-wider file:text-platinum"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onMetaFile(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {error ? (
        <p
          role="alert"
          className="border border-crimson/50 bg-crimson/10 px-3 py-2 font-mono text-xs text-crimson"
        >
          {error}
        </p>
      ) : null}
    </section>
  );
}
