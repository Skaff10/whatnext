import React, { useState, useEffect } from "react";

export function LoadingScreen() {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 92 ? 92 : prev + 12));
    }, 180);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-6">
      <div className="space-y-2">
        <h2 className="font-pixel text-xl sm:text-2xl text-[#2DE2E6] tracking-widest uppercase animate-pulse">
          INITIALIZING SYSTEM...
        </h2>
        <p className="font-vt323 text-xl text-[#FFB000]">
          BOOTING MEMORY CARTRIDGE & TAPE REELS
        </p>
      </div>

      {/* Chunky Pixel Progress Bar */}
      <div className="w-full max-w-md bg-black border-4 border-black p-1 pixel-shadow">
        <div
          className="h-6 bg-gradient-to-r from-[#FF3D81] via-[#FFB000] to-[#A6FF00] transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="font-pixel text-xs text-[#F4E9D0]/70">
        LOADING DATA [ {progress}% ]
        <span className="blinking-cursor" />
      </div>
    </div>
  );
}
