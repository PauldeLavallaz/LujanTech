import { db } from "@/db/db";
import { runs } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm/expressions";
import { ComfyDeploy } from "comfydeploy";

const cd = new ComfyDeploy({
  bearer: process.env.COMFY_DEPLOY_API_KEY!,
});

export async function generateImage(
  prompt: string,
  endpoint: string,
  options: { height: number; width: number; lora: string; batchSize: number }
) {
  const { userId } = auth();
  if (!userId) throw new Error("User not found");

  const { height, width, lora } = options;

  try {
    const result = await cd.run.queue({
      deploymentId: "e322689e-065a-4d33-aa6a-ee941803ca95",
      webhook: `${endpoint}/api/webhook`,
      inputs: {
        lora_strength: 0.5,
        prompt,
        lora: lora || "",
        width,
        height
      }
    });

    if (!result?.runId) {
      throw new Error("No runId received from ComfyDeploy");
    }

    await db.insert(runs).values({
      run_id: result.runId,
      user_id: userId,
      live_status: "queued",
      inputs: {
        prompt,
        height: height.toString(),
        width: width.toString(),
        lora,
        lora_strength: "0.5"
      },
    });

    return result.runId;
  } catch (error) {
    console.error("Error calling ComfyDeploy API:", error);
    throw error;
  }
}
  
  