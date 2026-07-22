"use client";

import Link from "next/link";

export function Landing() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent),radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(255,46,76,0.08),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
      />

      <main className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16 sm:px-8">
        <p
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald opacity-0 animate-[fade-up_0.6s_ease_forwards]"
          style={{ animationDelay: "0.05s" }}
        >
          Analyst workspace · Shopify + Meta
        </p>
        <h1
          className="mt-4 text-5xl font-semibold tracking-tight text-platinum opacity-0 animate-[fade-up_0.7s_ease_forwards] sm:text-6xl md:text-7xl"
          style={{ animationDelay: "0.15s" }}
        >
          EcomVox - X
        </h1>
        <p
          className="mt-6 max-w-xl text-lg leading-relaxed text-muted opacity-0 animate-[fade-up_0.7s_ease_forwards] sm:text-xl"
          style={{ animationDelay: "0.28s" }}
        >
          Unify store inventory with ad spend so you catch wasted ads and
          stockouts before they burn margin.
        </p>
        <div
          className="mt-10 opacity-0 animate-[fade-up_0.7s_ease_forwards]"
          style={{ animationDelay: "0.42s" }}
        >
          <Link
            href="/onboarding"
            className="inline-flex min-h-12 items-center border border-emerald bg-emerald/10 px-8 font-mono text-xs uppercase tracking-[0.2em] text-emerald transition-colors hover:bg-emerald/20"
          >
            Start here
          </Link>
        </div>
      </main>
    </div>
  );
}
