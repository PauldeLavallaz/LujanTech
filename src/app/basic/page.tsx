"use client";

import { App } from "@/components/App";
import { UserRuns } from "@/components/UserRuns";

export default function BasicGenerator() {
  return (
    <div className="w-full p-4 flex flex-col items-center justify-center gap-4">
      <div className="max-w-[800px] w-full">
        <UserRuns />
      </div>
      <App />
    </div>
  );
} 