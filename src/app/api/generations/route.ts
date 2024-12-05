import { db } from "@/db/db";
import { runs } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(request.url);
  const deploymentId = searchParams.get("deploymentId");

  try {
    const query = deploymentId
      ? and(eq(runs.user_id, userId), eq(runs.deployment_id, deploymentId))
      : eq(runs.user_id, userId);

    const userRuns = await db.select().from(runs).where(query).orderBy(runs.createdAt);

    return Response.json({ generations: userRuns });
  } catch (error) {
    console.error("Error fetching generations:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
} 