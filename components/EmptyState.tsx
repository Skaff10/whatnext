import React from "react";
import { PixelPlusIcon } from "./PixelIcons";

interface EmptyStateProps {
  onAddClick: () => void;
  isFiltered?: boolean;
}

export function EmptyState({ onAddClick, isFiltered }: EmptyStateProps) {
  return (
    <div className="w-full my-8 p-8 sm:p-12 bg-[#171326] border-4 border-black pixel-shadow text-center flex flex-col items-center justify-center space-y-5">
      {/* Pixel Retro Shelf Illustration */}
      <div className="w-64 max-w-full space-y-2 py-4">
        {/* Shelf Top */}
        <div className="h-3 bg-[#3B2D54] border-2 border-black pixel-shadow-sm flex items-center justify-around px-4">
          <span className="w-2 h-1 bg-[#14101F]" />
          <span className="w-2 h-1 bg-[#14101F]" />
          <span className="w-2 h-1 bg-[#14101F]" />
        </div>
        {/* Empty Space */}
        <div className="h-16 border-l-2 border-r-2 border-[#3B2D54] flex items-center justify-center">
          <span className="font-pixel text-[10px] text-[#F4E9D0]/30 tracking-widest uppercase">
            *** EMPTY SHELF SLOT ***
          </span>
        </div>
        {/* Shelf Plank */}
        <div className="h-4 bg-[#2A1F3D] border-2 border-black pixel-shadow-sm flex items-center justify-between px-6">
          <span className="font-vt323 text-xs text-[#FFB000]/60">SECTION 01</span>
          <span className="font-vt323 text-xs text-[#2DE2E6]/60">RETURN BIN</span>
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <h3 className="font-pixel text-base sm:text-lg text-[#FF3D81] tracking-wider uppercase">
          {isFiltered ? "NO MATCHING TAPES FOUND" : "NO TAPES YET. HIT + ADD."}
        </h3>
        <p className="font-vt323 text-xl text-[#F4E9D0]/80">
          {isFiltered
            ? "Try resetting your search query or status filter to see other titles in your collection."
            : "Your personal rental store and cartridge archive is completely empty. Pop in your first movie, series or game to get started."}
        </p>
      </div>

      {!isFiltered && (
        <button
          type="button"
          onClick={onAddClick}
          className="pixel-btn-hero text-xs py-2.5 px-6 flex items-center gap-2"
        >
          <PixelPlusIcon size={14} />
          INSERT FIRST ITEM
        </button>
      )}
    </div>
  );
}
