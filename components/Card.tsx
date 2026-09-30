import React, { useState } from "react";
import Image from "next/image";
import { Item } from "@/lib/types";
import { StatusBadge, RatingBadge } from "./Badge";
import { FilmIcon, TvIcon, GamepadIcon } from "./PixelIcons";

interface CardProps {
  item: Item;
  onClick: () => void;
  isHighlighted?: boolean;
}

export function Card({ item, onClick, isHighlighted }: CardProps) {
  const [imgError, setImgError] = useState(false);
  const isGame = item.type === "game";

  const renderTypeIcon = () => {
    switch (item.type) {
      case "movie":
        return <FilmIcon size={12} className="text-[#2DE2E6]" />;
      case "series":
        return <TvIcon size={12} className="text-[#FFB000]" />;
      case "game":
        return <GamepadIcon size={12} className="text-[#A6FF00]" />;
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative flex flex-col cursor-pointer outline-none transition-all ${
        isGame ? "game-cartridge-box" : "vhs-tape-box"
      } ${
        isHighlighted
          ? "ring-4 ring-[#FF3D81] scale-[1.03] z-20 animate-slot-shuffle shadow-[0_0_20px_#FF3D81]"
          : ""
      }`}
      aria-label={`View details for ${item.title}`}
    >
      {/* Game Cartridge Grip Notches */}
      {isGame && (
        <div className="flex items-center justify-between px-3 py-1 bg-[#1A162B] border-b-2 border-black">
          <div className="flex gap-1">
            <span className="w-1.5 h-3 bg-black block" />
            <span className="w-1.5 h-3 bg-black block" />
            <span className="w-1.5 h-3 bg-black block" />
          </div>
          <span className="font-pixel text-[9px] text-[#A6FF00] tracking-widest uppercase">
            CARTRIDGE
          </span>
          <div className="flex gap-1">
            <span className="w-1.5 h-3 bg-black block" />
            <span className="w-1.5 h-3 bg-black block" />
            <span className="w-1.5 h-3 bg-black block" />
          </div>
        </div>
      )}

      {/* Poster / Artwork Area */}
      <div className="relative w-full aspect-[2/3] bg-[#0E0B17] overflow-hidden border-b-2 border-black">
        {item.posterUrl && !imgError ? (
          <Image
            src={item.posterUrl}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-150"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[#171326]">
            {renderTypeIcon()}
            <span className="mt-2 font-pixel text-[10px] text-[#F4E9D0]/50 uppercase">
              NO ARTWORK
            </span>
            <span className="mt-1 font-vt323 text-sm text-[#F4E9D0]/70 line-clamp-2">
              {item.title}
            </span>
          </div>
        )}

        {/* Rating Arcade Score Badge overlay (Top Right) */}
        {item.rating !== null && (
          <div className="absolute top-2 right-2 z-10">
            <RatingBadge rating={item.rating} size="sm" />
          </div>
        )}

        {/* Status Sticker overlay (Top Left) */}
        <div className="absolute top-2 left-2 z-10">
          <StatusBadge status={item.status} size="sm" />
        </div>
      </div>

      {/* VHS Tape / Cartridge Label Strip */}
      <div className="flex-1 p-2.5 flex flex-col justify-between bg-[#1B162E]">
        <div>
          {/* Metadata bar */}
          <div className="flex items-center justify-between text-[11px] font-pixel text-[#F4E9D0]/70 mb-1">
            <span className="flex items-center gap-1 uppercase">
              {renderTypeIcon()}
              <span>{item.type}</span>
            </span>
            {item.year && <span className="text-[#FFB000]">{item.year}</span>}
          </div>

          {/* Title */}
          <h3
            className="font-pixel text-[11px] leading-snug text-[#F4E9D0] group-hover:text-[#2DE2E6] line-clamp-2 tracking-wide"
            title={item.title}
          >
            {item.title}
          </h3>
        </div>

        {/* Genres Pill Strip */}
        {item.genres && item.genres.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {item.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-[10px] font-vt323 px-1.5 py-0.2 bg-[#0E0B17] text-[#2DE2E6] border border-[#3B335E]"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* VHS Bottom Strip Accent */}
      {!isGame && (
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF3D81] via-[#FFB000] to-[#2DE2E6]" />
      )}
    </div>
  );
}
