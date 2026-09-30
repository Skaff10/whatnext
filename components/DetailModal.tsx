import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Item,
  ItemStatus,
  ALLOWED_STATUSES_BY_TYPE,
  isRatingAllowed,
} from "@/lib/types";
import { StatusBadge, RatingBadge } from "./Badge";
import { RatingControl } from "./RatingControl";
import {
  PixelCrossIcon,
  PixelTrashIcon,
  PixelCheckIcon,
  FilmIcon,
  TvIcon,
  GamepadIcon,
} from "./PixelIcons";

interface DetailModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (
    id: string,
    updates: { status?: ItemStatus; rating?: number | null }
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onTriggerLevelUp: () => void;
}

export function DetailModal({
  item,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onTriggerLevelUp,
}: DetailModalProps) {
  const [currentStatus, setCurrentStatus] = useState<ItemStatus>("wishlist");
  const [currentRating, setCurrentRating] = useState<number | null>(null);
  const [isEditingRating, setIsEditingRating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Confirmation dialog states
  const [showWishlistConfirm, setShowWishlistConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [promptPromptRate, setPromptRate] = useState(false);

  useEffect(() => {
    if (item) {
      setCurrentStatus(item.status);
      setCurrentRating(item.rating);
      setIsEditingRating(false);
      setShowWishlistConfirm(false);
      setShowDeleteConfirm(false);
      setPromptRate(false);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const allowedStatuses = ALLOWED_STATUSES_BY_TYPE[item.type];

  const handleStatusSelect = async (newStatus: ItemStatus) => {
    if (newStatus === currentStatus) return;

    // Moving to wishlist clears rating - ask for confirmation if rating exists
    if (newStatus === "wishlist" && currentRating !== null) {
      setShowWishlistConfirm(true);
      return;
    }

    // Moving from wishlist to watched/completed/played: prompt to rate
    if (currentStatus === "wishlist" && isRatingAllowed(newStatus)) {
      setCurrentStatus(newStatus);
      setPromptRate(true);
      return;
    }

    // Direct status update
    setIsSaving(true);
    try {
      await onUpdate(item.id, {
        status: newStatus,
        rating: isRatingAllowed(newStatus) ? currentRating : null,
      });
      setCurrentStatus(newStatus);
      if (!isRatingAllowed(newStatus)) {
        setCurrentRating(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmMoveToWishlist = async () => {
    setIsSaving(true);
    try {
      await onUpdate(item.id, {
        status: "wishlist",
        rating: null,
      });
      setCurrentStatus("wishlist");
      setCurrentRating(null);
      setShowWishlistConfirm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveRating = async (newRating: number | null) => {
    setIsSaving(true);
    try {
      await onUpdate(item.id, {
        rating: newRating,
      });
      setCurrentRating(newRating);
      setIsEditingRating(false);
      setPromptRate(false);

      // Check if rating >= 9.0 on watched/completed -> Level Up!
      if (
        newRating !== null &&
        newRating >= 9.0 &&
        (currentStatus === "watched" || currentStatus === "completed")
      ) {
        onTriggerLevelUp();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkipPromptRate = async () => {
    setIsSaving(true);
    try {
      await onUpdate(item.id, {
        status: currentStatus,
      });
      setPromptRate(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsSaving(true);
    try {
      await onDelete(item.id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const renderTypeIcon = () => {
    switch (item.type) {
      case "movie":
        return <FilmIcon size={14} className="text-[#2DE2E6]" />;
      case "series":
        return <TvIcon size={14} className="text-[#FFB000]" />;
      case "game":
        return <GamepadIcon size={14} className="text-[#A6FF00]" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-none overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-[#1F1A33] border-4 border-black pixel-shadow my-auto">
        {/* Retro Window Title Bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#2D234A] border-b-3 border-black text-[#F4E9D0]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#2DE2E6] inline-block border border-black" />
            <h2 id="detail-modal-title" className="font-pixel text-xs sm:text-sm tracking-wider uppercase truncate max-w-md">
              :: {item.title} ::
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
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Poster / Artwork */}
            <div className="relative w-full sm:w-44 aspect-[2/3] bg-black border-3 border-black flex-shrink-0 pixel-shadow">
              {item.posterUrl ? (
                <Image
                  src={item.posterUrl}
                  alt={item.title}
                  fill
                  sizes="180px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[#14101F]">
                  {renderTypeIcon()}
                  <span className="mt-2 font-pixel text-xs text-[#F4E9D0]/50 uppercase">
                    NO ARTWORK
                  </span>
                </div>
              )}
            </div>

            {/* Main Info */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 font-pixel text-xs text-[#F4E9D0]/70 uppercase">
                  {renderTypeIcon()}
                  {item.type}
                </span>
                {item.year && (
                  <span className="font-pixel text-xs text-[#FFB000]">
                    [{item.year}]
                  </span>
                )}
              </div>

              <h1 className="font-pixel text-base sm:text-lg text-[#F4E9D0] leading-tight">
                {item.title}
              </h1>

              {/* Status and Rating Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <StatusBadge status={currentStatus} size="md" />
                {currentRating !== null && (
                  <RatingBadge rating={currentRating} size="md" />
                )}
              </div>

              {/* Overview */}
              <div>
                <p className="font-vt323 text-lg leading-relaxed text-[#F4E9D0]/90 bg-[#14101F] p-2.5 border-2 border-black">
                  {item.overview || "No overview available for this title."}
                </p>
              </div>

              {/* Genres */}
              {item.genres && item.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.genres.map((g) => (
                    <span
                      key={g}
                      className="text-xs font-vt323 px-2 py-0.5 bg-[#0E0B17] text-[#2DE2E6] border border-[#3B335E]"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Prompt to Rate when just moved from wishlist */}
          {promptPromptRate && (
            <div className="p-4 bg-[#231E3D] border-3 border-[#A6FF00] pixel-shadow space-y-3 animate-coin-pop">
              <div className="flex items-center gap-2">
                <PixelCheckIcon size={14} className="text-[#A6FF00]" />
                <h4 className="font-pixel text-xs text-[#A6FF00] uppercase">
                  MOVED TO {currentStatus.toUpperCase()}! RATE IT NOW?
                </h4>
              </div>
              <p className="font-vt323 text-base text-[#F4E9D0]/80">
                You just finished or played this title. Score it on the arcade board or skip for later.
              </p>
              <RatingControl
                value={currentRating}
                onChange={(val) => setCurrentRating(val)}
              />
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSkipPromptRate}
                  className="pixel-btn text-[10px] bg-[#2A2345] text-[#F4E9D0] border-[#3B335E]"
                >
                  SKIP FOR NOW
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveRating(currentRating)}
                  className="pixel-btn text-[10px] bg-[#A6FF00] text-black font-bold border-black"
                >
                  SAVE RATING
                </button>
              </div>
            </div>
          )}

          {/* Status Change Strip */}
          {!promptPromptRate && !showWishlistConfirm && !showDeleteConfirm && (
            <div className="space-y-2 pt-2 border-t-2 border-[#2D234A]">
              <label className="block font-pixel text-xs text-[#2DE2E6] uppercase tracking-wider">
                CHANGE STATUS:
              </label>
              <div className="flex flex-wrap gap-2">
                {allowedStatuses.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusSelect(st)}
                    disabled={isSaving}
                    className={`pixel-btn text-xs py-1.5 px-3 uppercase ${
                      currentStatus === st
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
          )}

          {/* Rating Editor (Allowed only for watched/completed/played) */}
          {!promptPromptRate &&
            !showWishlistConfirm &&
            !showDeleteConfirm &&
            isRatingAllowed(currentStatus) && (
              <div className="pt-2 border-t-2 border-[#2D234A]">
                {isEditingRating ? (
                  <div className="space-y-3">
                    <RatingControl
                      value={currentRating}
                      onChange={(val) => setCurrentRating(val)}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentRating(item.rating);
                          setIsEditingRating(false);
                        }}
                        className="pixel-btn text-[10px] bg-[#241E3B] text-[#F4E9D0] border-[#3B335E]"
                      >
                        CANCEL
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveRating(currentRating)}
                        disabled={isSaving}
                        className="pixel-btn text-[10px] bg-[#A6FF00] text-black font-bold border-black"
                      >
                        CONFIRM RATING
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2.5 bg-[#171326] border-2 border-black">
                    <span className="font-pixel text-xs text-[#F4E9D0]/70 uppercase">
                      SCORE:{" "}
                      <span className="text-[#A6FF00]">
                        {currentRating !== null ? `${currentRating.toFixed(1)} / 10.0` : "UNRATED"}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingRating(true)}
                      className="pixel-btn text-[10px] py-1 px-3 bg-[#FFB000] text-black font-bold border-black"
                    >
                      EDIT SCORE
                    </button>
                  </div>
                )}
              </div>
            )}

          {/* Confirmation: Move back to wishlist clears rating */}
          {showWishlistConfirm && (
            <div className="p-4 bg-[#2D1624] border-3 border-[#FF3D81] pixel-shadow space-y-3">
              <h4 className="font-pixel text-xs text-[#FF3D81] uppercase">
                :: WARNING: CLEAR RATING? ::
              </h4>
              <p className="font-vt323 text-lg text-[#F4E9D0]">
                Moving this title back to your Wishlist will permanently erase your score of{" "}
                <span className="font-pixel text-sm text-[#FFB000]">
                  {currentRating?.toFixed(1)}
                </span>
                . Are you sure?
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowWishlistConfirm(false)}
                  className="pixel-btn text-xs bg-[#241E3B] text-[#F4E9D0] border-[#3B335E]"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={confirmMoveToWishlist}
                  disabled={isSaving}
                  className="pixel-btn text-xs bg-[#FF3D81] text-white font-bold border-black"
                >
                  YES, CLEAR RATING
                </button>
              </div>
            </div>
          )}

          {/* Confirmation: Delete Item */}
          {showDeleteConfirm && (
            <div className="p-4 bg-[#2D1624] border-3 border-[#FF3D81] pixel-shadow space-y-3">
              <h4 className="font-pixel text-xs text-[#FF3D81] uppercase">
                :: EJECT TAPE FROM SYSTEM? ::
              </h4>
              <p className="font-vt323 text-lg text-[#F4E9D0]">
                Are you sure you want to permanently delete &quot;{item.title}&quot; from your library? This cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="pixel-btn text-xs bg-[#241E3B] text-[#F4E9D0] border-[#3B335E]"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="pixel-btn text-xs bg-[#FF3D81] text-white font-bold border-black"
                >
                  CONFIRM EJECT
                </button>
              </div>
            </div>
          )}

          {/* Footer Bar: Delete Trigger & Close */}
          {!showWishlistConfirm && !showDeleteConfirm && (
            <div className="flex items-center justify-between pt-3 border-t-2 border-[#2D234A]">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="pixel-btn text-[10px] py-1.5 px-3 bg-[#2D1624] text-[#FF3D81] border-[#FF3D81]/60 hover:bg-[#3D1E30] flex items-center gap-1.5"
              >
                <PixelTrashIcon size={12} />
                EJECT (DELETE)
              </button>
              <button
                type="button"
                onClick={onClose}
                className="pixel-btn text-xs py-1.5 px-4 bg-[#241E3B] text-[#F4E9D0] border-[#3B335E]"
              >
                CLOSE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
