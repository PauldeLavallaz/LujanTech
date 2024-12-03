"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <nav className="fixed z-50 top-0 left-0 right-0 py-2 px-4 flex items-center justify-between w-full border-b bg-background">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </Button>
          </Link>
          <div className="font-bold text-sm sm:text-base md:text-lg">
            Morfeo Dreams Lab
          </div>
        </div>
        <UserButton afterSignOutUrl="/" />
      </nav>
      {children}
    </main>
  );
} 