"use client";

import { GenerationModal } from "@/components/GenerationModal";
import { ImageGenerationResult } from "@/components/ImageGenerationResult";
import { useState } from "react";

export default function BasicGeneratorPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generations, setGenerations] = useState<Array<{ runId: string }>>([]);
  const [formData, setFormData] = useState({
    prompt: "",
    width: 896,
    height: 1152,
  });

  const handleGenerate = async (data: { prompt: string; width: number; height: number }) => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to generate");

      const { runId } = await response.json();
      setGenerations(prev => [{ runId }, ...prev]);
    } catch (error) {
      console.error("Generation error:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header con botón de generar (solo mobile) */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Generador Básico</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="md:hidden bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Generar
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Grid de imágenes generadas */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {generations.map((gen, index) => (
            <ImageGenerationResult
              key={gen.runId + index}
              runId={gen.runId}
            />
          ))}
        </div>

        {/* Formulario desktop (ahora a la derecha) */}
        <form 
          className="hidden md:flex flex-col gap-4 w-80 sticky top-4 h-fit"
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate(formData);
          }}
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium">Prompt</label>
            <input
              type="text"
              value={formData.prompt}
              onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              placeholder="Describe what you want to generate..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Width</label>
            <input
              type="number"
              value={formData.width}
              onChange={(e) => setFormData(prev => ({ ...prev, width: Number(e.target.value) }))}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Height</label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData(prev => ({ ...prev, height: Number(e.target.value) }))}
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

      {/* Modal de generación (solo mobile) */}
      <GenerationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleGenerate}
      />
    </div>
  );
} 