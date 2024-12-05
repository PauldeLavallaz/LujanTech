import { ComfyDeploy } from "comfydeploy";
import { NextRequest } from "next/server";

const cd = new ComfyDeploy({
  bearer: process.env.COMFY_DEPLOY_API_KEY!,
});

export async function GET(
  request: NextRequest,
  context: { params: { runId: string } }
) {
  try {
    const data = await cd.run.get({
      runId: context.params.runId
    });
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching run status:", error);
    return new Response("Error fetching status", { status: 500 });
  }
} 