import React from "react";
import { Item } from "@/lib/types";

interface StatsStripProps {
  items: Item[];
}

export function StatsStrip({ items }: StatsStripProps) {
  const watchedMovies = items.filter(
    (i) => !i.isWishlist && i.type === "movie" && i.status === "watched",
  ).length;

  const watchedSeries = items.filter(
    (i) => !i.isWishlist && i.type === "series" && i.status === "watched",
  ).length;

  const gamesCompleted = items.filter(
    (i) => !i.isWishlist && i.type === "game" && i.status === "completed",
  ).length;

  const gamesPlayed = items.filter(
    (i) => !i.isWishlist && i.type === "game" && i.status === "played",
  ).length;

  const wishlistCount = items.filter((i) => i.isWishlist).length;

  const ratedItems = items.filter(
    (i) => !i.isWishlist && i.rating !== null && i.rating !== undefined,
  );


  const padZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  return (
    <div className="w-full bg-[#1A152B] border-3 border-black p-3 pixel-shadow flex flex-wrap items-center justify-between gap-3">
      {/* Stat item: Games */}
      <button
        type="button"
        className={`flex flex-col items-center  min-w-[70px] p-1.5 transition-all text-left `}
      >
        <span className="text-[10px] font-pixel text-[#A6FF00] uppercase tracking-wider">
          GAMES
        </span>
        <span className="arcade-score text-sm sm:text-base mt-1 text-[#A6FF00]">
          {padZero(gamesCompleted + gamesPlayed)}
        </span>
      </button>

      {/* Stat item: Movies */}
      <button
        type="button"
        className={`flex flex-col items-center  min-w-[70px] p-1.5 transition-all text-left `}
      >
        <span className="text-[10px] font-pixel text-[#2DE2E6] uppercase tracking-wider">
          MOVIES
        </span>
        <span className="arcade-score text-sm sm:text-base mt-1 text-[#2DE2E6]">
          {padZero(watchedMovies)}
        </span>
      </button>

      {/* Stat item: Series */}
      <button
        type="button"
        className={`flex flex-col items-center sm:items-start min-w-[70px] p-1.5 transition-all text-left `}
      >
        <span className="text-[10px] font-pixel text-[#FFB000] uppercase tracking-wider">
          SERIES
        </span>
        <span className="arcade-score text-sm sm:text-base mt-1 text-[#FFB000]">
          {padZero(watchedSeries)}
        </span>
      </button>

      {/* Stat item: Wishlist */}
      <button
        type="button"
        className={`flex flex-col items-center   min-w-[70px] p-1.5 transition-all text-left  `}
      >
        <span className="text-[10px] font-pixel text-[#FF3D81] uppercase tracking-wider">
          WISHLIST
        </span>
        <span className="arcade-score text-sm sm:text-base mt-1 text-[#FF3D81] ">
          {padZero(wishlistCount)}
        </span>
      </button>

    
    </div>
  );
}
