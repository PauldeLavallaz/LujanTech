"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { useUser } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

const publicRoutes = ["/", "/sign-in", "/sign-up"];

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	function LayoutContent({ children }: { children: React.ReactNode }) {
		const pathname = usePathname();
		const { isSignedIn } = useUser();
		const isPublicRoute = publicRoutes.includes(pathname);

		return (
			<div className="flex h-screen">
				{isSignedIn && !isPublicRoute && <Sidebar />}
				<main className={`flex-1 ${isSignedIn && !isPublicRoute ? 'bg-gray-50' : ''}`}>
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

