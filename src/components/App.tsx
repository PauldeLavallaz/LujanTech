"use client";

import { ImageGenerationResult } from "@/components/ImageGenerationResult";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { WandSparklesIcon } from "lucide-react";
import { toast } from "sonner";
import { mutate } from "swr";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";
import { ImageModal } from "./ImageModal";

export function App() {
  const [formData, setFormData] = useState({
    prompt: "A photo of a crystal ball. Realistic National geographic photo, epic",
    height: 1152,
    width: 896,
    lora: "",
    lora_strength: 0.1
  });
  const [debouncedPrompt] = useDebounce(formData.prompt, 200);
  const [isGenerating, setIsGenerating] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);

  const handleSelection = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
  
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: formData.prompt, // Usar formData para acceder a las propiedades
          height: formData.height,
          width: formData.width,
          lora: formData.lora,
          lora_strength: formData.lora_strength
        }),
      });
  
      const result = await response.json();
      if (response.ok && result.run_id) {
        toast.success("¡Generación de imagen iniciada!");
        setRunId(result.run_id);
        mutate("userRuns");
      } else {
        toast.error("Fallo al iniciar la generación de imagen.");
      }
    } catch (error) {
      console.error("Error generando imagen:", error);
      toast.error("Ocurrió un error al generar la imagen.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCleanStuckRuns = async () => {
    try {
      const response = await fetch("/api/clean", { method: "POST" });
      if (response.ok) {
        toast.success("Ejecuciones trabadas limpiadas");
        mutate("userRuns"); // Refrescar la lista
      } else {
        toast.error("Error al limpiar las ejecuciones");
      }
    } catch (error) {
      console.error("Error cleaning stuck runs:", error);
      toast.error("Error al limpiar las ejecuciones");
    }
  };

  useEffect(() => {
    if (runId) {
      const interval = setInterval(async () => {
        const response = await fetch(`/api/status/${runId}`);
        const result = await response.json();

        if (result.image_url) {
          mutate("userRuns");
          clearInterval(interval);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [runId]);

  return (
    <div className="fixed z-50 bottom-0 left-0 right-0 md:bottom-4 flex justify-center w-full px-4">
      <Card className="w-full max-w-lg p-4 shadow-lg rounded-none md:rounded-2xl">
        <div className="flex flex-col gap-3">
          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-xs font-medium">Prompt</label>
            <Input
              id="input"
              className="rounded-xl text-sm"
              value={formData.prompt}
              onChange={(e) => handleSelection("prompt", e.target.value)}
              placeholder="A photo of..."
            />
          </div>

          {/* Dimensions & LoRA */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column: Dimensions */}
            <div className="space-y-2">
              <label className="text-xs font-medium">Dimensions</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    type="number"
                    min={512}
                    max={2048}
                    value={formData.width}
                    onChange={(e) => handleSelection("width", Math.min(2048, Math.max(512, parseInt(e.target.value) || 512)))}
                    className="h-8 text-xs"
                  />
                  <span className="text-[10px] text-gray-500">Width</span>
                </div>
                <div>
                  <Input
                    type="number"
                    min={512}
                    max={2048}
                    value={formData.height}
                    onChange={(e) => handleSelection("height", Math.min(2048, Math.max(512, parseInt(e.target.value) || 512)))}
                    className="h-8 text-xs"
                  />
                  <span className="text-[10px] text-gray-500">Height</span>
                </div>
              </div>
            </div>

            {/* Right Column: LoRA */}
            <div className="space-y-2">
              <label className="text-xs font-medium">Elegí tu LoRA</label>
              <select
                value={formData.lora}
                onChange={(e) => handleSelection("lora", e.target.value)}
                className="w-full h-8 text-xs border rounded px-2"
              >
                <option value="">Sin LoRA</option>
                <option value="flux-RealismLora.safetensors">Realism LoRA</option>
              </select>

              {formData.lora && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-500">Strength</span>
                    <span className="text-[10px] text-gray-500">{formData.lora_strength}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.lora_strength}
                    onChange={(e) => handleSelection("lora_strength", parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex gap-2">
            <Button
              variant="default"
              className={cn("w-full rounded-xl py-2", isGenerating && "opacity-50 cursor-not-allowed")}
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? "Generando..." : "Generar"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl"
              onClick={handleCleanStuckRuns}
            >
              🧹
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
