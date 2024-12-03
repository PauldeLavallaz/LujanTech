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
            <label className="text-sm font-medium">Height & Width:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { height: 1152, width: 896, label: "896x1152" },
                { height: 896, width: 1152, label: "1152x896" },
                { height: 1024, width: 1024, label: "1024x1024" },
                { height: 768, width: 768, label: "768x768" },
              ].map((option) => (
                <Button
                  key={option.label}
                  className={cn(
                    "rounded-md p-2",
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

          {/* LoRA Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">LoRA:</label>
            <select
              value={formData.lora}
              onChange={(e) => handleSelection("lora", e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="">Select LoRA</option>
              <option value="lora1">LoRA 1</option>
              <option value="lora2">LoRA 2</option>
              <option value="lora3">LoRA 3</option>
            </select>
          </div>

          {/* Generate Button */}
          <Button
            variant="expandIcon"
            className={cn("rounded-xl transition-all w-full p-3", isGenerating && "opacity-50 cursor-not-allowed")}
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
