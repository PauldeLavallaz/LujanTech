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
			<div className="flex min-h-screen">
				<Sidebar />
				<main className="flex-1 p-4 md:ml-64">
					{children}
				</main>
			</div>
		);
	}

	return (
		<ClerkProvider>
			<html lang="es">
				<body>
					<LayoutContent>{children}</LayoutContent>
					<Toaster />
				</body>
			</html>
		</ClerkProvider>
	);
}

