"use client";

import { ToastProvider } from "@/app/hooks/useToast";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
