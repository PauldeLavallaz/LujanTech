"use client";

import { ImageGenerationResult } from "@/components/ImageGenerationResult";
import { ImagePlus, Upload } from "lucide-react";
import { useState } from "react";
import { FranaticsModal } from "@/components/FranaticsModal";
import { toast } from "sonner";
import { useUserGenerations } from "@/hooks/useUserGenerations";
import { Generation } from '@/types/generation';

interface FranaticsFormData {
  selfie: File | null;
  name: string;
  nationality: string;
  favoriteProduct: string;
}

const DEPLOYMENT_ID = "franatics-deployment-id";

export default function FranaticsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { generations, mutate } = useUserGenerations(DEPLOYMENT_ID);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleGenerate = async (data: FranaticsFormData) => {
    try {
      const formData = new FormData();
      if (data.selfie) formData.append("selfie", data.selfie);
      formData.append("name", data.name);
      formData.append("nationality", data.nationality);
      formData.append("favoriteProduct", data.favoriteProduct);
      formData.append("deploymentId", DEPLOYMENT_ID);

      const response = await fetch("/api/generate/franatics", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to generate");

      const result = await response.json();
      if (result.run_id) {
        mutate();
        toast.success("¡Generación iniciada!");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Error al generar el avatar");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    handleGenerate({
      selfie: selectedFile,
      name: formData.get('name') as string,
      nationality: formData.get('nationality') as string,
      favoriteProduct: formData.get('favoriteProduct') as string
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header con botón de generar (solo mobile) */}
      <div className="flex justify-between items-center mb-6">
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
              {generations.map((gen: Generation, index: number) => (
                <ImageGenerationResult
                  key={gen.run_id + index}
                  runId={gen.run_id}
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
        <div className="hidden md:block w-80">
          <form 
            className="sticky top-4 space-y-4 bg-white p-4 rounded-lg border"
            onSubmit={handleSubmit}
          >
            {/* File Upload Area */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Tu Selfie</label>
              <div 
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                  previewUrl ? 'border-green-500' : 'border-gray-300'
                }`}
                onClick={() => document.getElementById('selfie-upload')?.click()}
              >
                <input
                  id="selfie-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
                
                {previewUrl ? (
                  <div className="relative aspect-square w-full max-w-[200px] mx-auto">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                      <p className="text-white text-sm">Cambiar imagen</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-4">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Arrastra o haz click para subir tu selfie
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Máximo 5MB - JPG o PNG
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">Nombre</label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="Tu nombre completo"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="nationality" className="block text-sm font-medium">Nacionalidad</label>
              <input
                id="nationality"
                name="nationality"
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="Tu nacionalidad"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="favoriteProduct" className="block text-sm font-medium">Tu Franui Favorito</label>
              <select
                id="favoriteProduct"
                name="favoriteProduct"
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="Milk">Milk</option>
                <option value="Dark">Dark</option>
                <option value="White">White</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
              disabled={!selectedFile}
            >
              Generar
            </button>
          </form>
        </div>
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