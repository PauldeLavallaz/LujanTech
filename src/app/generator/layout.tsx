"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function GeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <nav className="fixed z-50 top-0 left-0 right-0 py-2 px-4 flex items-center justify-between w-full border-b bg-background">
        <Link href="/dashboard" className="flex items-start justify-center">
          <div className="font-bold text-sm sm:text-base md:text-lg hover:text-gray-600 transition-colors">
            Morfeo Dreams Lab
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>
      {children}
    </main>
  );
} 