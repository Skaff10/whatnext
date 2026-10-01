import React from "react";
import { ItemStatus } from "@/lib/types";
import { PixelStarIcon, PixelCheckIcon } from "./PixelIcons";

interface StatusBadgeProps {
  status?: ItemStatus | string | null;
  isWishlist?: boolean;
  size?: "sm" | "md";
}

export function StatusBadge({ status, isWishlist, size = "md" }: StatusBadgeProps) {
  const isSm = size === "sm";

  if (isWishlist || status === "wishlist") {
    return (
      <span
        className={`inline-flex items-center gap-1 font-pixel uppercase font-bold tracking-wider border-2 border-black bg-[#FF3D81] text-white pixel-shadow-sm ${
          isSm ? "text-[9px] px-1.5 py-0.5" : "text-[11px] px-2.5 py-1"
        }`}
      >
        <PixelStarIcon size={isSm ? 10 : 12} />
        WISHLIST
      </span>
    );
  }

  switch (status) {
    case "watched":
      return (
        <span
          className={`inline-flex items-center gap-1 font-pixel uppercase font-bold tracking-wider border-2 border-black bg-[#2DE2E6] text-[#0A0812] pixel-shadow-sm ${
            isSm ? "text-[9px] px-1.5 py-0.5" : "text-[11px] px-2.5 py-1"
          }`}
        >
          WATCHED
        </span>
      );
    case "completed":
      return (
        <span
          className={`inline-flex items-center gap-1 font-pixel uppercase font-bold tracking-wider border-2 border-black bg-[#A6FF00] text-[#0A0812] pixel-shadow-sm ${
            isSm ? "text-[9px] px-1 py-0.5" : "text-[11px] px-2.5 py-1"
          }`}
        >
          COMPLETED
        </span>
      );
    case "played":
      return (
        <span
          className={`inline-flex items-center gap-1 font-pixel uppercase font-bold tracking-wider border-2 border-black bg-[#FFB000] text-[#0A0812] pixel-shadow-sm ${
            isSm ? "text-[9px] px-1.5 py-0.5" : "text-[11px] px-2.5 py-1"
          }`}
        >
          PLAYED
        </span>
      );
    default:
      return null;
  }
}

interface RatingBadgeProps {
  rating: number | null | undefined;
  size?: "sm" | "md" | "lg";
}

export function RatingBadge({ rating, size = "md" }: RatingBadgeProps) {
  if (rating === null || rating === undefined) {
    return null;
  }

  // Format with one decimal
  const formatted = rating.toFixed(1);

  // Color by tier: under 5 magenta, 5 to 7.9 amber, 8 and above lime
  let tierColor = "bg-[#FF3D81] text-white border-[#FF3D81]";
  let glowColor = "rgba(255, 61, 129, 0.4)";

  if (rating >= 8.0) {
    tierColor = "bg-[#A6FF00] text-[#0A0812] border-[#A6FF00]";
    glowColor = "rgba(166, 255, 0, 0.4)";
  } else if (rating >= 5.0) {
    tierColor = "bg-[#FFB000] text-[#0A0812] border-[#FFB000]";
    glowColor = "rgba(255, 176, 0, 0.4)";
  }

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5 border-2",
    md: "text-xs px-2 py-0.5 border-2",
    lg: "text-sm px-3 py-1 border-3",
  }[size];

  return (
    <div
      className={`inline-flex items-center font-pixel font-bold tracking-wider border-black pixel-shadow-sm ${sizeClasses} ${tierColor}`}
      style={{ boxShadow: `3px 3px 0 #000, 0 0 6px ${glowColor}` }}
      title={`Rating: ${formatted} / 10.0`}
    >
      {formatted}
    </div>
  );
}
