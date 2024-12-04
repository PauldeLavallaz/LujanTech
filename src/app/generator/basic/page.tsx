"use client";

import { GeneratorLayout } from "@/components/GeneratorLayout";
import { UserRuns } from "@/components/UserRuns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

export default function BasicGenerator() {
  const [formData, setFormData] = useState({
    prompt: "",
    height: 1152,
    width: 896,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!formData.prompt.trim()) {
      toast.error("Por favor ingresa un prompt");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deploymentId: "e322689e-065a-4d33-aa6a-ee941803ca95",
          webhook: window.location.origin + "/api/webhook",
          inputs: {
            prompt: formData.prompt,
            height: formData.height,
            width: formData.width
          }
        }),
      });

      const result = await response.json();
      if (response.ok && result.run_id) {
        toast.success("¡Generación de imagen iniciada!");
        mutate("userRuns");
      } else {
        console.error("Generation failed:", result);
        toast.error(result.error || "Fallo al iniciar la generación de imagen.");
      }
    } catch (error) {
      console.error("Error generando imagen:", error);
      toast.error("Ocurrió un error al generar la imagen.");
    } finally {
      setIsGenerating(false);
    }
  };

  const inputs = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="prompt">Prompt</Label>
        <Input 
          id="prompt"
          value={formData.prompt}
          onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
          placeholder="Describe lo que quieres generar..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="width">Width</Label>
        <Input 
          id="width"
          type="number"
          value={formData.width}
          onChange={(e) => setFormData(prev => ({ ...prev, width: parseInt(e.target.value) || 896 }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="height">Height</Label>
        <Input 
          id="height"
          type="number"
          value={formData.height}
          onChange={(e) => setFormData(prev => ({ ...prev, height: parseInt(e.target.value) || 1152 }))}
        />
      </div>
      <Button 
        className="w-full" 
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? "Generando..." : "Generar"}
      </Button>
    </div>
  );

  return (
    <GeneratorLayout inputs={inputs}>
      <UserRuns deploymentId="e322689e-065a-4d33-aa6a-ee941803ca95" />
    </GeneratorLayout>
  );
} 