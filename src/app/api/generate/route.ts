import { generateImage } from "@/server/generate";
import { generateFranatics } from "@/server/generateFranatics";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deploymentId } = body;

    if (!deploymentId) {
      return NextResponse.json(
        { error: "Falta el deploymentId" },
        { status: 400 }
      );
    }

    const endpoint = request.nextUrl.origin;

    let run_id;
    if (deploymentId === "e322689e-065a-4d33-aa6a-ee941803ca95") {
      // Generador Básico
      const { prompt, height, width, lora } = body;
      if (!prompt || !height || !width) {
        return NextResponse.json(
          { error: "Faltan campos requeridos: prompt, height, width" },
          { status: 400 }
        );
      }
      run_id = await generateImage(prompt, endpoint, {
        height: parseInt(height, 10),
        width: parseInt(width, 10),
        lora: lora || "",
        batchSize: 1,
      });
    } else if (deploymentId === "cec337bf-69d6-4886-97b0-acbeba47f1ec") {
      // Franatics
      run_id = await generateFranatics(endpoint, body.inputs);
    } else {
      return NextResponse.json(
        { error: "DeploymentId no válido" },
        { status: 400 }
      );
    }

    return NextResponse.json({ run_id }, { status: 200 });
  } catch (error: any) {
    console.error("Error en /api/generate:", error);
    return NextResponse.json(
      { error: error.message || "Error generating image" },
      { status: 500 }
    );
  }
}
