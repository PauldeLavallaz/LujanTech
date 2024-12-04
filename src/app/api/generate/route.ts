import { generateImage } from "@/server/generate";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received request body:", body);

    const { deploymentId, inputs, prompt, height, width } = body;

    if (!deploymentId) {
      return NextResponse.json(
        { error: "Falta el deploymentId" },
        { status: 400 }
      );
    }

    const endpoint = request.nextUrl.origin;

    // Si es el generador básico
    if (deploymentId === "e322689e-065a-4d33-aa6a-ee941803ca95") {
      if (!inputs?.prompt || !inputs?.height || !inputs?.width) {
        return NextResponse.json(
          { error: "Faltan campos requeridos: prompt, height, width" },
          { status: 400 }
        );
      }

      const run_id = await generateImage("", endpoint, {
        ...body,
        inputs: {
          prompt: inputs.prompt,
          height: parseInt(inputs.height.toString(), 10),
          width: parseInt(inputs.width.toString(), 10)
        }
      });

      return NextResponse.json({ run_id }, { status: 200 });
    }

    // Si es el generador Franatics
    if (deploymentId === "cec337bf-69d6-4886-97b0-acbeba47f1ec") {
      if (!inputs?.img_face || !inputs?.txt_nombre || !inputs?.txt_nacionalidad) {
        return NextResponse.json(
          { error: "Faltan campos requeridos para la credencial" },
          { status: 400 }
        );
      }

      const run_id = await generateImage("", endpoint, {
        ...body,
        inputs: {
          ...inputs,
          // Asegurar que los campos opcionales existan
          img_man: inputs.img_man || "",
          img_woman: inputs.img_woman || "",
          depth_man: inputs.depth_man || "",
          depth_woman: inputs.depth_woman || "",
          canny_man: inputs.canny_man || "",
          canny_woman: inputs.canny_woman || "",
        }
      });

      return NextResponse.json({ run_id }, { status: 200 });
    }

    return NextResponse.json(
      { error: "DeploymentId no válido" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("Error en /api/generate:", error);
    return NextResponse.json(
      { 
        error: error.message || "Error generating image",
        details: error.stack,
        name: error.name
      },
      { status: 500 }
    );
  }
}
