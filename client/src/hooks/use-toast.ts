/**
 * Toast Hook
 * Simple toast notification system
 */

import { useState, useCallback } from "react";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

interface Toast extends ToastOptions {
  id: string;
}

// Simple global toast state
let toastListeners: ((toast: Toast) => void)[] = [];

export function useToast() {
  const toast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...options, id };
    
    // For now, just show an alert as a simple implementation
    // In production, this would use a proper toast component
    if (options.variant === "destructive") {
      console.error(`Toast: ${options.title} - ${options.description || ""}`);
    } else {
      console.log(`Toast: ${options.title} - ${options.description || ""}`);
    }
    
    // Show browser alert for important messages
    if (options.variant === "destructive") {
      alert(`${options.title}\n\n${options.description || ""}`);
    }
    
    return id;
  }, []);

  return { toast };
}
