"use client";

import { useEffect, useRef } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  onClick?: () => void;
  duration?: number;
}

export function Toast({
  message,
  isVisible,
  onClose,
  onClick,
  duration = 4000,
}: ToastProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isVisible) {
      timerRef.current = setTimeout(() => {
        onClose();
      }, duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isVisible, duration, onClose]);

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "-translate-y-4 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <button
        onClick={onClick}
        className="flex items-center gap-2.5 px-4 py-2.5 bg-gray-900/90 backdrop-blur-sm text-white rounded-full shadow-lg hover:bg-gray-800 transition-all active:scale-95"
      >
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <span className="text-sm font-medium">{message}</span>
      </button>
    </div>
  );
}
