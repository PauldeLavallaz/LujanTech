"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles, Palette, Zap, Layers } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

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
				className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white"
				initial="initial"
				animate="animate"
				variants={stagger}
			>
				<div className="absolute inset-0 z-0">
					{/* Placeholder para hero image */}
					<div className="absolute inset-0 bg-black/5" />
				</div>
				
				<div className="relative z-10 container mx-auto px-4 text-center">
					<motion.h1 
						className="text-4xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-700"
						variants={fadeIn}
					>
						Creatividad sin límites
					</motion.h1>
					<motion.p 
						className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-700"
						variants={fadeIn}
					>
						Desbloqueá el potencial creativo de tus ideas
					</motion.p>
					<motion.div variants={fadeIn} className="relative z-50">
						<SignInButton mode="modal">
							<Button size="lg" className="rounded-full px-8 py-6 bg-black hover:bg-black/90">
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
			<section className="py-20 bg-black text-white">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-3xl md:text-5xl font-bold mb-8">
						Descubrí todo lo que podés lograr
					</h2>
					<p className="text-xl mb-12 text-gray-300 max-w-2xl mx-auto">
						Morfeo Dreams Lab es una interfaz diseñada para que trabajes con los flujos creativos más complejos de ComfyUI sin complicaciones
					</p>
					<SignInButton mode="modal">
						<Button size="lg" className="rounded-full px-8 py-6 bg-white text-black hover:bg-gray-100">
							Comenzá ahora
							<ArrowRight className="ml-2" />
						</Button>
					</SignInButton>
				</div>
			</section>
		</div>
	);
}
