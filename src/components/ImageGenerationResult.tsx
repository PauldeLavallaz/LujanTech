"use client";

import { LoadingIcon } from "@/components/LoadingIcon";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useComfyQuery } from "@/hooks/hooks";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ComfyDeployRun } from "../types/types";

export function ImageGenerationResult({
  runId,
  className,
}: { runId: string } & React.ComponentProps<"div">) {
  const [image, setImage] = useState("");
  const [status, setStatus] = useState<string>("queued");
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/status/${runId}`);
        const data = await response.json();
        
        if (data.live_status) {
          setStatus(data.live_status);
        }
        
        if (data.progress) {
          setProgress(data.progress);
        }

        if (data.image_url) {
          setImage(data.image_url);
          setLoading(false);
          return true; // Imagen encontrada
        }
        
        return false; // Imagen aún no disponible
      } catch (error) {
        console.error("Error checking status:", error);
        return false;
      }
    };

    const interval = setInterval(async () => {
      const imageFound = await checkStatus();
      if (imageFound) {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [runId]);

  return (
    <div
      className={cn(
        "border border-gray-200 w-full aspect-[512/512] relative",
        className
      )}
    >
      {!loading && image && (
        <img className="w-full h-full" src={image} alt="Generated image" />
      )}
      {!image && (
        <div className="absolute z-10 top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-2 px-4">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            {status === "queued" && "En cola..."}
            {status === "processing" && "Procesando..."}
            {status === "completed" && "¡Completado!"}
            {status === "error" && "¡Ocurrió un error!"}
            <LoadingIcon />
          </div>
          <Progress value={progress * 100} className="h-[2px] w-full" />
        </div>
      )}
      {loading && !image && <Skeleton className="w-full h-full" />}
    </div>
  );
}
