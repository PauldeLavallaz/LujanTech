import { db } from "@/db/db";
import { runs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  runId: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const runId = params.runId;
    
    const [run] = await db
      .select()
      .from(runs)
      .where(eq(runs.run_id, runId))
      .limit(1);

    if (!run) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }

    // Consultar el estado actual a ComfyDeploy
    const response = await fetch(`https://api.comfydeploy.com/api/run/${runId}`, {
      headers: {
        Authorization: `Bearer ${process.env.COMFY_DEPLOY_API_KEY}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(run); // Devolver solo la información de la base de datos
    }

    const comfyData = await response.json();
    
    // Actualizar el estado en la base de datos si es necesario
    if (comfyData.status !== run.live_status) {
      await db
        .update(runs)
        .set({ 
          live_status: comfyData.status,
          progress: comfyData.progress || 0,
          image_url: comfyData.outputs?.[0]?.data?.images?.[0]?.url
        })
        .where(eq(runs.run_id, runId));
    }

    return NextResponse.json({
      ...run,
      progress: comfyData.progress || 0,
      image_url: comfyData.outputs?.[0]?.data?.images?.[0]?.url
    });
  } catch (error) {
    console.error("Error in status endpoint:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 