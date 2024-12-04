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
      // Primero, convertimos a base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Ahora subimos la imagen a un servidor temporal
      const response = await fetch("/api/file/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          file: base64,
          filename: file.name 
        }),
      });

      if (!response.ok) {
        throw new Error("Error al subir la imagen");
      }

      const data = await response.json();
      onChange(data.file_url); // Usamos la URL devuelta por el servidor
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar la imagen");
    } finally {
      setLoading(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer"
    >
      <input {...getInputProps()} />
      {value ? (
        <img src={value} alt="Uploaded" className="w-full h-48 object-cover rounded-lg" />
      ) : (
        <div className="h-48 flex flex-col items-center justify-center gap-2 text-gray-500">
          {loading ? (
            <div className="animate-pulse">Subiendo imagen...</div>
          ) : (
            <>
              <Upload className="w-8 h-8" />
              <p className="text-sm">Arrastrá o hacé click para subir tu selfie</p>
            </>
          )}
        </div>
      )}
    </div>
  );
} 