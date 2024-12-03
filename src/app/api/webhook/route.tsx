import { db } from "@/db/db";
import { runs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Webhook received:", data); // Para debugging

    const { status, run_id, outputs, progress } = data;

    if (!run_id) {
      return NextResponse.json({ error: "No run_id provided" }, { status: 400 });
    }

    // Actualizar el estado en la base de datos
    await db.update(runs)
      .set({
        live_status: status,
        progress: progress || 0,
        image_url: outputs?.[0]?.data?.images?.[0]?.url
      })
      .where(eq(runs.run_id, run_id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
