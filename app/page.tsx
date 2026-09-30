"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Item, ItemType, ItemStatus } from "@/lib/types";
import { Header } from "@/components/Header";
import { StatsStrip } from "@/components/StatsStrip";
import {
  FilterBar,
  TypeFilterOption,
  StatusFilterOption,
  SortOption,
} from "@/components/FilterBar";
import { Card } from "@/components/Card";
import { AddModal } from "@/components/AddModal";
import { DetailModal } from "@/components/DetailModal";
import { LevelUpOverlay } from "@/components/LevelUpOverlay";
import { EmptyState } from "@/components/EmptyState";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ToastContainer, ToastMessage } from "@/components/Toast";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Sorting
  const [typeFilter, setTypeFilter] = useState<TypeFilterOption>("game");
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("recent");

  // Modals & Overlays
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Toast system
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (text: string, type: "error" | "success" | "info" = "info") => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, text, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial fetch from /api/items
  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch("/api/items");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load library items.");
        }
        setItems(data.items || []);
      } catch (err: any) {
        console.error(err);
        addToast(
          err.message || "Failed to load data. Please ensure Firebase is configured.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchItems();
  }, [addToast]);

  // Set of existing IDs for duplicate prevention in search
  const existingIds = useMemo(
    () => new Set(items.map((i) => i.id)),
    [items]
  );

  // Wishlist items for filter bar badge
  const wishlistItems = useMemo(
    () => items.filter((i) => i.status === "wishlist"),
    [items]
  );

  // Filtering and Sorting
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Filter by type
    result = result.filter((i) => i.type === typeFilter);

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((i) => i.status === statusFilter);
    }

    // Filter by title search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((i) => i.title.toLowerCase().includes(q));
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case "recent":
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case "rating_desc": {
          const aR = a.rating ?? -1;
          const bR = b.rating ?? -1;
          return bR - aR;
        }
        case "rating_asc": {
          const aR = a.rating ?? 999;
          const bR = b.rating ?? 999;
          return aR - bR;
        }
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "year_desc": {
          const aY = a.year ?? 0;
          const bY = b.year ?? 0;
          return bY - aY;
        }
        default:
          return 0;
      }
    });

    return result;
  }, [items, typeFilter, statusFilter, searchQuery, sortOption]);

  // CREATE ITEM (Optimistic with Rollback)
  const handleAddItem = async (itemData: {
    type: ItemType;
    externalId: number;
    title: string;
    year: number | null;
    posterUrl: string | null;
    overview: string;
    genres: string[];
    status: ItemStatus;
    rating: number | null;
  }) => {
    const docId = `${itemData.type}-${itemData.externalId}`;
    const previousItems = [...items];
    const now = new Date().toISOString();

    const optimisticItem: Item = {
      ...itemData,
      id: docId,
      addedAt: now,
      updatedAt: now,
    };

    // Optimistically update UI
    setItems((prev) => [optimisticItem, ...prev]);

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to add item");
      }

      // Replace with server item if present
      if (resData.item) {
        setItems((prev) =>
          prev.map((i) => (i.id === docId ? resData.item : i))
        );
      }
      addToast(`"${itemData.title}" ADDED TO SHELF!`, "success");
    } catch (err: any) {
      console.error(err);
      // Rollback
      setItems(previousItems);
      addToast(err.message || "Failed to save item.", "error");
      throw err;
    }
  };

  // UPDATE ITEM (Optimistic with Rollback)
  const handleUpdateItem = async (
    id: string,
    updates: { status?: ItemStatus; rating?: number | null }
  ) => {
    const previousItems = [...items];
    const now = new Date().toISOString();

    // Optimistically update
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, ...updates, updatedAt: now } : i
      )
    );

    // Also update selectedItem if currently opened in modal
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem((prev) =>
        prev ? { ...prev, ...updates, updatedAt: now } : null
      );
    }

    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to update item");
      }

      if (resData.item) {
        setItems((prev) =>
          prev.map((i) => (i.id === id ? resData.item : i))
        );
        if (selectedItem && selectedItem.id === id) {
          setSelectedItem(resData.item);
        }
      }
      addToast("STATUS & SCORE UPDATED.", "success");
    } catch (err: any) {
      console.error(err);
      // Rollback
      setItems(previousItems);
      if (selectedItem && selectedItem.id === id) {
        const original = previousItems.find((i) => i.id === id);
        if (original) setSelectedItem(original);
      }
      addToast(err.message || "Failed to update item.", "error");
      throw err;
    }
  };

  // DELETE ITEM (Optimistic with Rollback)
  const handleDeleteItem = async (id: string) => {
    const previousItems = [...items];
    const itemToDelete = items.find((i) => i.id === id);

    // Optimistically remove
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedItem(null);

    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to delete item");
      }
      addToast(
        `"${itemToDelete?.title || "Item"}" EJECTED FROM SYSTEM.`,
        "info"
      );
    } catch (err: any) {
      console.error(err);
      // Rollback
      setItems(previousItems);
      addToast(err.message || "Failed to delete item.", "error");
      throw err;
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <Header onOpenAdd={() => setIsAddOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Arcade Stats Strip */}
        <StatsStrip items={items} />

        {/* Filter & Controls Bar */}
        <FilterBar
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          sortOption={sortOption}
          onSortOptionChange={setSortOption}
          wishlistCount={wishlistItems.length}
        />

        {/* Content Body */}
        {isLoading ? (
          <LoadingScreen />
        ) : items.length === 0 ? (
          <EmptyState onAddClick={() => setIsAddOpen(true)} />
        ) : filteredAndSortedItems.length === 0 ? (
          <EmptyState onAddClick={() => setIsAddOpen(true)} isFiltered />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredAndSortedItems.map((item) => (
              <Card
                key={item.id}
                item={item}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals & Overlays */}
      <AddModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddItem}
        existingIds={existingIds}
      />

      <DetailModal
        item={selectedItem}
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        onUpdate={handleUpdateItem}
        onDelete={handleDeleteItem}
        onTriggerLevelUp={() => setShowLevelUp(true)}
      />

      <LevelUpOverlay
        show={showLevelUp}
        onDone={() => setShowLevelUp(false)}
      />

      {/* Retro Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
