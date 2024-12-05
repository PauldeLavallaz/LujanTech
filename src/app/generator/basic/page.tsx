"use client";

import { GenerationModal } from "@/components/GenerationModal";
import { ImageGenerationResult } from "@/components/ImageGenerationResult";
import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUserGenerations } from "@/hooks/useUserGenerations";
import { Generation } from '@/types/generation';

const DEPLOYMENT_ID = "e322689e-065a-4d33-aa6a-ee941803ca95";

export default function BasicGeneratorPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { generations, mutate } = useUserGenerations(DEPLOYMENT_ID);

  const handleGenerate = async (data: { prompt: string; width: number; height: number }) => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          deploymentId: DEPLOYMENT_ID
        }),
      });

      if (!response.ok) throw new Error("Failed to generate");

      const result = await response.json();
      if (result.run_id) {
        mutate(prev => ({
          generations: [{
            run_id: result.run_id,
            user_id: '',
            deployment_id: DEPLOYMENT_ID,
            live_status: 'queued',
            inputs: data,
            createdAt: new Date()
          }, ...(prev?.generations || [])]
        }), false);
        
        toast.success("¡Generación iniciada!");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Error al generar la imagen");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header con botón de generar (solo mobile) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Generador Básico</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="md:hidden bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
        >
          Generar
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Grid de imágenes generadas */}
        <div className="flex-1">
          {generations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generations.map((gen: Generation, index: number) => (
                <ImageGenerationResult
                  key={gen.run_id + index}
                  runId={gen.run_id}
                  initialStatus={gen.live_status}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg p-8 text-center text-gray-500">
              <ImagePlus className="w-12 h-12 mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay imágenes generadas</h3>
              <p className="text-sm max-w-md">
                Haz click en el botón &quot;Generar&quot; para crear tu primera imagen con IA
              </p>
            </div>
          )}
        </div>

        {/* Formulario desktop (a la derecha) */}
        <div className="hidden md:block w-80">
          <form 
            className="sticky top-4 space-y-4 bg-white p-4 rounded-lg border"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleGenerate({
                prompt: formData.get('prompt') as string,
                width: Number(formData.get('width')),
                height: Number(formData.get('height'))
              });
            }}
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium">Prompt</label>
              <input
                name="prompt"
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="Describe what you want to generate..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Width</label>
              <input
                name="width"
                type="number"
                defaultValue={896}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Height</label>
              <input
                name="height"
                type="number"
                defaultValue={1152}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
            >
              Generar
            </button>
          </form>
        </div>
      </div>

      {/* Modal de generación (solo mobile) */}
      <GenerationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleGenerate}
      />
    </div>
  );
} 