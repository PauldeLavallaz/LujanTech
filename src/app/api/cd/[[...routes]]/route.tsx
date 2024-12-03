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

  // Headers simplificados para la API
  const headers = {
    "Authorization": `Bearer ${process.env.COMFY_DEPLOY_API_KEY}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      method: request.method,
      headers,
      // Solo incluir body para métodos que no sean GET
      ...(request.method !== "GET" && {
        body: request.body
      })
    });

    // Si la respuesta no es OK, intentar obtener el error detallado
    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = await response.json();
      } catch {
        errorDetails = await response.text();
      }

      console.error("[Proxy] Error response:", {
        status: response.status,
        statusText: response.statusText,
        details: errorDetails
      });

      return NextResponse.json({
        error: "Error calling ComfyDeploy API",
        status: response.status,
        details: errorDetails
      }, { status: response.status });
    }

    // Intentar devolver JSON si es posible
    try {
      const data = await response.json();
      return NextResponse.json(data);
    } catch {
      // Si no es JSON, devolver el texto
      const text = await response.text();
      return new NextResponse(text, {
        status: response.status,
        headers: {
          "Content-Type": "text/plain",
        }
      });
    }
  } catch (error) {
    console.error("[Proxy] Error:", error);
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
