"use client";
import { Responsivemodal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { StudioUploader } from "./studio-uploader";
import { useRouter } from "next/navigation";

export const StudioUploadModal = () => {
	const router = useRouter();
	const utils = trpc.useUtils();
	const create = trpc.videos.create.useMutation({
		onSuccess: () => {
			toast.success("動画が作成されました");
			utils.studio.getMany.invalidate();
		},
		onError: () => {
			toast.error("エラーが発生しました");
		}
	});

	const onSuccess = () => {
		if (!create.data?.video.id) return;

		create.reset();
		router.push(`/studio/videos/${create.data.video.id}`);
	};

	return (
		<>
			<Responsivemodal
				title="動画をアップロード"
				open={!!create.data?.url}
				onOpenChange={() => create.reset()}
			>
				{create.data?.url ? (
					<StudioUploader
						endpoint={create.data?.url}
						onSuccess={onSuccess}
					/>
				) : (
					<Loader2Icon />
				)}
			</Responsivemodal>
			<Button
				variant="secondary"
				onClick={() => create.mutate()}
				disabled={create.isPending}
			>
				{create.isPending ? (
					<Loader2Icon className="animate-spin" />
				) : (
					<PlusIcon />
				)}
				作成
			</Button>
		</>
	);
};
