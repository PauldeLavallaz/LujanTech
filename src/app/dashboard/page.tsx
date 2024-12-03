"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Sparkles, Palette, Wand2, Stars, Layers, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DreamMachine {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  status: "stable" | "beta" | "coming-soon";
  features: string[];
}

const dreamMachines: DreamMachine[] = [
  {
    id: "basic-generator",
    name: "Generador Básico",
    description: "Crea imágenes usando prompts, loras y ajustes de tamaño. Perfecto para empezar.",
    icon: <Sparkles className="w-8 h-8" />,
    path: "/generator/basic",
    status: "stable",
    features: ["Prompts en español", "Selección de Loras", "Ajustes de tamaño"]
  },
  {
    id: "advanced-generator",
    name: "Generador Avanzado",
    description: "Control total sobre el proceso creativo con opciones avanzadas de generación.",
    icon: <Wand2 className="w-8 h-8" />,
    path: "/generator/advanced",
    status: "beta",
    features: ["Todas las funciones básicas", "Control de parámetros", "Modos especiales"]
  }
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <h1 className="text-xl font-bold hover:text-gray-600 transition-colors">
              Morfeo Dreams Lab
            </h1>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Welcome Section */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl font-bold mb-4">
              ¡Bienvenido, {user?.firstName || 'Creador'}!
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              Estas son tus Dream Machines. Cada una está diseñada para potenciar tu creatividad de manera única.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dream Machines Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {dreamMachines.map((machine) => (
              <motion.div key={machine.id} variants={fadeInUp}>
                <Link href={machine.path}>
                  <Card className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden">
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge variant={
                        machine.status === "stable" ? "default" :
                        machine.status === "beta" ? "secondary" : "outline"
                      }>
                        {machine.status === "stable" ? "Estable" :
                         machine.status === "beta" ? "Beta" : "Próximamente"}
                      </Badge>
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-black text-white rounded-xl group-hover:scale-110 transition-transform">
                        {machine.icon}
                      </div>
                      <h3 className="text-2xl font-semibold group-hover:text-gray-600 transition-colors">
                        {machine.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 text-lg">
                      {machine.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2">
                      {machine.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-500">
                          <Stars className="w-4 h-4" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Arrow indicator */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
} 