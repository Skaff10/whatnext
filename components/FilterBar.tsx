import React from "react";
import { ItemStatus } from "@/lib/types";
import {
  FilmIcon,
  TvIcon,
  GamepadIcon,
  PixelStarIcon,
  PixelSearchIcon,
  PixelDiceIcon,
} from "./PixelIcons";

export type ActiveSection = "game" | "movie" | "series" | "wishlist";
export type WishlistTypeFilter = "all" | "movie" | "series" | "game";
export type StatusFilterOption = "all" | ItemStatus;
export type SortOption =
  | "recent"
  | "rating_desc"
  | "rating_asc"
  | "title_asc"
  | "year_desc";

interface FilterBarProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
  statusFilter: StatusFilterOption;
  onStatusFilterChange: (status: StatusFilterOption) => void;
  wishlistTypeFilter: WishlistTypeFilter;
  onWishlistTypeFilterChange: (type: WishlistTypeFilter) => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  sortOption: SortOption;
  onSortOptionChange: (sort: SortOption) => void;
  wishlistCounts: {
    all: number;
    movie: number;
    series: number;
    game: number;
  };
  sectionCounts: {
    game: number;
    movie: number;
    series: number;
    wishlist: number;
  };
  onOpenOracle?: () => void;
}

export function FilterBar({
  activeSection,
  onSectionChange,
  statusFilter,
  onStatusFilterChange,
  wishlistTypeFilter,
  onWishlistTypeFilterChange,
  searchQuery,
  onSearchQueryChange,
  sortOption,
  onSortOptionChange,
  wishlistCounts,
  sectionCounts,
  onOpenOracle,
}: FilterBarProps) {
  // Determine available statuses based on active section
  const getStatusOptions = (): { label: string; value: StatusFilterOption }[] => {
    if (activeSection === "movie" || activeSection === "series") {
      return [
        { label: "ALL STATUS", value: "all" },
        { label: "WATCHED", value: "watched" },
      ];
    }
    if (activeSection === "game") {
      return [
        { label: "ALL STATUS", value: "all" },
        { label: "COMPLETED", value: "completed" },
        { label: "PLAYED", value: "played" },
      ];
    }
    return [{ label: "ALL STATUS", value: "all" }];
  };

  const statusOptions = getStatusOptions();

  return (
    <div className="w-full space-y-3 bg-[#1A162B] p-3 sm:p-4 border-3 border-black pixel-shadow">
      {/* Top Filter Row: Primary Section Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Main Section Navigation: Games, Movies, Series, Wishlist */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {(
            [
              {
                id: "game" as const,
                label: "GAMES",
                icon: <GamepadIcon size={12} />,
                count: sectionCounts.game,
                activeClass: "bg-[#A6FF00] text-black border-black font-bold",
              },
              {
                id: "movie" as const,
                label: "MOVIES",
                icon: <FilmIcon size={12} />,
                count: sectionCounts.movie,
                activeClass: "bg-[#2DE2E6] text-black border-black font-bold",
              },
              {
                id: "series" as const,
                label: "SERIES",
                icon: <TvIcon size={12} />,
                count: sectionCounts.series,
                activeClass: "bg-[#FFB000] text-black border-black font-bold",
              },
              {
                id: "wishlist" as const,
                label: "WISHLIST",
                icon: <PixelStarIcon size={12} />,
                count: sectionCounts.wishlist,
                activeClass: "bg-[#FF3D81] text-white border-black font-bold",
              },
            ] as const
          ).map((tab) => {
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  onSectionChange(tab.id);
                  if (tab.id !== "wishlist") {
                    onStatusFilterChange("all");
                  }
                }}
                className={`pixel-btn text-[10px] sm:text-xs font-pixel py-1.5 px-3 flex items-center gap-1.5 transition-all ${
                  isActive
                    ? tab.activeClass
                    : "bg-[#241E3B] text-[#F4E9D0] border-[#3B335E] hover:bg-[#2D254A]"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span
                  className={`text-[9px] px-1 py-0.2 border ${
                    isActive
                      ? "border-black/50 bg-black/20"
                      : "border-[#3B335E] bg-[#14101F]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Oracle Random Picker shortcut (Available when wishlist has items) */}
        {activeSection === "wishlist" && wishlistCounts.all > 0 && onOpenOracle && (
          <button
            type="button"
            onClick={onOpenOracle}
            className="pixel-btn text-[10px] sm:text-xs py-1.5 px-3 bg-[#2D1630] text-[#FF3D81] border-[#FF3D81] hover:bg-[#FF3D81] hover:text-white flex items-center gap-1.5 animate-pulse"
            title="Randomly choose an item from your wishlist"
          >
            <PixelDiceIcon size={12} />
            ROLL THE ORACLE
          </button>
        )}
      </div>

      {/* Second Row: Sub-Filter Options */}
      {activeSection === "wishlist" ? (
        /* In Wishlist: Option which wishlist (All, Movies, Series, Games) */
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#292244]">
          <span className="font-pixel text-[10px] text-[#FF3D81] mr-1 uppercase flex items-center gap-1">
            <PixelStarIcon size={10} />
            WISHLIST:
          </span>
          {(
            [
              {
                id: "all" as const,
                label: "ALL",
                count: wishlistCounts.all,
                activeBg: "bg-[#FF3D81] text-white border-black font-bold",
              },
              {
                id: "movie" as const,
                label: "MOVIES",
                count: wishlistCounts.movie,
                activeBg: "bg-[#2DE2E6] text-black border-black font-bold",
              },
              {
                id: "series" as const,
                label: "SERIES",
                count: wishlistCounts.series,
                activeBg: "bg-[#FFB000] text-black border-black font-bold",
              },
              {
                id: "game" as const,
                label: "GAMES",
                count: wishlistCounts.game,
                activeBg: "bg-[#A6FF00] text-black border-black font-bold",
              },
            ] as const
          ).map((opt) => {
            const isActive = wishlistTypeFilter === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onWishlistTypeFilterChange(opt.id)}
                className={`text-[10px] font-pixel px-2.5 py-1 border transition-all flex items-center gap-1.5 ${
                  isActive
                    ? `${opt.activeBg} pixel-shadow-sm`
                    : "bg-[#14101F] text-[#F4E9D0]/80 border-[#3B335E] hover:border-[#2DE2E6]"
                }`}
              >
                <span>{opt.label}</span>
                <span className="text-[9px] opacity-75">({opt.count})</span>
              </button>
            );
          })}
        </div>
      ) : (
        /* In Shelf / Library: Status Filter (Watched, Completed, Played) */
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#292244]">
          <span className="font-pixel text-[10px] text-[#F4E9D0]/60 mr-1 uppercase">
            STATUS:
          </span>
          {statusOptions.map((opt) => {
            const isActive = statusFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onStatusFilterChange(opt.value)}
                className={`text-[10px] font-pixel px-2 py-1 border transition-all ${
                  isActive
                    ? "bg-[#FFB000] text-black border-black font-bold pixel-shadow-sm"
                    : "bg-[#14101F] text-[#F4E9D0]/80 border-[#3B335E] hover:border-[#2DE2E6]"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Third Row: Search library & Sort dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#292244]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-[#2DE2E6]">
            <PixelSearchIcon size={14} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder={
              activeSection === "wishlist"
                ? "FILTER WISHLIST BY TITLE..."
                : "FILTER SHELF BY TITLE..."
            }
            className="w-full bg-[#110D1D] text-[#F4E9D0] placeholder-[#F4E9D0]/40 font-vt323 text-lg pl-8 pr-3 py-1 border-2 border-[#3B335E] focus:border-[#2DE2E6] focus:outline-none pixel-shadow-sm"
            aria-label="Filter items by title"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchQueryChange("")}
              className="absolute inset-y-0 right-2 font-pixel text-xs text-[#FF3D81] hover:underline"
            >
              [X]
            </button>
          )}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <label className="font-pixel text-[10px] text-[#F4E9D0]/70 uppercase whitespace-nowrap">
            SORT:
          </label>
          <select
            value={sortOption}
            onChange={(e) => onSortOptionChange(e.target.value as SortOption)}
            className="bg-[#110D1D] text-[#F4E9D0] font-vt323 text-lg px-2 py-1 border-2 border-[#3B335E] focus:border-[#2DE2E6] focus:outline-none pixel-shadow-sm cursor-pointer"
            aria-label="Sort items"
          >
            <option value="recent">RECENTLY ADDED</option>
            {activeSection !== "wishlist" && (
              <>
                <option value="rating_desc">HIGHEST RATED</option>
                <option value="rating_asc">LOWEST RATED</option>
              </>
            )}
            <option value="title_asc">TITLE (A - Z)</option>
            <option value="year_desc">YEAR (NEWEST)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

