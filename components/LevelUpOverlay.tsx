import React, { useEffect } from "react";

interface LevelUpOverlayProps {
  show: boolean;
  onDone: () => void;
}

export function LevelUpOverlay({ show, onDone }: LevelUpOverlayProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onDone();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onDone]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
      <div className="bg-black/90 border-4 border-[#A6FF00] p-6 text-center pixel-shadow-lime animate-levelup max-w-lg w-full">
        <div className="font-pixel text-2xl sm:text-3xl text-[#A6FF00] tracking-widest uppercase mb-2 animate-bounce">
          ★ LEVEL UP! ★
        </div>
        <p className="font-pixel text-sm sm:text-base text-[#2DE2E6] mb-1">
          MASTERPIECE LOGGED (9.0+)
        </p>
        <p className="font-vt323 text-xl text-[#F4E9D0]">
          +1000 ARCADE EXP ADDED TO YOUR RECORD
        </p>
      </div>
    </div>
  );
}
