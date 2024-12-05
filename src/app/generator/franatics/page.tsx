"use client";

import { ImageGenerationResult } from "@/components/ImageGenerationResult";
import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { FranaticsModal } from "@/components/FranaticsModal";

interface FranaticsFormData {
  selfie: File | null;
  name: string;
  nationality: string;
  favoriteProduct: string;
}

export default function FranaticsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generations, setGenerations] = useState<Array<{ runId: string }>>([]);
  const [formData, setFormData] = useState<FranaticsFormData>({
    selfie: null,
    name: "",
    nationality: "",
    favoriteProduct: "Milk",
  });

  const handleGenerate = async (data: FranaticsFormData) => {
    try {
      const formData = new FormData();
      if (data.selfie) formData.append("selfie", data.selfie);
      formData.append("name", data.name);
      formData.append("nationality", data.nationality);
      formData.append("favoriteProduct", data.favoriteProduct);

      const response = await fetch("/api/generate/franatics", {
        method: "POST",
        body: formData,
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
      <div className="flex justify-between items-center mb-8 md:mb-12 pt-16 md:pt-0">
        <h1 className="text-2xl font-bold">Franatics</h1>
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
              {generations.map((gen, index) => (
                <ImageGenerationResult
                  key={gen.runId + index}
                  runId={gen.runId}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg p-8 text-center text-gray-500">
              <ImagePlus className="w-12 h-12 mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay avatares generados</h3>
              <p className="text-sm max-w-md">
                Haz click en el botón &quot;Generar&quot; para crear tu primer avatar Franatics
              </p>
            </div>
          )}
        </div>

        {/* Formulario desktop (a la derecha) */}
        <form 
          className="hidden md:flex flex-col gap-4 w-80 sticky top-4 h-fit"
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate(formData);
          }}
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium">Tu Selfie</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData(prev => ({ ...prev, selfie: file }));
                  }
                }}
                className="hidden"
                id="selfie-upload"
              />
              <label 
                htmlFor="selfie-upload"
                className="cursor-pointer text-sm text-gray-500"
              >
                Arrastra o haz click para subir tu selfie
                <br />
                <span className="text-xs">Máximo 5MB - JPG o PNG</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              placeholder="Tu nombre completo"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Nacionalidad</label>
            <input
              type="text"
              value={formData.nationality}
              onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              placeholder="Tu nacionalidad"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Tu Franui Favorito</label>
            <select
              value={formData.favoriteProduct}
              onChange={(e) => setFormData(prev => ({ ...prev, favoriteProduct: e.target.value }))}
              className="w-full p-2 border rounded-lg"
            >
              <option value="Milk">Milk</option>
              <option value="Dark">Dark</option>
              <option value="White">White</option>
            </select>
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
      <FranaticsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleGenerate}
        title="Genera tu Avatar Franatics"
      />
    </div>
  );
} 