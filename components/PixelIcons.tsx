import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

export function FilmIcon({ className = "w-4 h-4", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {/* 16x16 pixel film reel / tape */}
      <rect x="1" y="2" width="14" height="12" fill="currentColor" />
      <rect x="3" y="4" width="2" height="2" fill="#000" />
      <rect x="7" y="4" width="2" height="2" fill="#000" />
      <rect x="11" y="4" width="2" height="2" fill="#000" />
      <rect x="3" y="10" width="2" height="2" fill="#000" />
      <rect x="7" y="10" width="2" height="2" fill="#000" />
      <rect x="11" y="10" width="2" height="2" fill="#000" />
    </svg>
  );
}

export function TvIcon({ className = "w-4 h-4", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {/* Antenna */}
      <rect x="4" y="1" width="2" height="2" />
      <rect x="6" y="2" width="2" height="1" />
      <rect x="8" y="2" width="2" height="1" />
      <rect x="10" y="1" width="2" height="2" />
      {/* TV body */}
      <rect x="1" y="3" width="14" height="11" />
      {/* Screen cutout */}
      <rect x="3" y="5" width="8" height="7" fill="#14101F" />
      {/* Knobs */}
      <rect x="12" y="6" width="2" height="2" fill="#000" />
      <rect x="12" y="9" width="2" height="2" fill="#000" />
    </svg>
  );
}

export function GamepadIcon({ className = "w-4 h-4", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {/* Gamepad body */}
      <rect x="1" y="4" width="14" height="9" />
      {/* D-Pad */}
      <rect x="3" y="7" width="4" height="3" fill="#000" />
      <rect x="4" y="6" width="2" height="5" fill="#000" />
      {/* Action buttons */}
      <rect x="10" y="8" width="2" height="2" fill="#FF3D81" />
      <rect x="12" y="6" width="2" height="2" fill="#2DE2E6" />
    </svg>
  );
}

export function PixelStarIcon({ className = "w-4 h-4", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect x="7" y="1" width="2" height="2" />
      <rect x="6" y="3" width="4" height="2" />
      <rect x="1" y="5" width="14" height="2" />
      <rect x="3" y="7" width="10" height="2" />
      <rect x="5" y="9" width="6" height="2" />
      <rect x="4" y="11" width="3" height="3" />
      <rect x="9" y="11" width="3" height="3" />
      <rect x="3" y="14" width="2" height="1" />
      <rect x="11" y="14" width="2" height="1" />
    </svg>
  );
}

export function PixelCheckIcon({ className = "w-4 h-4", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect x="12" y="3" width="2" height="2" />
      <rect x="10" y="5" width="2" height="2" />
      <rect x="8" y="7" width="2" height="2" />
      <rect x="6" y="9" width="2" height="2" />
      <rect x="4" y="7" width="2" height="2" />
      <rect x="2" y="5" width="2" height="2" />
    </svg>
  );
}

export function PixelCrossIcon({ className = "w-4 h-4", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="2" height="2" />
      <rect x="12" y="2" width="2" height="2" />
      <rect x="4" y="4" width="2" height="2" />
      <rect x="10" y="4" width="2" height="2" />
      <rect x="6" y="6" width="4" height="4" />
      <rect x="4" y="10" width="2" height="2" />
      <rect x="10" y="10" width="2" height="2" />
      <rect x="2" y="12" width="2" height="2" />
      <rect x="12" y="12" width="2" height="2" />
    </svg>
  );
}

export function PixelSearchIcon({ className = "w-4 h-4", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect x="4" y="1" width="6" height="2" />
      <rect x="2" y="3" width="2" height="6" />
      <rect x="10" y="3" width="2" height="6" />
      <rect x="4" y="9" width="6" height="2" />
      <rect x="9" y="9" width="2" height="2" />
      <rect x="11" y="11" width="2" height="2" />
      <rect x="13" y="13" width="2" height="2" />
    </svg>
  );
}

export function PixelTrashIcon({ className = "w-4 h-4", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect x="5" y="1" width="6" height="2" />
      <rect x="2" y="3" width="12" height="2" />
      <rect x="3" y="5" width="10" height="9" />
      <rect x="5" y="7" width="2" height="5" fill="#000" />
      <rect x="9" y="7" width="2" height="5" fill="#000" />
    </svg>
  );
}

export function PixelDiceIcon({ className = "w-4 h-4", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="14" height="14" />
      <rect x="3" y="3" width="2" height="2" fill="#000" />
      <rect x="11" y="3" width="2" height="2" fill="#000" />
      <rect x="7" y="7" width="2" height="2" fill="#000" />
      <rect x="3" y="11" width="2" height="2" fill="#000" />
      <rect x="11" y="11" width="2" height="2" fill="#000" />
    </svg>
  );
}

export function PixelPlusIcon({ className = "w-4 h-4", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect x="7" y="2" width="2" height="12" />
      <rect x="2" y="7" width="12" height="2" />
    </svg>
  );
}
