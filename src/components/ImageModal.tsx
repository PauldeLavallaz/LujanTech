"use client";

import { X } from "lucide-react";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

export function ImageModal({ imageUrl, onClose }: ImageModalProps) {
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-[90vw] max-h-[90vh] w-auto h-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Contenedor de la imagen con ratio automático */}
        <div className="relative w-auto h-auto">
          <img
            src={imageUrl}
            alt="Imagen generada"
            className="rounded-lg object-contain max-w-[90vw] max-h-[85vh] w-auto h-auto"
            style={{
              boxShadow: '0 0 30px rgba(0, 0, 0, 0.3)'
            }}
          />
        </div>
      </div>
    </div>
  );
} 