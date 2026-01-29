"use client";

import { useEffect } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast.duration !== Infinity) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration || 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  const bgColor = {
    success: "bg-emerald-500/20 border-emerald-500/50",
    error: "bg-rose-500/20 border-rose-500/50",
    info: "bg-blue-500/20 border-blue-500/50"
  };

  const textColor = {
    success: "text-emerald-300",
    error: "text-rose-300",
    info: "text-blue-300"
  };

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: AlertCircle
  }[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -20, x: 20 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`flex items-start gap-3 rounded-lg border ${bgColor[toast.type]} p-4 backdrop-blur-sm`}
    >
      <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${textColor[toast.type]}`} />
      <p className={`text-sm font-medium ${textColor[toast.type]}`}>{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="ml-auto flex-shrink-0 text-white/60 hover:text-white/80 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md pointer-events-auto">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}
