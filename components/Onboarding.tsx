"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { startWorkspaceSession } from "@/lib/session";

const STEPS = [
  {
    id: "purpose",
    title: "What it’s for",
    body: [
      "You are the e-commerce analyst. Sales live in Shopify; spend lives in Meta Ads — and they rarely talk to each other.",
      "EcomVox - X joins inventory and campaigns on SKU, computes contribution margin, and surfaces where ads are wasting budget or stock is about to run out.",
    ],
  },
  {
    id: "reading",
    title: "What you’re reading",
    body: [
      "The KPI strip shows Ad Spend at Risk, critical alerts, stockout warnings, total contribution margin, and how many SKUs are tracked.",
      "Critical · Wasted Ad means stock is under 10 units while ads are still spending. Warning · Stockout means days of supply is under 5. Healthy SKUs need no action.",
    ],
  },
  {
    id: "act",
    title: "How you act",
    body: [
      "On each alert row, take the recommended action: Pause Ad when spend is hitting empty shelves, or Reorder when supply is burning down.",
      "Later you can upload your own Shopify inventory or Meta Ads JSON to explore different scenarios. For this session, you’ll connect a demo store first.",
    ],
  },
  {
    id: "connect",
    title: "Connect sources",
    body: [
      "Connect the demo store’s Shopify inventory and Meta Ads. That loads a live workspace with unified SKU performance — the same view you’d use on a real catalog.",
      "When you’re finished reviewing, use End session in the workspace to return here for the next cohort member.",
    ],
  },
] as const;

export function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function handleEnterWorkspace() {
    startWorkspaceSession();
    router.push("/workspace");
  }

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_0%_0%,rgba(16,185,129,0.08),transparent)]"
      />

      <header className="relative border-b border-border px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl items-baseline justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              Onboarding
            </p>
            <p className="text-lg font-semibold tracking-tight text-platinum">
              EcomVox - X
            </p>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
            Step {step + 1} / {STEPS.length}
          </p>
        </div>
      </header>

      <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
        <div
          className="mb-8 flex gap-2"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-label="Onboarding progress"
        >
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`h-0.5 flex-1 transition-colors ${
                i <= step ? "bg-emerald" : "bg-border"
              }`}
            />
          ))}
        </div>

        <h1
          key={current.id}
          className="text-3xl font-semibold tracking-tight text-platinum opacity-0 animate-[fade-up_0.45s_ease_forwards] sm:text-4xl"
        >
          {current.title}
        </h1>
        <div
          key={`${current.id}-body`}
          className="mt-6 space-y-4 opacity-0 animate-[fade-up_0.5s_ease_forwards]"
          style={{ animationDelay: "0.08s" }}
        >
          {current.body.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-muted sm:text-lg">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-12">
          {step === 0 ? (
            <Link
              href="/"
              className="font-mono text-[10px] uppercase tracking-wider text-muted transition-colors hover:text-platinum"
            >
              Back to landing
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="font-mono text-[10px] uppercase tracking-wider text-muted transition-colors hover:text-platinum"
            >
              Back
            </button>
          )}

          {isLast ? (
            <button
              type="button"
              onClick={handleEnterWorkspace}
              className="inline-flex min-h-12 items-center border border-emerald bg-emerald/10 px-6 font-mono text-xs uppercase tracking-[0.2em] text-emerald transition-colors hover:bg-emerald/20"
            >
              Connect demo store · Enter workspace
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex min-h-12 items-center border border-platinum/40 px-6 font-mono text-xs uppercase tracking-[0.2em] text-platinum transition-colors hover:bg-white/[0.04]"
            >
              Next
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
