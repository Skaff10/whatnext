import { NextRequest, NextResponse } from "next/server";
import { getAllItems, getItemById, createItem } from "@/lib/storage";
import { createItemSchema, Item, roundToOneDecimal } from "@/lib/types";

export async function GET() {
  try {
    const items = await getAllItems();
    return NextResponse.json({ items });
  } catch (err: any) {
    console.error("GET /api/items error:", err);
    return NextResponse.json(
      {
        error:
          err.message ||
          "Failed to retrieve items.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = createItemSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const docId = `${data.type}-${data.externalId}`;

    const existing = await getItemById(docId);
    if (existing) {
      return NextResponse.json(
        { error: `Item "${data.title}" is already in your library.` },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const finalRating =
      data.rating !== null && data.rating !== undefined
        ? roundToOneDecimal(data.rating)
        : null;

    const newItem: Item = {
      id: docId,
      type: data.type,
      externalId: data.externalId,
      title: data.title,
      year: data.year ?? null,
      posterUrl: data.posterUrl || null,
      overview: data.overview,
      genres: data.genres,
      status: data.status,
      rating: finalRating,
      addedAt: now,
      updatedAt: now,
    };

    const saved = await createItem(newItem);

    return NextResponse.json({ item: saved }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/items error:", err);
    return NextResponse.json(
      {
        error:
          err.message ||
          "Failed to create item.",
      },
      { status: 500 }
    );
  }
}
