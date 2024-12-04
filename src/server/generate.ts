import { db } from "@/db/db";
import { runs } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function generateImage(prompt: string, endpoint: string, options: any) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  // Crear el run en la base de datos
  const run_id = crypto.randomUUID();

  try {
    // Iniciar la generación primero
    const response = await fetch(`${endpoint}/api/cd/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deploymentId: options.deploymentId,
        inputs: {
          prompt,
          height: options.height,
          width: options.width,
          lora: options.lora || "",
          lora_strength: options.lora_strength || 0.5,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to start generation");
    }

    // Si la generación se inició correctamente, guardar en la base de datos
    await db.insert(runs).values({
      run_id,
      user_id: userId,
      inputs: options,
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
  
  