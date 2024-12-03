import { X } from "lucide-react";
import { Button } from "./ui/button";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

export function ImageModal({ imageUrl, onClose }: ImageModalProps) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-4 -right-4 rounded-full bg-white/10 hover:bg-white/20 text-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <img 
          src={imageUrl} 
          alt="Generated image"
          className="rounded-lg max-w-full max-h-[90vh] object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
} 