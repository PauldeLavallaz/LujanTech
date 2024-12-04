"use client";

import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Onboarding } from "@/components/Onboarding";
import { getUserRuns } from "@/server/getUserRuns";
import useSWR from "swr";
import Link from "next/link";

interface Flow {
	id: string;
	name: string;
	lastImage: string | null;
	status: "success" | "running" | "error";
	path: string;
}

export default function Home() {
	const { user, isSignedIn } = useUser();
	const { data: userRuns } = useSWR("userRuns", getUserRuns);

	// Convertir los runs en flujos
	const flows: Flow[] = [
		{
			id: "basic",
			name: "Generador Básico",
			lastImage: userRuns?.[0]?.image_url || null,
			status: "success",
			path: "/basic"
		},
		{
			id: "advanced",
			name: "Generador Avanzado",
			lastImage: userRuns?.[1]?.image_url || null,
			status: "success",
			path: "/advanced"
		}
	];

	if (!isSignedIn) {
		return <Onboarding />;
	}

	return (
		<div className="p-8">
			{/* Header */}
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-2xl font-bold">Flujos</h1>
					<p className="text-gray-500">Gestiona tus flujos creativos</p>
				</div>
			</div>

			{/* Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{flows.map((flow) => (
					<motion.div
						key={flow.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						<Link href={flow.path}>
							<Card className="overflow-hidden group cursor-pointer">
								{/* Image */}
								<div className="aspect-[4/3] relative">
									{flow.lastImage ? (
										<img
											src={flow.lastImage}
											alt={flow.name}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full bg-gray-100 flex items-center justify-center">
											<Plus className="w-8 h-8 text-gray-400" />
										</div>
									)}
									<Button
										variant="ghost"
										size="icon"
										className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<MoreVertical className="w-4 h-4" />
									</Button>
								</div>

								{/* Info */}
								<div className="p-4">
									<div className="flex items-center justify-between mb-2">
										<h3 className="font-medium">{flow.name}</h3>
										<div className={`w-2 h-2 rounded-full bg-${flow.status === 'success' ? 'green' : flow.status === 'running' ? 'blue' : 'red'}-500`} />
									</div>
								</div>
							</Card>
						</Link>
					</motion.div>
				))}
			</div>
		</div>
	);
}
