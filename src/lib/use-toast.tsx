'use client';

import * as React from "react";

type ToastVariant = "success" | "error";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

export function useToast() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback((message: string, variant: ToastVariant = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, variant }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const toastSuccess = React.useCallback((message: string) => {
    toast(message, "success");
  }, [toast]);

  const toastError = React.useCallback((message: string) => {
    toast(message, "error");
  }, [toast]);

  return {
    toasts,
    toast,
    toastSuccess,
    toastError,
  };
}

export function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded-md shadow-md ${toast.variant === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          <p>{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
