"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, JSX } from "react";
import { ToastMessage, ToastContainer } from "../components/Toast";

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (message: string, type: "success" | "error" | "info", duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }): JSX.Element {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info", duration = 3000) => {
      const id = Date.now().toString() + Math.random();
      const newToast: ToastMessage = {
        id,
        type,
        message,
        duration
      };
      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
