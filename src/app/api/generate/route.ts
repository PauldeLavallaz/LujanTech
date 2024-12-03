import { generateImage } from "@/server/generate";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Leer el cuerpo de la solicitud
    const body = await request.json();
    const { prompt, height, width, lora, batchSize } = body;

    // Validar que todos los campos están presentes
    if (!prompt || !height || !width || !lora || !batchSize) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: prompt, height, width, lora, batchSize" },
        { status: 400 }
      );
    }

    const endpoint = request.nextUrl.origin;

    // Llamar a la función generateImage con los datos validados
    const run_id = await generateImage(prompt, endpoint, {
      height: parseInt(height, 10),
      width: parseInt(width, 10),
      lora,
      batchSize: parseInt(batchSize, 10),
    });

    return NextResponse.json({ run_id }, { status: 200 });
  } catch (error: any) {
    console.error("Error en /api/generate:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
