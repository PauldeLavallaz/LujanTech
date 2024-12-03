"use client";

import useSWR from "swr";
import { getUserRuns } from "@/server/getUserRuns";
import React, { useState } from "react";
import { ImageGenerationResult } from "./ImageGenerationResult";
import { Sparkle } from "lucide-react";
import { ImageModal } from "./ImageModal";

export function UserRuns() {
	const { data: userRuns, isValidating } = useSWR("userRuns", getUserRuns, {
			refreshInterval: 5000,
	});

	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	if (userRuns && userRuns.length > 0) {
		return (
			<>
				<div className="max-w-[800px] w-full grid grid-cols-2 md:gap-4 pb-32">
					{userRuns.map((run) => (
						<div
							className="md:rounded-sm overflow-hidden relative group cursor-pointer"
							key={run.run_id}
							onClick={() => run.image_url && setSelectedImage(run.image_url)}
						>
							{!run.image_url && <ImageGenerationResult runId={run.run_id} />}
							{run.image_url && <img src={run.image_url} alt="Run" className="w-full h-full object-cover" />}
							{run.inputs && (
								<div className="transition-opacity group-hover:opacity-100 opacity-0 absolute bottom-0 text-xs text-white/80 p-4 bg-slate-950/40 flex flex-col gap-2">
									{Object.entries(run.inputs).map(([key, value]) => (
										<div key={key}>
											<span className="font-bold">{key}:</span>{" "}
											<span>{value}</span>
										</div>
									))}
								</div>
							)}
						</div>
					))}
				</div>
				{selectedImage && (
					<ImageModal 
						imageUrl={selectedImage} 
						onClose={() => setSelectedImage(null)} 
					/>
				)}
			</>
		);
	}

	return (
		<div className="text-sm flex w-full h-[calc(100vh-45px-50px)] justify-center items-center text-gray-400 gap-2">
			Start generating some images! <Sparkle size={16} />
		</div>
	);
}
