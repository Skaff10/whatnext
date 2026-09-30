import React from "react";
import { ItemType, ItemStatus } from "@/lib/types";
import {
  FilmIcon,
  TvIcon,
  GamepadIcon,
  PixelStarIcon,
  PixelSearchIcon,
} from "./PixelIcons";

export type TypeFilterOption = ItemType;
export type StatusFilterOption = "all" | ItemStatus;
export type SortOption =
  | "recent"
  | "rating_desc"
  | "rating_asc"
  | "title_asc"
  | "year_desc";

interface FilterBarProps {
  typeFilter: TypeFilterOption;
  onTypeFilterChange: (type: TypeFilterOption) => void;
  statusFilter: StatusFilterOption;
  onStatusFilterChange: (status: StatusFilterOption) => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  sortOption: SortOption;
  onSortOptionChange: (sort: SortOption) => void;
  wishlistCount: number;
}

export function FilterBar({
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  sortOption,
  onSortOptionChange,
  wishlistCount,
}: FilterBarProps) {
  // Determine available statuses based on type filter
  const getStatusOptions = (): { label: string; value: StatusFilterOption }[] => {
    if (typeFilter === "movie" || typeFilter === "series") {
      return [
        { label: "ALL STATUS", value: "all" },
        { label: "WATCHED", value: "watched" },
        { label: "WISHLIST", value: "wishlist" },
      ];
    }
    if (typeFilter === "game") {
      return [
        { label: "ALL STATUS", value: "all" },
        { label: "COMPLETED", value: "completed" },
        { label: "PLAYED", value: "played" },
        { label: "WISHLIST", value: "wishlist" },
      ];
    }
    // Union fallback
    return [
      { label: "ALL STATUS", value: "all" },
      { label: "WATCHED", value: "watched" },
      { label: "COMPLETED", value: "completed" },
      { label: "PLAYED", value: "played" },
      { label: "WISHLIST", value: "wishlist" },
    ];
  };

  const statusOptions = getStatusOptions();

  return (
    <div className="w-full space-y-3 bg-[#1A162B] p-3 sm:p-4 border-3 border-black pixel-shadow">
      {/* Top Filter Row: Type Tabs & Quick Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Type Tabs */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          {(
            [
              { id: "game", label: "GAMES", icon: <GamepadIcon size={12} /> },
              { id: "movie", label: "MOVIES", icon: <FilmIcon size={12} /> },
              { id: "series", label: "SERIES", icon: <TvIcon size={12} /> },
            ] as const
          ).map((tab) => {
            const isActive = typeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  onTypeFilterChange(tab.id);
                  // Reset status filter if invalid for new type
                  if (
                    (tab.id === "movie" || tab.id === "series") &&
                    (statusFilter === "completed" || statusFilter === "played")
                  ) {
                    onStatusFilterChange("all");
                  }
                  if (tab.id === "game" && statusFilter === "watched") {
                    onStatusFilterChange("all");
                  }
                }}
                className={`pixel-btn text-[10px] sm:text-xs font-pixel py-1.5 px-3 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#2DE2E6] text-black border-black font-bold"
                    : "bg-[#241E3B] text-[#F4E9D0] border-[#3B335E] hover:bg-[#2D254A]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Wishlist Quick-Button & "Pick something for me" button */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (statusFilter === "wishlist") {
                onStatusFilterChange("all");
              } else {
                onStatusFilterChange("wishlist");
              }
            }}
            className={`pixel-btn text-[10px] sm:text-xs py-1.5 px-3 flex items-center gap-1.5 ${
              statusFilter === "wishlist"
                ? "bg-[#FF3D81] text-white border-black"
                : "bg-[#2D1630] text-[#FF3D81] border-[#FF3D81]/60 hover:bg-[#3D1E42]"
            }`}
            title="Show only items in wishlist"
          >
            <PixelStarIcon size={12} />
            WISHLIST ({wishlistCount})
          </button>
        </div>
      </div>

      {/* Second Filter Row: Status Filters */}
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

      {/* Third Row: Search library & Sort dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#292244]">
        {/* Search in library */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-[#2DE2E6]">
            <PixelSearchIcon size={14} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="FILTER SHELF BY TITLE..."
            className="w-full bg-[#110D1D] text-[#F4E9D0] placeholder-[#F4E9D0]/40 font-vt323 text-lg pl-8 pr-3 py-1 border-2 border-[#3B335E] focus:border-[#2DE2E6] focus:outline-none pixel-shadow-sm"
            aria-label="Filter shelf by title"
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
            aria-label="Sort library"
          >
            <option value="recent">RECENTLY ADDED</option>
            <option value="rating_desc">HIGHEST RATED</option>
            <option value="rating_asc">LOWEST RATED</option>
            <option value="title_asc">TITLE (A - Z)</option>
            <option value="year_desc">YEAR (NEWEST)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
