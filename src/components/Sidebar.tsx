"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { 
  LayoutGrid, 
  Settings, 
  Database, 
  KeyRound,
  BarChart,
  Workflow,
  Sparkles,
  CreditCard
} from "lucide-react";
import { Menu, X } from "lucide-react";

const sidebarItems = [
  {
    title: "APLICACIÓN",
    items: [
      { name: "Flujos", icon: <Workflow className="w-4 h-4" />, href: "/" },
      { name: "Generador Básico", icon: <Sparkles className="w-4 h-4" />, href: "/generator/basic" },
      { name: "Franatics", icon: <CreditCard className="w-4 h-4" />, href: "/generator/franatics" },
    ]
  },
  {
    title: "CUENTA",
    items: [
      { name: "Configuración", icon: <Settings className="w-4 h-4" />, href: "/settings" },
      { name: "API Keys", icon: <KeyRound className="w-4 h-4" />, href: "/api-keys" },
      { name: "Uso", icon: <Database className="w-4 h-4" />, href: "/usage" },
    ]
  }
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();

  if (!isSignedIn) return null;

  return (
    <>
      {/* Botón de menú móvil */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white rounded-full p-2 shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
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
          "fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r transition-transform duration-200 ease-in-out flex flex-col",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b">
          <Link href="/" className="text-xl font-bold">
            Morfeo Dreams Lab
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-8 overflow-y-auto">
          {sidebarItems.map((section) => (
            <div key={section.title}>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="flex items-center gap-3 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-md p-2 transition-colors"
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User - Fixed at bottom */}
        <div className="p-4 border-t">
          <UserButton afterSignOutUrl="/" />
        </div>
      </aside>
    </>
  );
} 