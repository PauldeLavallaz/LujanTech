import { App } from "@/components/App";
import { Onboarding } from "@/components/Onboarding";
import { UserRuns } from "@/components/UserRuns";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserRuns } from "@/server/getUserRuns";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Suspense } from "react";
import { SWRConfig } from "swr";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center">
			<nav className="fixed z-50 top-0 left-0 right-0 py-2 px-4 flex items-center justify-between w-full border-b bg-background">
				<div className="flex items-start justify-center">
					<div className="font-bold text-sm sm:text-base md:text-lg">Morfeo Dreams Lab</div>
				</div>
				<div className="flex items-center gap-2">
					<SignedIn>
						<UserButton />
					</SignedIn>
				</div>
			</nav>
			<div className="mt-[45px] w-full min-h-[calc(100vh-45px)] flex flex-col items-center">
				<SignedOut>
					<Onboarding />
				</SignedOut>
				<SignedIn>
					<div className="w-full p-4 flex flex-col items-center justify-center gap-4">
						<div className="max-w-[800px] w-full">
							<UserRuns />
						</div>
						<App />
					</div>
				</SignedIn>
			</div>
		</main>
	);
}
