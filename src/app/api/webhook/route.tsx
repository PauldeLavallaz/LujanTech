import { WorkflowRunWebhookBody$inboundSchema as WebhookParser } from "comfydeploy/models/components";
import { db } from "@/db/db";
import { runs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const parseData = WebhookParser.safeParse(
      await request.json()
    );

    if (!parseData.success) {
      console.error("Invalid webhook data:", parseData.error);
      return NextResponse.json({ message: "error" }, { status: 400 });
    }

    const data = parseData.data;
    console.log("Webhook data:", data); // Para ver la estructura exacta

    // Actualizar la base de datos
    await db.update(runs)
      .set({
        live_status: data.status,
        progress: data.progress || 0,
        // Asegurarnos de que la URL existe antes de intentar acceder
        ...(data.outputs?.[0]?.data?.images?.[0] && {
          image_url: typeof data.outputs[0].data.images[0] === 'string' 
            ? data.outputs[0].data.images[0]
            : data.outputs[0].data.images[0].url
        })
      })
      .where(eq(runs.run_id, data.runId)); // Usar runId en lugar de run_id

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
