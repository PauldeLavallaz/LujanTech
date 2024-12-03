"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles, Palette, Zap, Layers } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ParticlesBackground } from "./ParticlesBackground";

const fadeIn = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.5 }
};

const stagger = {
	animate: {
		transition: {
			staggerChildren: 0.2
		}
	}
};

export function Onboarding() {
	return (
		<div className="flex flex-col w-full">
			{/* Hero Section */}
			<motion.section 
				className="relative min-h-screen flex items-center justify-center"
				initial="initial"
				animate="animate"
				variants={stagger}
			>
				{/* Hero Background */}
				<div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900 to-black">
					<ParticlesBackground />
				</div>
				
				<div className="relative z-10 container mx-auto px-4 text-center">
					<motion.h1 
							className="text-4xl md:text-7xl font-bold mb-6 text-white"
							variants={fadeIn}
					>
						Creatividad sin límites
					</motion.h1>
					<motion.p 
							className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200"
							variants={fadeIn}
					>
						Desbloqueá el potencial creativo de tus ideas
					</motion.p>
					<motion.div variants={fadeIn} className="relative z-50">
						<SignInButton mode="modal">
							<Button size="lg" className="rounded-full px-8 py-6 bg-white text-black hover:bg-gray-100 pointer-events-auto">
								Empezá a crear
								<ArrowRight className="ml-2" />
							</Button>
						</SignInButton>
					</motion.div>
				</div>
			</motion.section>

			{/* Features Section */}
			<section className="py-20 bg-white">
				{/* Features grid */}
			</section>

			{/* How it works */}
			<section className="py-20 bg-gray-50">
				{/* Process steps */}
			</section>

			{/* CTA Section */}
			<section className="w-full py-32 bg-black text-white">
				<motion.div 
					className="container mx-auto px-4 text-center"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					<h2 className="text-3xl md:text-5xl font-bold mb-8">
						Descubrí todo lo que podés lograr
					</h2>
					<p className="text-xl mb-12 text-gray-300 max-w-2xl mx-auto">
						Morfeo Dreams Lab es una interfaz diseñada para que trabajes con los flujos creativos más complejos de ComfyUI sin complicaciones
					</p>
					<SignInButton mode="modal">
						<Button size="lg" className="rounded-full px-8 py-6 bg-white text-black hover:bg-gray-100 pointer-events-auto">
							Comenzá ahora
							<ArrowRight className="ml-2" />
						</Button>
					</SignInButton>
				</motion.div>
			</section>
		</div>
	);
}
