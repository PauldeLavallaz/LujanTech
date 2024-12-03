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
  const run_id = `run_${Date.now()}`;

  await db.insert(runs).values({
    run_id,
    user_id: userId,
    live_status: "queued",
    inputs: {
      prompt,
      height: height.toString(),
      width: width.toString(),
      lora,
      lora_strength: "0.1"
    },
  });

  try {
    const result = await cd.run.queue({
      deploymentId: "e322689e-065a-4d33-aa6a-ee941803ca95",
      webhook: `${endpoint}/api/webhook`,
      inputs: {
        prompt,
        height,
        width,
        lora,
        lora_strength: 0.1
      }
    });

    if (result?.runId) {
      await db.update(runs)
        .set({
          live_status: "processing",
        })
        .where(eq(runs.run_id, run_id));
      
      return run_id;
    } else {
      throw new Error("No run_id received from ComfyDeploy");
    }
  } catch (error) {
    console.error("Error calling ComfyDeploy API:", error);
    await db.update(runs)
      .set({
        live_status: "error",
      })
      .where(eq(runs.run_id, run_id));
    throw error;
  }
}
  
  