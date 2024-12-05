"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón de menú móvil */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Overlay para cerrar el menú en móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r transition-transform duration-200 ease-in-out",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 pt-20 md:pt-4">
          <h1 className="text-xl font-bold mb-8">Morfeo Dreams Lab</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-500 mb-2">APLICACIÓN</h2>
              <nav className="space-y-2">
                <Link href="/flujos" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                  <span>Flujos</span>
                </Link>
                <Link href="/generator/basic" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                  <span>Generador Básico</span>
                </Link>
                <Link href="/franatics" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                  <span>Franatics</span>
                </Link>
              </nav>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-500 mb-2">CUENTA</h2>
              <nav className="space-y-2">
                <Link href="/configuracion" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                  <span>Configuración</span>
                </Link>
                <Link href="/api-keys" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                  <span>API Keys</span>
                </Link>
                <Link href="/uso" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                  <span>Uso</span>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
} 