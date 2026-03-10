import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const categories = await db.query.categories.findMany({
      orderBy: [asc(schema.categories.name)],
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
