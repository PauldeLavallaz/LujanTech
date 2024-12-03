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
    <div className="fixed z-50 bottom-0 md:bottom-2 flex flex-col gap-2 w-full md:max-w-lg mx-auto">
      <Card className="p-2 shadow-lg rounded-none md:rounded-2xl">
        <div className="flex flex-col gap-4">
          {/* Prompt Input */}
          <Input
            id="input"
            className="rounded-xl text-base sm:text-sm z-10"
            value={formData.prompt}
            onChange={(e) => handleSelection("prompt", e.target.value)}
            placeholder="Enter a prompt to generate an image"
          />

          {/* Height & Width */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Dimensions:</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Width</label>
                <Input
                  type="number"
                  min={512}
                  max={2048}
                  value={formData.width}
                  onChange={(e) => handleSelection("width", Math.min(2048, Math.max(512, parseInt(e.target.value) || 512)))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Height</label>
                <Input
                  type="number"
                  min={512}
                  max={2048}
                  value={formData.height}
                  onChange={(e) => handleSelection("height", Math.min(2048, Math.max(512, parseInt(e.target.value) || 512)))}
                  className="mt-1"
                />
              </div>
            </div>
            
            {/* Dimensiones preestablecidas */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                { height: 1152, width: 896, label: "896x1152" },
                { height: 896, width: 1152, label: "1152x896" },
                { height: 1024, width: 1024, label: "1024x1024" },
                { height: 768, width: 768, label: "768x768" },
              ].map((option) => (
                <Button
                  key={option.label}
                  className={cn(
                    "rounded-md p-2 text-sm",
                    formData.height === option.height && formData.width === option.width
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  )}
                  onClick={() => {
                    handleSelection("height", option.height);
                    handleSelection("width", option.width);
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* LoRA Dropdown y Strength */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">LoRA:</label>
            <select
              value={formData.lora}
              onChange={(e) => handleSelection("lora", e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="">Sin LoRA</option>
              <option value="flux-RealismLora.safetensors">Realism LoRA</option>
            </select>

            {formData.lora && (
              <div className="mt-2">
                <label className="text-sm text-gray-500">
                  LoRA Strength: {formData.lora_strength}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.lora_strength}
                  onChange={(e) => handleSelection("lora_strength", parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div className="flex gap-2">
            <Button
              variant="expandIcon"
              className={cn("rounded-xl transition-all w-full p-3", isGenerating && "opacity-50 cursor-not-allowed")}
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate"}
            </Button>

            <Button
              variant="outline"
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
