import React from "react";
import { Item } from "@/lib/types";

interface StatsStripProps {
  items: Item[];
}

export function StatsStrip({ items }: StatsStripProps) {
  const watchedMovies = items.filter(
    (i) => i.type === "movie" && i.status === "watched"
  ).length;

  const watchedSeries = items.filter(
    (i) => i.type === "series" && i.status === "watched"
  ).length;

  const gamesCompleted = items.filter(
    (i) => i.type === "game" && i.status === "completed"
  ).length;

  const gamesPlayed = items.filter(
    (i) => i.type === "game" && i.status === "played"
  ).length;

  const wishlistCount = items.filter((i) => i.status === "wishlist").length;

  const ratedItems = items.filter(
    (i) => i.rating !== null && i.rating !== undefined
  );

  const avgRating =
    ratedItems.length > 0
      ? (
          ratedItems.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
          ratedItems.length
        ).toFixed(1)
      : "—";

  const padZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  return (
    <div className="w-full bg-[#1A152B] border-3 border-black p-3 pixel-shadow flex flex-wrap items-center justify-between gap-3">
      {/* Stat item: Movies */}
      <div className="flex flex-col items-center sm:items-start min-w-[70px]">
        <span className="text-[10px] font-pixel text-[#2DE2E6] uppercase tracking-wider">
          MOVIES
        </span>
        <span className="arcade-score text-sm sm:text-base mt-1 text-[#2DE2E6]">
          {padZero(watchedMovies)}
        </span>
      </div>

      {/* Stat item: Series */}
      <div className="flex flex-col items-center sm:items-start min-w-[70px]">
        <span className="text-[10px] font-pixel text-[#FFB000] uppercase tracking-wider">
          SERIES
        </span>
        <span className="arcade-score text-sm sm:text-base mt-1 text-[#FFB000]">
          {padZero(watchedSeries)}
        </span>
      </div>

      {/* Stat item: Games Completed */}
      <div className="flex flex-col items-center sm:items-start min-w-[70px]">
        <span className="text-[10px] font-pixel text-[#A6FF00] uppercase tracking-wider">
          COMPLETED
        </span>
        <span className="arcade-score text-sm sm:text-base mt-1 text-[#A6FF00]">
          {padZero(gamesCompleted)}
        </span>
      </div>

      {/* Stat item: Games Played */}
      <div className="flex flex-col items-center sm:items-start min-w-[70px]">
        <span className="text-[10px] font-pixel text-[#FFB000] uppercase tracking-wider">
          PLAYED
        </span>
        <span className="arcade-score text-sm sm:text-base mt-1 text-[#FFB000]">
          {padZero(gamesPlayed)}
        </span>
      </div>

      {/* Stat item: Wishlist */}
      <div className="flex flex-col items-center sm:items-start min-w-[70px]">
        <span className="text-[10px] font-pixel text-[#FF3D81] uppercase tracking-wider">
          WISHLIST
        </span>
        <span className="arcade-score text-sm sm:text-base mt-1 text-[#FF3D81]">
          {padZero(wishlistCount)}
        </span>
      </div>

      {/* Stat item: Avg Rating */}
      <div className="flex flex-col items-center sm:items-start min-w-[70px]">
        <span className="text-[10px] font-pixel text-[#F4E9D0] uppercase tracking-wider">
          AVG RATING
        </span>
        <span className="arcade-score text-sm sm:text-base mt-1 text-[#A6FF00]">
          {avgRating}
        </span>
      </div>
    </div>
  );
}
