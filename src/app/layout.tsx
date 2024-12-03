import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { HandleSignout } from "@/components/HandleSignout";
import { ComfyDeployProvider } from "@/hooks/hooks";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Morfeo Dreams Lab",
	description: "Desbloqueá el potencial creativo de tus ideas con IA",
	keywords: ["ia", "creatividad", "diseño", "generativo", "comfyui", "arte"],
	openGraph: {
		title: "Morfeo Dreams Lab",
		description: "Desbloqueá el potencial creativo de tus ideas con IA",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider
			appearance={{
				layout: {
					socialButtonsPlacement: "bottom",
					socialButtonsVariant: "blockButton",
				},
				variables: {
					colorPrimary: "#000000",
					borderRadius: "0.75rem",
				},
			}}
		>
			<html lang="es">
				<body className={inter.className}>
					<ComfyDeployProvider>
						{children}
					</ComfyDeployProvider>
					<Toaster />
					<HandleSignout />
				</body>
			</html>
		</ClerkProvider>
	);
}

