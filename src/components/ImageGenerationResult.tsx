"use client";

import { LoadingIcon } from "@/components/LoadingIcon";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function ImageGenerationResult({
  runId,
  className,
}: { runId: string } & React.ComponentProps<"div">) {
  const [image, setImage] = useState("");
  const [status, setStatus] = useState<string>("queued");
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!runId) return;

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/cd/run/${runId}`);
        const data = await response.json();
        
        console.log("Status check response:", data);

        if (data.status) {
          switch (data.status) {
            case "not-started":
              setStatus("queued");
              break;
            case "running":
              setStatus("processing");
              break;
            case "uploading":
              setStatus("processing");
              setProgress(0.95);
              break;
            case "success":
              setStatus("completed");
              setProgress(1);
              break;
            default:
              setStatus(data.status);
          }
        }
        
        if (typeof data.progress === 'number') {
          setProgress(data.progress);
        }

        if (data.status === "success" && data.outputs && data.outputs.length > 0) {
          const imageUrl = data.outputs[0]?.data?.images?.[0]?.url;
          if (imageUrl) {
            setImage(imageUrl);
            setLoading(false);
            return true;
          }
        }
        
        return false;
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
        <img className="w-full h-full object-cover" src={image} alt="Generated image" />
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
          <span className="text-sm text-center text-gray-400">
            {progress > 0 && `${Math.round(progress * 100)}%`}
          </span>
        </div>
      )}
      {loading && !image && <Skeleton className="w-full h-full" />}
    </div>
  );
}
