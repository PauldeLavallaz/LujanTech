"use client";

import { GeneratorLayout } from "@/components/GeneratorLayout";
import { UserRuns } from "@/components/UserRuns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { ImageUpload } from "@/components/ImageUpload";

export default function FranaticsGenerator() {
  const [formData, setFormData] = useState({
    img_face: "",
    txt_nacionalidad: "",
    txt_nombre: "",
    num: 1,
    variedad: "Milk"
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!formData.img_face || !formData.txt_nombre || !formData.txt_nacionalidad) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deploymentId: "cec337bf-69d6-4886-97b0-acbeba47f1ec",
          webhook: window.location.origin + "/api/webhook",
          inputs: {
            img_face: formData.img_face,
            txt_nacionalidad: formData.txt_nacionalidad,
            txt_nombre: formData.txt_nombre,
            num: formData.num,
            variedad: formData.variedad,
            img_man: "",
            img_woman: "",
            depth_man: "",
            depth_woman: "",
            canny_man: "",
            canny_woman: ""
          }
        }),
      });

      const result = await response.json();
      if (response.ok && result.run_id) {
        toast.success("¡Generación de credencial iniciada!");
        mutate("userRuns");
      } else {
        toast.error(result.error || "Error al generar la credencial");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al generar la credencial");
    } finally {
      setIsGenerating(false);
    }
  };

  const inputs = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Tu Selfie</Label>
        <ImageUpload
          value={formData.img_face}
          onChange={(url) => setFormData(prev => ({ ...prev, img_face: url }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          value={formData.txt_nombre}
          onChange={(e) => setFormData(prev => ({ ...prev, txt_nombre: e.target.value }))}
          placeholder="Tu nombre completo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nacionalidad">Nacionalidad</Label>
        <Input
          id="nacionalidad"
          value={formData.txt_nacionalidad}
          onChange={(e) => setFormData(prev => ({ ...prev, txt_nacionalidad: e.target.value }))}
          placeholder="Tu nacionalidad"
        />
      </div>

      <div className="space-y-2">
        <Label>Tu Franui Favorito</Label>
        <Select 
          value={formData.variedad}
          onValueChange={(value) => setFormData(prev => ({ ...prev, variedad: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Elegí tu variedad favorita" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Milk">Milk</SelectItem>
            <SelectItem value="Dark">Dark</SelectItem>
            <SelectItem value="Pink">Pink</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        className="w-full" 
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? "Generando..." : "Generar Credencial"}
      </Button>
    </div>
  );

  return (
    <GeneratorLayout inputs={inputs}>
      <UserRuns deploymentId="cec337bf-69d6-4886-97b0-acbeba47f1ec" />
    </GeneratorLayout>
  );
} 