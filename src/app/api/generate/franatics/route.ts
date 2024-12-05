import { auth } from "@clerk/nextjs/server";
import { generateFranatics } from "@/server/generateFranatics";
import { ComfyDeploy } from "comfydeploy";

const cd = new ComfyDeploy({
  bearer: process.env.COMFY_DEPLOY_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const selfie = formData.get("selfie") as File;
    const name = formData.get("name") as string;
    const nationality = formData.get("nationality") as string;
    const favoriteProduct = formData.get("favoriteProduct") as string;

    if (!selfie || !name || !nationality || !favoriteProduct) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Subir la imagen a ComfyDeploy
    const buffer = await selfie.arrayBuffer();
    const fileData = new FormData();
    fileData.append('file', new Blob([buffer]), selfie.name);

    const uploadResponse = await fetch('https://api.comfydeploy.com/api/file/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COMFY_DEPLOY_API_KEY}`
      },
      body: fileData
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image');
    }

    const { file_url } = await uploadResponse.json();

    // Generar con la URL de la imagen
    const runId = await generateFranatics(
      request.headers.get("origin") || "",
      {
        selfie: file_url,
        name,
        nationality,
        variety: favoriteProduct
      }
    );

    return Response.json({ run_id: runId });
  } catch (error) {
    console.error("Generation error:", error);
    return new Response(error instanceof Error ? error.message : "Error generating avatar", { status: 500 });
  }
} 