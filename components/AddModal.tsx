import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ItemType,
  ItemStatus,
  SearchResultItem,
  ALLOWED_STATUSES_BY_TYPE,
  isRatingAllowed,
} from "@/lib/types";
import { RatingControl } from "./RatingControl";
import {
  FilmIcon,
  TvIcon,
  GamepadIcon,
  PixelCrossIcon,
  PixelSearchIcon,
  PixelCheckIcon,
} from "./PixelIcons";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    type: ItemType;
    externalId: number;
    title: string;
    year: number | null;
    posterUrl: string | null;
    overview: string;
    genres: string[];
    status: ItemStatus;
    rating: number | null;
  }) => Promise<void>;
  existingIds: Set<string>;
}

export function AddModal({
  isOpen,
  onClose,
  onAdd,
  existingIds,
}: AddModalProps) {
  const [selectedType, setSelectedType] = useState<ItemType>("movie");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Selected result step
  const [selectedItem, setSelectedItem] = useState<SearchResultItem | null>(null);
  const [status, setStatus] = useState<ItemStatus>("wishlist");
  const [rating, setRating] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset modal state on open/close
  useEffect(() => {
    if (isOpen) {
      setSelectedType("movie");
      setSearchQuery("");
      setSearchResults([]);
      setSelectedItem(null);
      setStatus("wishlist");
      setRating(null);
      setSearchError(null);
    }
  }, [isOpen]);

  // When type changes, clear selected and search
  const handleTypeChange = (type: ItemType) => {
    setSelectedType(type);
    setSelectedItem(null);
    setStatus("wishlist");
    setRating(null);
    if (searchQuery.trim().length > 1) {
      triggerSearch(searchQuery.trim(), type);
    }
  };

  const triggerSearch = async (query: string, type: ItemType) => {
    setIsSearching(true);
    setSearchError(null);
    try {
      const res = await fetch(
        `/api/search?type=${type}&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Search failed");
      }
      setSearchResults(data.results || []);
    } catch (err: any) {
      setSearchError(err.message || "Failed to search.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (val.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      triggerSearch(val.trim(), selectedType);
    }, 400); // Debounced 400ms per requirements
  };

  const handleSelectItem = (item: SearchResultItem) => {
    setSelectedItem(item);
    // Default status to wishlist
    setStatus("wishlist");
    setRating(null);
  };

  const handleStatusChange = (newStatus: ItemStatus) => {
    setStatus(newStatus);
    // If switched to wishlist, clear rating
    if (newStatus === "wishlist") {
      setRating(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setIsSaving(true);
    try {
      await onAdd({
        type: selectedType,
        externalId: selectedItem.externalId,
        title: selectedItem.title,
        year: selectedItem.year,
        posterUrl: selectedItem.posterUrl,
        overview: selectedItem.overview,
        genres: selectedItem.genres,
        status,
        rating: isRatingAllowed(status) ? rating : null,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-none overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-[#1F1A33] border-4 border-black pixel-shadow my-auto">
        {/* Retro Window Title Bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#2D234A] border-b-3 border-black text-[#F4E9D0]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#FF3D81] inline-block border border-black" />
            <h2 id="add-modal-title" className="font-pixel text-xs sm:text-sm tracking-wider uppercase">
              :: INSERT NEW TAPE / CARTRIDGE ::
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 font-pixel text-xs bg-[#FF3D81] text-white border-2 border-black hover:bg-[#ff5b94] pixel-shadow-sm"
            aria-label="Close modal"
          >
            <PixelCrossIcon size={12} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Step 1: Type Selection */}
          <div>
            <label className="block font-pixel text-xs text-[#2DE2E6] uppercase tracking-wider mb-2">
              STEP 1: SELECT MEDIA FORMAT
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange("movie")}
                className={`pixel-btn py-2 text-xs flex items-center justify-center gap-2 ${
                  selectedType === "movie"
                    ? "bg-[#2DE2E6] text-black font-bold border-black"
                    : "bg-[#2A2345] text-[#F4E9D0] border-[#3B335E]"
                }`}
              >
                <FilmIcon size={14} />
                MOVIE
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("series")}
                className={`pixel-btn py-2 text-xs flex items-center justify-center gap-2 ${
                  selectedType === "series"
                    ? "bg-[#FFB000] text-black font-bold border-black"
                    : "bg-[#2A2345] text-[#F4E9D0] border-[#3B335E]"
                }`}
              >
                <TvIcon size={14} />
                SERIES
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("game")}
                className={`pixel-btn py-2 text-xs flex items-center justify-center gap-2 ${
                  selectedType === "game"
                    ? "bg-[#A6FF00] text-black font-bold border-black"
                    : "bg-[#2A2345] text-[#F4E9D0] border-[#3B335E]"
                }`}
              >
                <GamepadIcon size={14} />
                GAME
              </button>
            </div>
          </div>

          {/* Step 2: Search Input */}
          <div>
            <label className="block font-pixel text-xs text-[#2DE2E6] uppercase tracking-wider mb-2">
              STEP 2: SEARCH TITLE ({selectedType.toUpperCase()})
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#2DE2E6]">
                <PixelSearchIcon size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder={`TYPE TITLE (E.G. ${
                  selectedType === "movie"
                    ? "BLADE RUNNER"
                    : selectedType === "series"
                    ? "TWIN PEAKS"
                    : "CHRONO TRIGGER"
                })...`}
                className="w-full bg-[#110D1D] text-[#F4E9D0] placeholder-[#F4E9D0]/40 font-vt323 text-xl pl-10 pr-3 py-2 border-3 border-black focus:border-[#2DE2E6] focus:outline-none pixel-shadow-sm"
                autoFocus
              />
              {isSearching && (
                <div className="absolute inset-y-0 right-3 flex items-center text-xs font-pixel text-[#FFB000] animate-pulse">
                  SEARCHING...
                </div>
              )}
            </div>
            {searchError && (
              <p className="mt-1 font-vt323 text-base text-[#FF3D81]">
                {searchError}
              </p>
            )}
          </div>

          {/* Step 3: Search Results List */}
          {searchResults.length > 0 && !selectedItem && (
            <div>
              <span className="block font-pixel text-xs text-[#F4E9D0]/70 uppercase mb-2">
                SEARCH RESULTS (CLICK TO PICK):
              </span>
              <div className="max-h-60 overflow-y-auto space-y-2 border-2 border-black p-2 bg-[#120F1D]">
                {searchResults.map((result) => {
                  const itemId = `${selectedType}-${result.externalId}`;
                  const isAlreadyAdded = existingIds.has(itemId);

                  return (
                    <div
                      key={result.externalId}
                      onClick={() => !isAlreadyAdded && handleSelectItem(result)}
                      className={`flex items-center justify-between p-2 border-2 transition-colors ${
                        isAlreadyAdded
                          ? "border-[#3B335E] bg-[#1C172B]/60 opacity-60 cursor-not-allowed"
                          : "border-black bg-[#241E3B] hover:border-[#2DE2E6] hover:bg-[#30284F] cursor-pointer pixel-shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {result.posterUrl ? (
                          <div className="relative w-10 h-14 bg-black flex-shrink-0 border border-black">
                            <Image
                              src={result.posterUrl}
                              alt={result.title}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-14 bg-[#14101F] border border-black flex items-center justify-center text-[9px] font-pixel text-[#F4E9D0]/40 flex-shrink-0">
                            N/A
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <p className="font-pixel text-xs text-[#F4E9D0] truncate">
                            {result.title}
                          </p>
                          <p className="font-vt323 text-sm text-[#FFB000]">
                            {result.year ? `[${result.year}]` : "[YEAR UNKNOWN]"}
                            {result.genres.length > 0 && (
                              <span className="text-[#F4E9D0]/60 ml-2">
                                {result.genres.slice(0, 2).join(", ")}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {isAlreadyAdded ? (
                        <span className="font-pixel text-[10px] text-[#FF3D81] bg-black px-2 py-1 border border-[#FF3D81] flex-shrink-0">
                          ALREADY ADDED
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="font-pixel text-[10px] bg-[#2DE2E6] text-black px-2.5 py-1 border border-black flex-shrink-0 hover:bg-white"
                        >
                          SELECT
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4 & 5: Config Selected Item (Status & Rating) */}
          {selectedItem && (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t-2 border-[#2D234A]">
              <div className="p-3 bg-[#171326] border-2 border-black flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedItem.posterUrl && (
                    <div className="relative w-12 h-16 bg-black border border-black flex-shrink-0">
                      <Image
                        src={selectedItem.posterUrl}
                        alt={selectedItem.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <span className="font-pixel text-[10px] text-[#A6FF00] uppercase">
                      SELECTED TITLE:
                    </span>
                    <h3 className="font-pixel text-xs sm:text-sm text-[#F4E9D0]">
                      {selectedItem.title} {selectedItem.year && `(${selectedItem.year})`}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="font-pixel text-[10px] text-[#FF3D81] hover:underline"
                >
                  [CHANGE]
                </button>
              </div>

              {/* Status Picker */}
              <div>
                <label className="block font-pixel text-xs text-[#2DE2E6] uppercase tracking-wider mb-2">
                  CHOOSE STATUS
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALLOWED_STATUSES_BY_TYPE[selectedType].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`pixel-btn text-xs py-1.5 px-3 uppercase ${
                        status === st
                          ? st === "watched"
                            ? "bg-[#2DE2E6] text-black font-bold"
                            : st === "completed"
                            ? "bg-[#A6FF00] text-black font-bold"
                            : st === "played"
                            ? "bg-[#FFB000] text-black font-bold"
                            : "bg-[#FF3D81] text-white font-bold"
                          : "bg-[#2A2345] text-[#F4E9D0] border-[#3B335E]"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Control (if status allows) */}
              {isRatingAllowed(status) && (
                <div>
                  <RatingControl value={rating} onChange={setRating} />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="pixel-btn bg-[#241E3B] text-[#F4E9D0] border-[#3B335E]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="pixel-btn-hero text-xs py-2 px-5 disabled:opacity-50"
                >
                  {isSaving ? "SAVING..." : "SAVE TO SHELF"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
