import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { file, filename } = await request.json();

    // Subir a ComfyDeploy
    const response = await fetch("https://api.comfydeploy.com/api/file/upload", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.COMFY_DEPLOY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        file,
        filename
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("ComfyDeploy error:", error);
      throw new Error("Error uploading file to ComfyDeploy");
    }

    const data = await response.json();
    return NextResponse.json({
      file_url: data.url,
      message: "File uploaded successfully"
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
} 