"use client";

import { Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    try {
      // Crear FormData
      const formData = new FormData();
      formData.append('file', file);

      // Subir archivo
      const response = await fetch("/api/file/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Error al subir la imagen");
      }

      const data = await response.json();
      console.log("Upload response:", data);

      if (data.file_url) {
        onChange(data.file_url);
        toast.success("Imagen cargada exitosamente");
      } else {
        throw new Error("No se recibió la URL de la imagen");
      }
    } catch (error) {
      console.error("Error al subir imagen:", error);
      toast.error("Error al cargar la imagen. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024 // 5MB máximo
  });

  return (
    <div 
      {...getRootProps()} 
      className={`
        border-2 border-dashed rounded-lg p-4 transition-colors
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-200 hover:bg-gray-50'}
        ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
      `}
    >
      <input {...getInputProps()} />
      {value ? (
        <div className="relative group">
          <img 
            src={value} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white">
            Click para cambiar
          </div>
        </div>
      ) : (
        <div className="h-48 flex flex-col items-center justify-center gap-2 text-gray-500">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
              <span>Subiendo...</span>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8" />
              <p className="text-sm text-center">
                {isDragActive ? 
                  "Soltá la imagen aquí" : 
                  "Arrastrá o hacé click para subir tu selfie"
                }
              </p>
              <p className="text-xs text-gray-400">
                Máximo 5MB - JPG o PNG
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
} 