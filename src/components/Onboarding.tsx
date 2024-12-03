"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function Onboarding() {
	return (
		<div className="flex flex-col w-full min-h-screen">
			{/* Hero Section */}
			<section className="relative h-screen flex items-center justify-center">
				<div className="absolute inset-0 z-0">
					{/* Hero background image */}
				</div>
				
				<div className="relative z-10 container mx-auto px-4 text-center">
					<h1 className="text-4xl md:text-6xl font-bold mb-6">
						Creatividad sin límites
					</h1>
					<p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
						Desbloqueá el potencial creativo de tus ideas
					</p>
					<SignInButton mode="modal">
						<Button size="lg" className="rounded-full">
							Empezá a crear
							<ArrowRight className="ml-2" />
						</Button>
					</SignInButton>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 bg-white">
				{/* Features grid */}
			</section>

			{/* How it works */}
			<section className="py-20 bg-gray-50">
				{/* Process steps */}
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-gradient-to-br from-primary/90 to-primary">
				{/* Final call to action */}
			</section>
		</div>
	);
}
