import { NextRequest, NextResponse } from "next/server";
import { getItemById, updateItem, deleteItem } from "@/lib/storage";
import {
  updateItemSchema,
  ItemStatus,
  isValidStatusForType,
  roundToOneDecimal,
  ALLOWED_STATUSES_BY_TYPE,
} from "@/lib/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const parseResult = updateItemSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const currentItem = await getItemById(id);
    if (!currentItem) {
      return NextResponse.json(
        { error: `Item with id "${id}" was not found.` },
        { status: 404 }
      );
    }

    const updates = parseResult.data;
    const isMovingToWishlist =
      updates.isWishlist === true || updates.status === "wishlist";
    const isMovingToLibrary =
      updates.isWishlist === false ||
      (currentItem.isWishlist &&
        updates.status &&
        updates.status !== "wishlist");

    let finalIsWishlist = currentItem.isWishlist;
    let finalStatus = currentItem.status;
    let finalRating = currentItem.rating;

    if (isMovingToWishlist) {
      finalIsWishlist = true;
      finalStatus = null;
      finalRating = null;
    } else if (isMovingToLibrary) {
      finalIsWishlist = false;
      const targetStatus = (updates.status && updates.status !== "wishlist")
        ? (updates.status as ItemStatus)
        : (currentItem.type === "game" ? "completed" : "watched");

      if (!isValidStatusForType(currentItem.type, targetStatus)) {
        return NextResponse.json(
          {
            error: `Status "${targetStatus}" is not allowed for ${currentItem.type}. Allowed: ${ALLOWED_STATUSES_BY_TYPE[currentItem.type].join(", ")}`,
          },
          { status: 400 }
        );
      }
      finalStatus = targetStatus;
      finalRating =
        updates.rating !== undefined && updates.rating !== null
          ? roundToOneDecimal(updates.rating)
          : null;
    } else {
      // Retain current library status / update existing library item
      if (updates.status && updates.status !== "wishlist") {
        if (!isValidStatusForType(currentItem.type, updates.status as ItemStatus)) {
          return NextResponse.json(
            {
              error: `Status "${updates.status}" is not allowed for ${currentItem.type}. Allowed: ${ALLOWED_STATUSES_BY_TYPE[currentItem.type].join(", ")}`,
            },
            { status: 400 }
          );
        }
        finalStatus = updates.status as ItemStatus;
      }

      if (finalIsWishlist) {
        finalRating = null;
      } else if (updates.rating !== undefined) {
        finalRating =
          updates.rating !== null ? roundToOneDecimal(updates.rating) : null;
      }
    }

    const updatedAt = new Date().toISOString();
    const updated = await updateItem(id, {
      status: finalStatus,
      isWishlist: finalIsWishlist,
      rating: finalRating,
      updatedAt,
    });

    return NextResponse.json({ item: updated });
  } catch (err: any) {
    console.error("PATCH /api/items/[id] error:", err);
    return NextResponse.json(
      {
        error:
          err.message ||
          "Failed to update item.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await getItemById(id);

    if (!existing) {
      return NextResponse.json(
        { error: `Item with id "${id}" was not found.` },
        { status: 404 }
      );
    }

    await deleteItem(id);

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    console.error("DELETE /api/items/[id] error:", err);
    return NextResponse.json(
      {
        error:
          err.message ||
          "Failed to delete item.",
      },
      { status: 500 }
    );
  }
}
