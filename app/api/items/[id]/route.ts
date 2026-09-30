import { NextRequest, NextResponse } from "next/server";
import { getItemById, updateItem, deleteItem } from "@/lib/storage";
import {
  updateItemSchema,
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
    const newStatus = updates.status ?? currentItem.status;

    // Validate status matches item type
    if (updates.status && !isValidStatusForType(currentItem.type, newStatus)) {
      return NextResponse.json(
        {
          error: `Status "${newStatus}" is not allowed for ${currentItem.type}. Allowed: ${ALLOWED_STATUSES_BY_TYPE[currentItem.type].join(", ")}`,
        },
        { status: 400 }
      );
    }

    let newRating: number | null;

    if (newStatus === "wishlist") {
      // Wishlist item can NEVER have a rating. Moving to wishlist clears rating.
      if (updates.rating !== null && updates.rating !== undefined) {
        return NextResponse.json(
          { error: "Wishlist items cannot have a rating." },
          { status: 400 }
        );
      }
      newRating = null;
    } else {
      // Status is watched, completed, or played
      if (updates.rating !== undefined) {
        newRating =
          updates.rating !== null ? roundToOneDecimal(updates.rating) : null;
      } else {
        newRating = currentItem.rating;
      }
    }

    const updatedAt = new Date().toISOString();
    const updated = await updateItem(id, {
      status: newStatus,
      rating: newRating,
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
