import { db } from "@/db/db";
import { runs } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function generateImage(prompt: string, endpoint: string, options: any) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const run_id = crypto.randomUUID();

  try {
    // Iniciar la generación
    const response = await fetch(`${endpoint}/api/cd/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.COMFY_DEPLOY_API_KEY}`
      },
      body: JSON.stringify({
        deploymentId: options.deploymentId,
        webhook: options.webhook,
        inputs: options.deploymentId === "e322689e-065a-4d33-aa6a-ee941803ca95" 
          ? {
              prompt,
              height: options.height,
              width: options.width,
            }
          : options.inputs
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to start generation");
    }

    // Si la generación se inició correctamente, guardar en la base de datos
    await db.insert(runs).values({
      run_id,
      user_id: userId,
      inputs: options.inputs || options,
      live_status: "queued",
      progress: 0,
      deployment_id: options.deploymentId
    });

    return run_id;
  } catch (error) {
    console.error("Error in generateImage:", error);
    throw error;
  }
}
  
  