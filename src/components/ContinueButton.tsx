"use client";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function ContinueButton() {
  const router = useRouter();

  return (
    <Button 
      size="lg"
      className="mt-4 w-full"
      onClick={() => router.push("/")}
    >
      Continuar a Morfeo Dreams Lab
    </Button>
  );
} 