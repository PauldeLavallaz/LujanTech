import { db } from "@/db/db";
import { runs } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, or, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Eliminar solo las ejecuciones trabadas (sin imagen y en estado queued/processing)
    await db.delete(runs)
      .where(eq(runs.user_id, userId))
      .where(isNull(runs.image_url))
      .where(or(
        eq(runs.live_status, "queued"),
        eq(runs.live_status, "processing")
      ));

    return NextResponse.json({ message: "Cleaned successfully" });
  } catch (error) {
    console.error("Error cleaning runs:", error);
    return NextResponse.json({ error: "Failed to clean runs" }, { status: 500 });
  }
} 