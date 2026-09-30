import React from "react";
import { roundToOneDecimal } from "@/lib/types";

interface RatingControlProps {
  value: number | null;
  onChange: (val: number | null) => void;
  disabled?: boolean;
}

export function RatingControl({
  value,
  onChange,
  disabled,
}: RatingControlProps) {
  const currentVal = value ?? 5.0;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed)) {
      onChange(roundToOneDecimal(parsed));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    if (valStr === "") {
      onChange(null);
      return;
    }
    const parsed = parseFloat(valStr);
    if (!isNaN(parsed)) {
      const clamped = Math.min(10, Math.max(0, parsed));
      onChange(roundToOneDecimal(clamped));
    }
  };

  // Color indicator based on current rating
  let tierColor = "#FF3D81";
  if (currentVal >= 8.0) tierColor = "#A6FF00";
  else if (currentVal >= 5.0) tierColor = "#FFB000";

  return (
    <div className="w-full space-y-2 p-3 bg-[#171326] border-2 border-black pixel-shadow-sm">
      <div className="flex items-center justify-between">
        <label className="font-pixel text-xs text-[#2DE2E6] uppercase tracking-wider">
          Rating (0.0 - 10.0)
        </label>
        {value !== null && (
          <button
            type="button"
            onClick={() => onChange(null)}
            disabled={disabled}
            className="text-[11px] font-pixel text-[#FF3D81] hover:underline"
          >
            [CLEAR]
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Retro Segmented Slider */}
        <div className="relative flex-1">
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={value ?? 5.0}
            onChange={handleSliderChange}
            disabled={disabled}
            className="retro-range"
            aria-label="Rating slider"
          />
        </div>

        {/* Small synced retro number input */}
        <div className="flex items-center">
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={value !== null ? value.toFixed(1) : ""}
            placeholder="—"
            onChange={handleNumberChange}
            disabled={disabled}
            className="no-spinner w-20 h-8 text-center font-pixel text-sm bg-black border-2 border-[#3B335E] text-[#F4E9D0] pixel-shadow-sm focus:border-[#2DE2E6] focus:outline-none"
            style={{ color: tierColor }}
            aria-label="Rating number input"
          />
        </div>
      </div>

      {/* Visual Level Bar Indicator */}
      <div className="flex justify-between items-center text-[10px] font-pixel text-[#F4E9D0]/60">
        <span>0.0 [POOR]</span>
        <span>5.0 [AVERAGE]</span>
        <span>10.0 [MASTERPIECE]</span>
      </div>
    </div>
  );
}
