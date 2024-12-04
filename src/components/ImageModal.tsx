"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

export function ImageModal({ imageUrl, onClose }: ImageModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent">
        <div className="relative">
          {/* Botón de cerrar personalizado */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute -top-10 right-0 rounded-full bg-white/10 hover:bg-white/20 text-white z-50"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Imagen */}
          <img
            src={imageUrl}
            alt="Generated image"
            className="rounded-lg max-h-[85vh] w-auto object-contain mx-auto"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 