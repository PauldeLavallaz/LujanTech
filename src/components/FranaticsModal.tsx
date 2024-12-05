"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface FranaticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FranaticsFormData) => Promise<void>;
  title?: string;
  options?: {
    varieties: Array<{
      value: string;
      label: string;
    }>;
  };
}

export function FranaticsModal({ isOpen, onClose, onSubmit, title = "Genera tu Avatar Franatics", options }: FranaticsModalProps) {
  const [formData, setFormData] = useState({
    selfie: null as File | null,
    name: "",
    nationality: "",
    favoriteProduct: "Milk",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
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
                id="selfie-upload-modal"
              />
              <label 
                htmlFor="selfie-upload-modal"
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
              name="favoriteProduct"
              className="w-full p-2 border rounded-lg"
              required
            >
              {options?.varieties ? (
                options.varieties.map(variety => (
                  <option key={variety.value} value={variety.value}>
                    {variety.label}
                  </option>
                ))
              ) : (
                <>
                  <option value="Milk">Milk</option>
                  <option value="Dark">Dark</option>
                  <option value="Pink">Pink</option>
                </>
              )}
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
    </div>
  );
} 