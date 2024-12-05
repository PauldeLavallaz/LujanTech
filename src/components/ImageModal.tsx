"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

export function ImageModal({ imageUrl, onClose }: ImageModalProps) {
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* Contenedor de la imagen */}
        <div 
          className="relative max-w-[90vw] max-h-[90vh]"
          onClick={e => e.stopPropagation()} // Evita que el click en la imagen cierre el modal
        >
          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Imagen */}
          <img
            src={imageUrl}
            alt="Generated image"
            className="rounded-lg object-contain max-h-[85vh] w-auto mx-auto"
            style={{
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)'
            }}
          />
        </div>
      </div>
    </div>
  );
} 