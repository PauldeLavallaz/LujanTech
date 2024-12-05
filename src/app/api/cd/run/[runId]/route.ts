import { ComfyDeploy } from "comfydeploy";
import { type NextRequest } from "next/server";

const cd = new ComfyDeploy({
  bearer: process.env.COMFY_DEPLOY_API_KEY!,
});

type Props = {
  params: {
    runId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function GET(request: NextRequest, props: Props) {
  try {
    const data = await cd.run.get({
      runId: props.params.runId
    });
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching run status:", error);
    return new Response("Error fetching status", { status: 500 });
  }
} 