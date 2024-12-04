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
      // Aquí iría la lógica para subir la imagen a tu servidor/storage
      // Por ahora, convertimos a base64 como ejemplo
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Error al cargar la imagen");
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
          <Upload className="w-8 h-8" />
          <p className="text-sm">Arrastrá o hacé click para subir tu selfie</p>
        </div>
      )}
    </div>
  );
} 