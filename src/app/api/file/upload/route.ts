import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { file, filename } = await request.json();

    // Aquí deberías subir el archivo a tu servicio de almacenamiento
    // Por ahora, enviamos la imagen directamente a ComfyDeploy
    const response = await fetch("https://api.comfydeploy.com/api/file/upload", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.COMFY_DEPLOY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        file: file,
        filename: filename
      })
    });

    if (!response.ok) {
      throw new Error("Error uploading file to ComfyDeploy");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
} 