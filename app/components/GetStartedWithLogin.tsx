"use client";

import { useState } from "react";
import LoginModal from "./LoginModal";

export default function GetStartedWithLogin() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (loading) return;
          setLoading(true);
          window.setTimeout(() => {
            setLoading(false);
            setOpen(true);
          }, 650);
        }}
        className="inline-flex h-11 items-center justify-center rounded-lg bg-[#2F6BFF] px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(47,107,255,0.35)] transition-colors hover:bg-[#3B7CFF] disabled:opacity-70"
        disabled={loading}
      >
        Get Started
      </button>

      {loading ? (
        <div className="fixed inset-0 z-[9999] grid place-items-center">
          <div className="absolute inset-0 bg-black/35" />
          <div className="relative rounded-2xl border border-[var(--panel-border)] bg-[var(--panel-bg)] px-8 py-7 shadow-[0_25px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <div className="text-center">
              <div className="text-xs font-semibold tracking-[0.22em] text-white/50">
                BOHOL SIGNAL MAP
              </div>
              <div className="mt-1 text-sm text-white/70">Preparing sign-in…</div>
            </div>

            <div className="mt-5 grid place-items-center">
              <div className="unique-loader" />
            </div>

            <div className="unique-loader-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      ) : null}

      <LoginModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
