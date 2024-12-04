"use client";

import { ReactNode } from "react";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Sidebar } from "./Sidebar";

interface GeneratorLayoutProps {
  children: ReactNode;
  inputs: ReactNode;
}

export function GeneratorLayout({ children, inputs }: GeneratorLayoutProps) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Área principal de imágenes generadas */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </ScrollArea>

        {/* Panel lateral de inputs */}
        <Card className="w-[400px] border-l rounded-none h-screen overflow-y-auto">
          <div className="p-6 space-y-6">
            {inputs}
          </div>
        </Card>
      </div>
    </div>
  );
} 