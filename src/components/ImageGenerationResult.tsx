"use client";

import { LoadingIcon } from "@/components/LoadingIcon";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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
        const response = await fetch(`/api/cd/run/${runId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }

        const data = await response.json();
        
        // Actualizar estado y progreso
        if (data.status) {
          setStatus(data.status);
          setProgress(data.progress || 0);
        }

        // Verificar si hay imagen
        if (data.outputs?.[0]?.data?.images?.[0]?.url) {
          setImage(data.outputs[0].data.images[0].url);
          setLoading(false);
          return true;
        }

        // Si hay error, detener el polling
        if (data.status === 'error') {
          setLoading(false);
          return true;
        }

        return false;
      } catch (error) {
        console.error("[Status Check] Error:", error);
        setStatus("error");
        setLoading(false);
        return true;
      }
    };

    // Hacer el primer check inmediatamente
    checkStatus();

    // Iniciar polling
    const interval = setInterval(checkStatus, 2000);

    return () => clearInterval(interval);
  }, [runId, initialImageUrl]);

  // No mostrar nada si no hay runId
  if (!runId) return null;

  return (
    <div className={cn("relative", className)}>
      {/* Imagen completada */}
      {!loading && image && (
        <div className="aspect-square">
          <img 
            src={image} 
            alt="Generated image" 
            className="w-full h-full object-cover cursor-pointer rounded-lg"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      )}
      
      {/* Estado de generación */}
      {!loading && !image && (
        <div className="aspect-square border rounded-lg flex flex-col items-center justify-center gap-2 px-4 bg-gray-50">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            {status === "queued" && "En cola..."}
            {status === "running" && "Procesando..."}
            {status === "uploading" && "Finalizando..."}
            {status === "completed" && "¡Completado!"}
            {status === "error" && "¡Ocurrió un error!"}
            {(status === "queued" || status === "running" || status === "uploading") && (
              <LoadingIcon />
            )}
          </div>
          <Progress value={progress * 100} className="h-[2px] w-full" />
          <span className="text-sm text-center text-gray-400">
            {progress > 0 && `${Math.round(progress * 100)}%`}
          </span>
        </div>
      )}

      {/* Estado inicial de carga */}
      {loading && (
        <div className="aspect-square">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      )}

      {/* Modal para ver la imagen */}
      {isModalOpen && image && (
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
    </div>
  );
}
