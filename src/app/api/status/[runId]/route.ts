import { db } from "@/db/db";
import { runs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const runId = request.nextUrl.pathname.split('/').pop();
    
    if (!runId) {
      return NextResponse.json({ error: "Run ID is required" }, { status: 400 });
    }

    // Obtener el estado de la base de datos
    const [run] = await db
      .select()
      .from(runs)
      .where(eq(runs.run_id, runId))
      .limit(1);

    if (!run) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }

    // Si ya tenemos una imagen o un estado final, devolver directamente
    if (run.image_url || run.live_status === "completed" || run.live_status === "error") {
      return NextResponse.json(run);
    }

    // Si no, consultar el estado actual en ComfyDeploy
    const response = await fetch(`https://api.comfydeploy.com/api/run/${runId}`, {
      headers: {
        Authorization: `Bearer ${process.env.COMFY_DEPLOY_API_KEY}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(run);
    }

    const comfyData = await response.json();
    
    // Actualizar el estado en la base de datos
    if (comfyData.status !== run.live_status || comfyData.outputs?.[0]?.data?.images?.[0]?.url) {
      const updates = {
        live_status: comfyData.status,
        progress: comfyData.progress || 0,
      };

      if (comfyData.outputs?.[0]?.data?.images?.[0]?.url) {
        updates.image_url = comfyData.outputs[0].data.images[0].url;
      }

      await db
        .update(runs)
        .set(updates)
        .where(eq(runs.run_id, runId));

      return NextResponse.json({
        ...run,
        ...updates,
      });
    }

    return NextResponse.json(run);
  } catch (error) {
    console.error("Error in status endpoint:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 