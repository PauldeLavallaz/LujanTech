"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	function LayoutContent({ children }: { children: React.ReactNode }) {
		const pathname = usePathname();
		const isPublicRoute = pathname === "/" || pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

		return (
			<div className="flex h-screen">
				{!isPublicRoute && <Sidebar />}
				<main className={`flex-1 ${!isPublicRoute ? 'bg-gray-50' : ''}`}>
					{children}
				</main>
			</div>
		);
	}

	return (
		<html lang="es">
			<body className={inter.className}>
				<ClerkProvider>
					<LayoutContent>{children}</LayoutContent>
					<Toaster />
				</ClerkProvider>
			</body>
		</html>
	);
}

