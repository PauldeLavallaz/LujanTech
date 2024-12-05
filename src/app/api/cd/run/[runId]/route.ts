import { ComfyDeploy } from "comfydeploy";
import { NextRequest } from "next/server";

const cd = new ComfyDeploy({
  bearer: process.env.COMFY_DEPLOY_API_KEY!,
});

interface RouteParams {
  runId: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const data = await cd.run.get({
      runId: params.runId
    });
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching run status:", error);
    return new Response("Error fetching status", { status: 500 });
  }
} 