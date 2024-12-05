import { auth } from "@clerk/nextjs/server";
import { generateFranatics } from "@/server/generateFranatics";

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

    // Primero necesitamos subir la imagen y obtener una URL
    // Aquí deberías implementar la lógica para subir la imagen a un servicio
    // y obtener una URL pública
    const selfieUrl = "https://example.com/temp.jpg"; // Reemplazar con la URL real

    const runId = await generateFranatics(
      request.headers.get("origin") || "",
      {
        selfie: selfieUrl,
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