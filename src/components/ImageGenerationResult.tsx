"use client";

import { LoadingIcon } from "@/components/LoadingIcon";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";

interface ImageGenerationResultProps {
  runId: string;
  className?: string;
  initialStatus?: string;
  initialImageUrl?: string;
  onClick?: () => void;
}

export function ImageGenerationResult({ 
  runId, 
  className, 
  initialStatus,
  initialImageUrl,
  onClick 
}: ImageGenerationResultProps) {
  const [image, setImage] = useState(initialImageUrl || "");
  const [status, setStatus] = useState<string>(initialStatus || "queued");
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(!initialImageUrl);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!runId || initialImageUrl) return;

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/cd/run/${runId}`);
        const data = await response.json();
        
        if (data.status) {
          setStatus(data.status);
          setProgress(data.progress || 0);
        }

        if (data.outputs?.[0]?.data?.images?.[0]?.url) {
          const imageUrl = data.outputs[0].data.images[0].url;
          setImage(imageUrl);
          setLoading(false);
          return true;
        }

        return false;
      } catch (error) {
        console.error("[Status Check] Error:", error);
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
  }, [runId, initialImageUrl]);

  return (
    <>
      <Card 
        className={cn(
          "overflow-hidden w-full aspect-[512/512] relative",
          className
        )}
      >
        {!loading && image && (
          <img 
            src={image} 
            alt="Generated image" 
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
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
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="max-w-[90vw] max-h-[90vh]">
            <img 
              src={image} 
              alt="Generated image" 
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
