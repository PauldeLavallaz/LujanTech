import { generateImage } from "@/server/generate";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, height, width, deploymentId } = body;

    if (!prompt || !height || !width || !deploymentId) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: prompt, height, width, deploymentId" },
        { status: 400 }
      );
    }

    const endpoint = request.nextUrl.origin;
    console.log("Starting generation with:", { prompt, height, width, deploymentId });

    const run_id = await generateImage(prompt, endpoint, body);
    console.log("Generation started, run_id:", run_id);

    return NextResponse.json({ run_id }, { status: 200 });
  } catch (error: any) {
    console.error("Error en /api/generate:", error);
    return NextResponse.json(
      { error: error.message || "Error generating image" },
      { status: 500 }
    );
  }
}
