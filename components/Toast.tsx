import React from "react";
import { PixelCrossIcon, PixelCheckIcon } from "./PixelIcons";

export interface ToastMessage {
  id: string;
  type: "error" | "success" | "info";
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-2 pointer-events-none">
      {toasts.map((toast) => {
        let borderBg = "border-[#FF3D81] bg-[#2A0E1A] text-[#FF3D81]";
        if (toast.type === "success") {
          borderBg = "border-[#A6FF00] bg-[#122A0E] text-[#A6FF00]";
        } else if (toast.type === "info") {
          borderBg = "border-[#2DE2E6] bg-[#0E232A] text-[#2DE2E6]";
        }

        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto p-3 border-3 border-black pixel-shadow flex items-start justify-between gap-3 animate-coin-pop ${borderBg}`}
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5">
                {toast.type === "success" ? (
                  <PixelCheckIcon size={14} />
                ) : (
                  <span className="font-pixel text-xs font-bold">!</span>
                )}
              </span>
              <p className="font-vt323 text-lg leading-tight text-[#F4E9D0]">
                {toast.text}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-[#F4E9D0]/70 hover:text-white font-pixel text-xs p-1"
              aria-label="Dismiss notification"
            >
              <PixelCrossIcon size={10} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
