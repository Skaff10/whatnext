import { z } from "zod";

export type ItemType = "movie" | "series" | "game";

export type MovieSeriesStatus = "watched" | "wishlist";
export type GameStatus = "completed" | "played" | "wishlist";
export type ItemStatus = "watched" | "completed" | "played" | "wishlist";

export interface Item {
  id: string; // e.g. "movie-603", "series-1399", "game-3498"
  type: ItemType;
  externalId: number;
  title: string;
  year: number | null;
  posterUrl: string | null;
  overview: string;
  genres: string[];
  status: ItemStatus;
  rating: number | null; // 0.0 to 10.0, 1 decimal place
  addedAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

export interface SearchResultItem {
  externalId: number;
  title: string;
  year: number | null;
  posterUrl: string | null;
  overview: string;
  genres: string[];
}

export const ALLOWED_STATUSES_BY_TYPE: Record<ItemType, ItemStatus[]> = {
  movie: ["watched", "wishlist"],
  series: ["watched", "wishlist"],
  game: ["completed", "played", "wishlist"],
};

export function isRatingAllowed(status: ItemStatus): boolean {
  return status === "watched" || status === "completed" || status === "played";
}

export function isValidStatusForType(type: ItemType, status: ItemStatus): boolean {
  return ALLOWED_STATUSES_BY_TYPE[type]?.includes(status) ?? false;
}

export function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

// Zod schemas
export const createItemSchema = z.object({
  type: z.enum(["movie", "series", "game"]),
  externalId: z.number().int().positive(),
  title: z.string().min(1).max(300),
  year: z.number().int().nullable().optional(),
  posterUrl: z.string().url().nullable().optional().or(z.literal("")),
  overview: z.string().default(""),
  genres: z.array(z.string()).default([]),
  status: z.enum(["watched", "completed", "played", "wishlist"]),
  rating: z.number().min(0).max(10).nullable().optional(),
}).superRefine((data, ctx) => {
  // Validate status matches type
  if (!isValidStatusForType(data.type, data.status)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid status "${data.status}" for type "${data.type}". Allowed: ${ALLOWED_STATUSES_BY_TYPE[data.type].join(", ")}`,
      path: ["status"],
    });
  }

  // Validate rating rule: wishlist cannot have rating
  if (data.status === "wishlist" && data.rating !== null && data.rating !== undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Wishlist items cannot have a rating.",
      path: ["rating"],
    });
  }
});

export const updateItemSchema = z.object({
  status: z.enum(["watched", "completed", "played", "wishlist"]).optional(),
  rating: z.number().min(0).max(10).nullable().optional(),
});
