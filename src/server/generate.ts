import { db } from "@/db/db";
import { runs } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm/expressions";


export async function generateImage(
    prompt: string,
    endpoint: string,
    options: { height: number; width: number; lora: string; batchSize: number }
  ) {
    const { userId } = auth();
    if (!userId) throw new Error("User not found");
  
    const { height, width, lora } = options;
  
    const run_id = `run_${Date.now()}`;
  
    const inputsForDB = {
      prompt,
      height: height.toString(),
      width: width.toString(),
      lora,
      lora_strength: "0.1"
    };
  
    await db.insert(runs).values({
      run_id,
      user_id: userId,
      live_status: "queued",
      inputs: inputsForDB,
    });
  
    const inputsForAPI = {
      prompt: prompt,
      height,
      width,
      lora,
      lora_strength: 0.1
    };
  
    try {
      const response = await fetch("https://api.comfydeploy.com/api/run/queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.COMFY_DEPLOY_API_KEY}`,
        },
        body: JSON.stringify({
          deployment_id: "e322689e-065a-4d33-aa6a-ee941803ca95",
          inputs: inputsForAPI,
          webhook: `${endpoint}/api/webhook`,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`ComfyDeploy API responded with status ${response.status}`);
      }
  
      const result = await response.json();
      if (result?.id) {
        await db.update(runs).set({
          live_status: "processing",
        }).where(eq(runs.run_id, run_id));
        return run_id;
      } else {
        throw new Error("Image generation failed: Invalid response from ComfyDeploy");
      }
    } catch (error) {
      console.error("Error calling ComfyDeploy API:", error);
      await db.update(runs).set({
        live_status: "error",
      }).where(eq(runs.run_id, run_id));
      throw new Error("Error generating image");
    }
  }
  
  