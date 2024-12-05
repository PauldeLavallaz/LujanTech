"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface GenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { prompt: string; width: number; height: number }) => void;
  title?: string;
}

export function GenerationModal({ isOpen, onClose, onSubmit, title = "Confirm run" }: GenerationModalProps) {
  const [prompt, setPrompt] = useState("");
  const [width, setWidth] = useState("896");
  const [height, setHeight] = useState("1152");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      prompt,
      width: Number(width),
      height: Number(height)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">prompt</label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Describe what you want to generate..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">width</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">height</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
          >
            Run ▶
          </button>
        </form>
      </div>
    </div>
  );
} 