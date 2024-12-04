"use client";

interface ImageGenerationResultProps {
  imageUrl: string | null;
  prompt?: string;
  height?: number;
  width?: number;
  lora?: string;
  lora_strength?: number;
}

export function ImageGenerationResult({
  imageUrl,
  prompt,
  height,
  width,
  lora,
  lora_strength
}: ImageGenerationResultProps) {
  return (
    <div className="relative group">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={prompt || "Generated image"}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 animate-pulse" />
      )}
      
      {/* Overlay con información */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
        {prompt && <div><strong>Prompt:</strong> {prompt}</div>}
        {width && height && <div><strong>Size:</strong> {width}x{height}</div>}
        {lora && <div><strong>LoRA:</strong> {lora} ({lora_strength})</div>}
      </div>
    </div>
  );
}
