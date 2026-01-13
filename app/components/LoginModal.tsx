"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function LoginModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [authError, setAuthError] = useState("");

  const emailError = useMemo(() => {
    if (!submitted) return "";
    if (!email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "Enter a valid email";
    return "";
  }, [email, submitted]);

  const passwordError = useMemo(() => {
    if (!submitted) return "";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  }, [password, submitted]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    setAuthError("");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000]">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close login modal"
        onClick={onClose}
      />

      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel-bg)] p-5 shadow-[0_25px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-semibold text-white/90">Sign in</div>
              <div className="mt-1 text-sm text-white/60">
                Use your account to continue to the dashboard.
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M18 6l-12 12"
                />
              </svg>
            </button>
          </div>

          <form
            className="mt-5 grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
              setAuthError("");
              if (emailError || passwordError) return;

              const normalizedEmail = email.trim().toLowerCase();

              // Default account (temporary)
              const defaultEmail = "admin@bohol.com";
              const defaultPassword = "admin123";

              if (normalizedEmail !== defaultEmail || password !== defaultPassword) {
                setAuthError("Invalid email or password");
                return;
              }

              window.localStorage.setItem("bohol_auth", "1");
              onClose();
              router.push("/dashboard");
            }}
          >
            {authError ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                {authError}
              </div>
            ) : null}
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-white/60">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                className="h-11 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-white/85 outline-none transition-colors focus:border-white/20"
              />
              {emailError ? (
                <span className="text-xs text-rose-300">{emailError}</span>
              ) : null}
            </label>

            <label className="grid gap-1">
              <span className="text-xs font-semibold text-white/60">Password</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
                className="h-11 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-white/85 outline-none transition-colors focus:border-white/20"
              />
              {passwordError ? (
                <span className="text-xs text-rose-300">{passwordError}</span>
              ) : null}
            </label>

            <button
              type="submit"
              className="mt-1 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#2F6BFF] px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(47,107,255,0.35)] transition-colors hover:bg-[#3B7CFF]"
            >
              Sign in
            </button>

            <div className="mt-1 text-center text-xs text-white/55">
              Don’t have an account? <a href="#" className="font-semibold text-white/80 hover:text-white">Request access</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
