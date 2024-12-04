"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ParticlesBackground } from "./ParticlesBackground";

export function Onboarding() {
	return (
		<div className="w-full h-screen flex items-center justify-center bg-black overflow-hidden">
			{/* Background con partículas */}
			<div className="absolute inset-0">
				<ParticlesBackground />
			</div>

			{/* Contenido */}
			<div className="relative z-10 w-full">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-center px-4"
				>
					{/* Título */}
					<h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
						Creatividad sin límites
					</h1>

					{/* Subtítulo */}
					<p className="text-xl md:text-2xl mb-12 text-gray-300">
						Desbloqueá el potencial creativo de tus ideas
					</p>

					{/* Botón de acción */}
					<SignInButton mode="modal">
						<Button 
							size="lg" 
							className="rounded-full px-8 py-6 bg-white text-black hover:bg-gray-100 transform hover:scale-105 transition-all"
						>
							Empezá a crear
							<ArrowRight className="ml-2" />
						</Button>
					</SignInButton>
				</motion.div>
			</div>
		</div>
	);
}
