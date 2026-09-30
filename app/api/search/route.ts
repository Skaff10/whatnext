import { NextRequest, NextResponse } from "next/server";
import { searchMedia } from "@/lib/external-apis";
import { ItemType } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type") as ItemType | null;
    const q = searchParams.get("q")?.trim();

    if (!type || !["movie", "series", "game"].includes(type)) {
      return NextResponse.json(
        { error: 'Valid "type" query param (movie, series, game) is required.' },
        { status: 400 }
      );
    }

    if (!q) {
      return NextResponse.json(
        { error: 'Query parameter "q" cannot be empty.' },
        { status: 400 }
      );
    }

    const results = await searchMedia(type, q);
    return NextResponse.json({ results });
  } catch (err: any) {
    console.error("API /api/search error:", err);
    return NextResponse.json(
      {
        error:
          err.message ||
          "Failed to fetch search results from external provider.",
      },
      { status: 500 }
    );
  }
}
