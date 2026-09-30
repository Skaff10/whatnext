import React from "react";
import { PixelPlusIcon } from "./PixelIcons";

interface HeaderProps {
  onOpenAdd: () => void;
}

export function Header({ onOpenAdd }: HeaderProps) {
  return (
    <header className="w-full bg-[#181329] border-b-4 border-black py-4 px-4 sm:px-8 pixel-shadow">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Retro Logo */}
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-[#FF3D81] border-2 border-black inline-block animate-pulse" />
          <h1 className="font-pixel text-xl sm:text-2xl md:text-3xl text-[#F4E9D0] logo-retro-shadow tracking-wider uppercase select-none">
           BLACKLIST
            <span className="blinking-cursor" />
          </h1>
        </div>

        {/* Hero + ADD Button & Slogan */}
        <div className="flex items-center gap-4">
         
          <button
            type="button"
            onClick={onOpenAdd}
            className="pixel-btn-hero flex items-center gap-2 cursor-pointer"
            aria-label="Add new movie, series or game"
          >
         
            <span> ADD</span>
          </button>
        </div>
      </div>
    </header>
  );
}
