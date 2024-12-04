"use client";

import { getUserRuns } from "@/server/getUserRuns";
import useSWR from "swr";
import { ImageGenerationResult } from "./ImageGenerationResult";
import { ScrollArea } from "./ui/scroll-area";
import { ImageModal } from "./ImageModal";
import { useState } from "react";

export function UserRuns() {
	const { data: userRuns } = useSWR("userRuns", getUserRuns, {
		refreshInterval: 5000
	});
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	return (
		<div className="w-full">
			<ScrollArea className="h-full">
				<div className="grid grid-cols-2 gap-4">
					{userRuns?.map((run) => (
						<div 
							key={run.run_id} 
							className="cursor-pointer"
						>
							<ImageGenerationResult 
								runId={run.run_id}
								onImageLoad={(imageUrl) => {
									if (run.run_id === userRuns[0]?.run_id) {
										setSelectedImage(imageUrl);
									}
								}}
								onClick={() => run.image_url && setSelectedImage(run.image_url)}
							/>
						</div>
					))}
				</div>
			</ScrollArea>

			{selectedImage && (
				<ImageModal
					imageUrl={selectedImage}
					onClose={() => setSelectedImage(null)}
				/>
			)}
		</div>
	);
}
