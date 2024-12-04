"use client";

import { GeneratorLayout } from "@/components/GeneratorLayout";
import { UserRuns } from "@/components/UserRuns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function BasicGenerator() {
  const inputs = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="prompt">Prompt</Label>
        <Input id="prompt" placeholder="Describe lo que quieres generar..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="width">Width</Label>
        <Input id="width" type="number" defaultValue={896} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="height">Height</Label>
        <Input id="height" type="number" defaultValue={1152} />
      </div>
      <Button className="w-full">Generar</Button>
    </div>
  );

  return (
    <GeneratorLayout inputs={inputs}>
      <UserRuns />
    </GeneratorLayout>
  );
} 