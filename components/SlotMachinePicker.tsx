import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Item } from "@/lib/types";
import { PixelCrossIcon, PixelDiceIcon } from "./PixelIcons";
import { StatusBadge } from "./Badge";

interface SlotMachinePickerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Item[];
  onSelectItem: (item: Item) => void;
}

export function SlotMachinePicker({
  isOpen,
  onClose,
  wishlistItems,
  onSelectItem,
}: SlotMachinePickerProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [pickedItem, setPickedItem] = useState<Item | null>(null);
  const [displayTitle, setDisplayTitle] = useState("");

  const roll = () => {
    if (wishlistItems.length === 0) return;
    setIsRolling(true);
    setPickedItem(null);

    let count = 0;
    const maxCycles = 18;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * wishlistItems.length);
      setDisplayTitle(wishlistItems[randomIndex].title);
      count++;

      if (count >= maxCycles) {
        clearInterval(interval);
        const finalItem =
          wishlistItems[Math.floor(Math.random() * wishlistItems.length)];
        setDisplayTitle(finalItem.title);
        setPickedItem(finalItem);
        setIsRolling(false);
      }
    }, 90);
  };

  useEffect(() => {
    if (isOpen && wishlistItems.length > 0) {
      roll();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="slot-title"
    >
      <div className="relative w-full max-w-md bg-[#1F1A33] border-4 border-black pixel-shadow">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#2D234A] border-b-3 border-black text-[#F4E9D0]">
          <div className="flex items-center gap-2">
            <PixelDiceIcon size={14} className="text-[#A6FF00]" />
            <h2 id="slot-title" className="font-pixel text-xs sm:text-sm uppercase tracking-wider">
              :: WHAT NEXT? ORACLE ::
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 font-pixel text-xs bg-[#FF3D81] text-white border-2 border-black hover:bg-[#ff5b94]"
            aria-label="Close"
          >
            <PixelCrossIcon size={12} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-5">
          <p className="font-vt323 text-lg text-[#2DE2E6]">
            CONSULTING THE ARCHIVES FOR YOUR NEXT OBSESSION...
          </p>

          {/* Slot Display Box */}
          <div className="bg-black border-4 border-[#3B335E] p-4 min-h-[140px] flex flex-col items-center justify-center pixel-shadow">
            {isRolling ? (
              <div className="space-y-2">
                <span className="font-pixel text-xs text-[#FFB000] animate-pulse">
                  *** SHUFFLING TAPES ***
                </span>
                <p className="font-pixel text-sm sm:text-base text-[#F4E9D0] truncate max-w-xs animate-slot-shuffle">
                  {displayTitle}
                </p>
              </div>
            ) : pickedItem ? (
              <div className="space-y-3 animate-coin-pop">
                <span className="font-pixel text-xs text-[#A6FF00] tracking-widest uppercase">
                  ★ THE ORACLE HAS CHOSEN ★
                </span>
                <div className="flex items-center justify-center gap-3">
                  {pickedItem.posterUrl && (
                    <div className="relative w-12 h-16 bg-[#14101F] border border-black flex-shrink-0">
                      <Image
                        src={pickedItem.posterUrl}
                        alt={pickedItem.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="text-left">
                    <h3 className="font-pixel text-sm text-[#F4E9D0] leading-tight">
                      {pickedItem.title}
                    </h3>
                    <p className="font-vt323 text-base text-[#FFB000]">
                      {pickedItem.year ? `[${pickedItem.year}]` : ""}{" "}
                      <span className="uppercase text-[#2DE2E6]">
                        {pickedItem.type}
                      </span>
                    </p>
                    <div className="mt-1">
                      <StatusBadge status={pickedItem.status} size="sm" />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={roll}
              disabled={isRolling}
              className="pixel-btn text-xs py-2 px-4 bg-[#FFB000] text-black font-bold border-black disabled:opacity-50"
            >
              ROLL AGAIN
            </button>

            {pickedItem && (
              <button
                type="button"
                onClick={() => {
                  onSelectItem(pickedItem);
                  onClose();
                }}
                className="pixel-btn text-xs py-2 px-4 bg-[#A6FF00] text-black font-bold border-black"
              >
                OPEN TAPE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
