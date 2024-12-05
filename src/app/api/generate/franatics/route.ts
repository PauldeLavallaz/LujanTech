import { db } from "@/db/db";
import { runs } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

const DEPLOYMENT_ID = "franatics-deployment-id"; // Reemplazar con el ID correcto del deployment de Franatics

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

    // Aquí iría la lógica para subir la imagen a un servicio de almacenamiento
    // y obtener la URL de la imagen subida
    // const selfieUrl = await uploadImage(selfie);

    // Crear el run en la base de datos
    const run = await db.insert(runs).values({
      run_id: crypto.randomUUID(),
      user_id: userId,
      deployment_id: DEPLOYMENT_ID,
      live_status: "queued",
      inputs: {
        // selfieUrl,
        name,
        nationality,
        favoriteProduct
      },
    }).returning().get();

    // Aquí iría la lógica para iniciar la generación del avatar
    // const generation = await startFranaticsGeneration(run.run_id, selfieUrl, name, nationality, favoriteProduct);

    return Response.json({ run_id: run.run_id });
  } catch (error) {
    console.error("Generation error:", error);
    return new Response("Error generating avatar", { status: 500 });
  }
} 