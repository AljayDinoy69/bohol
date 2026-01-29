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
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
            </svg>
            Loading...
          </>
        ) : (
          "Get Started"
        )}
      </button>

      <LoginModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
