import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}

async function handleRequest(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const apiPath = pathname.replace("/api/cd", "");
  const url = `https://api.comfydeploy.com/api${apiPath}${search}`;

  console.log("[Proxy] Request URL:", url);

  // Configurar headers básicos
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${process.env.COMFY_DEPLOY_API_KEY}`);
  headers.set("Accept", "application/json");
  
  // Copiar headers relevantes de la request original
  const requestHeaders = new Headers(request.headers);
  if (requestHeaders.has("content-type")) {
    headers.set("content-type", requestHeaders.get("content-type")!);
  }

  try {
    const response = await fetch(url, {
      method: request.method,
      headers,
      body: request.method !== "GET" ? request.body : null,
    });

    // Obtener el tipo de contenido de la respuesta
    const contentType = response.headers.get("content-type") || "";

    // Si la respuesta no es OK, loguear el error
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Proxy] Error response:", {
        status: response.status,
        statusText: response.statusText,
        contentType,
        body: errorText
      });

      // Devolver un error JSON limpio
      return NextResponse.json(
        { error: "Error calling ComfyDeploy API", details: response.statusText },
        { status: response.status }
      );
    }

    // Para respuestas JSON
    if (contentType.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    // Para respuestas streaming
    if (contentType.includes("text/event-stream") || response.headers.get("Transfer-Encoding") === "chunked") {
      const transformStream = new TransformStream();
      const writer = transformStream.writable.getWriter();

      response.body?.pipeTo(new WritableStream({
        write(chunk) {
          writer.write(chunk);
        },
        close() {
          writer.close();
        }
      }));

      return new NextResponse(transformStream.readable, {
        headers: {
          "Content-Type": contentType,
        }
      });
    }

    // Para otros tipos de respuesta
    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
      }
    });

  } catch (error) {
    console.error("[Proxy] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
