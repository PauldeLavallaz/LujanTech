import { db } from "@/db/db";
import { runs } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { ComfyDeploy } from "comfydeploy";

const cd = new ComfyDeploy({
  bearer: process.env.COMFY_DEPLOY_API_KEY!,
});

interface FranaticsOptions {
  selfie: string; // URL de la imagen
  name: string;
  nationality: string;
  variety: string;
}

export async function generateFranatics(
  endpoint: string,
  options: FranaticsOptions
) {
  const { userId } = auth();
  if (!userId) throw new Error("User not found");

  const { selfie, name, nationality, variety } = options;

  try {
    const result = await cd.run.queue({
      deploymentId: "cec337bf-69d6-4886-97b0-acbeba47f1ec",
      webhook: `${endpoint}/api/webhook`,
      inputs: {
        img_face: selfie,
        txt_nacionalidad: nationality,
        txt_nombre: name,
        img_man: "https://example.com/man.jpg", // URLs por defecto
        img_woman: "https://example.com/woman.jpg",
        depth_man: "https://example.com/depth_man.jpg",
        depth_woman: "https://example.com/depth_woman.jpg",
        canny_man: "https://example.com/canny_man.jpg",
        canny_woman: "https://example.com/canny_woman.jpg",
        num: Math.floor(Math.random() * 1000), // Número aleatorio
        variedad: variety
      }
    });

    if (!result?.runId) {
      throw new Error("No runId received from ComfyDeploy");
    }

    await db.insert(runs).values({
      run_id: result.runId,
      user_id: userId,
      deployment_id: "cec337bf-69d6-4886-97b0-acbeba47f1ec",
      live_status: "queued",
      inputs: {
        name,
        nationality,
        variety
      },
    });

    return result.runId;
  } catch (error) {
    console.error("Error calling ComfyDeploy API:", error);
    throw error;
  }
} 