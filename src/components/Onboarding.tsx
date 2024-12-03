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
		<div className="flex flex-col w-full min-h-screen">
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
						className="text-4xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600"
						variants={fadeIn}
					>
						Creatividad sin límites
					</motion.h1>
					<motion.p 
						className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-600"
						variants={fadeIn}
					>
						Desbloqueá el potencial creativo de tus ideas
					</motion.p>
					<motion.div variants={fadeIn}>
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
			<section className="py-32 bg-white">
				<motion.div 
					className="container mx-auto px-4"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					<h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
						Una nueva forma de crear
					</h2>
					<div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						<FeatureCard 
							icon={<Sparkles className="w-6 h-6" />}
							title="Amigable y potente"
							description="Diseñada para facilitarte el acceso al diseño generativo sin perder potencia"
						/>
						<FeatureCard 
							icon={<Palette className="w-6 h-6" />}
							title="Creado por expertos"
							description="Basada en modelos desarrollados por profesionales del software creativo"
						/>
						<FeatureCard 
							icon={<Zap className="w-6 h-6" />}
							title="Innovación constante"
							description="Siempre actualizada con las últimas tecnologías del mercado"
						/>
					</div>
				</motion.div>
			</section>

			{/* How it works */}
			<section className="py-32 bg-gray-50">
				<motion.div 
					className="container mx-auto px-4"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					<h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
						Cómo funciona
					</h2>
					<div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
						<ProcessStep 
							number="01"
							title="Explorá tus ideas"
							description="Generá imágenes únicas desde prompts simples, ajustá detalles y descubrí nuevas posibilidades"
						/>
						<ProcessStep 
							number="02"
							title="Flujos personalizados"
							description="Diseñá procesos adaptados a tus necesidades creativas sin complicaciones técnicas"
						/>
						<ProcessStep 
							number="03"
							title="Automatización inteligente"
							description="Simplificá tareas repetitivas y enfocá tu energía en lo importante"
						/>
					</div>
				</motion.div>
			</section>

			{/* CTA Section */}
			<section className="py-32 bg-black text-white">
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
						<Button size="lg" className="rounded-full px-8 py-6 bg-white text-black hover:bg-gray-100">
							Comenzá ahora
							<ArrowRight className="ml-2" />
						</Button>
					</SignInButton>
				</motion.div>
			</section>
		</div>
	);
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
	return (
		<motion.div 
			className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
			whileHover={{ y: -5 }}
			transition={{ duration: 0.2 }}
		>
			<div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-4">
				{icon}
			</div>
			<h3 className="text-xl font-semibold mb-2">{title}</h3>
			<p className="text-gray-600">{description}</p>
		</motion.div>
	);
}

function ProcessStep({ number, title, description }: { number: string; title: string; description: string }) {
	return (
		<motion.div 
			className="text-center"
			whileHover={{ scale: 1.05 }}
			transition={{ duration: 0.2 }}
		>
			<div className="text-6xl font-bold text-black/10 mb-4">{number}</div>
			<h3 className="text-xl font-semibold mb-2">{title}</h3>
			<p className="text-gray-600">{description}</p>
		</motion.div>
	);
}
