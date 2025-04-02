"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { videoUpdateSchema } from "@/db/schema";
import { trpc } from "@/trpc/client";
import {
	CopyCheckIcon,
	CopyIcon,
	Globe2Icon,
	ImagePlusIcon,
	Loader2Icon,
	LockIcon,
	MoreVerticalIcon,
	RotateCcwIcon,
	SparklesIcon,
	TrashIcon
} from "lucide-react";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";
import Link from "next/link";
import { snakeCaseToTitle } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import { ThumbnailUploadModal } from "../components/thumbnail-upload-modal";

interface FormSectionProps {
	videoId: string;
}

export const FormSection = ({ videoId }: FormSectionProps) => {
	return (
		<Suspense fallback={<FormSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Error...</p>}>
				<FormSectionSuspense videoId={videoId} />
			</ErrorBoundary>
		</Suspense>
	);
};

const FormSectionSkeleton = () => {
	return <p>Loading...</p>;
};

const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
	const router = useRouter();
	const utils = trpc.useUtils();
	const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
	const [isCopied, setIsCopied] = useState(false);
	const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
	const [categories] = trpc.categories.getMany.useSuspenseQuery();

	const remove = trpc.videos.remove.useMutation({
		onSuccess: () => {
			utils.studio.getMany.invalidate();
			toast.success("動画の削除が成功しました");
			router.push(`/studio`);
		},
		onError: () => {
			toast.error("エラーが発生しました");
		}
	});

	const generateDescription = trpc.videos.generateDescription.useMutation({
		onSuccess: () => {
			toast.success("動画説明の生成が開始しました", {
				description: "少し時間がかかる場合があります"
			});
		},
		onError: () => {
			toast.error("エラーが発生しました");
		}
	});

	const generateTitle = trpc.videos.generateTitle.useMutation({
		onSuccess: () => {
			toast.success("タイトルの生成が開始しました", {
				description: "少し時間がかかる場合があります"
			});
		},
		onError: () => {
			toast.error("エラーが発生しました");
		}
	});

	const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
		onSuccess: () => {
			toast.success("サムネイルの生成が開始しました", {
				description: "少し時間がかかる場合があります"
			});
		},
		onError: () => {
			toast.error("エラーが発生しました");
		}
	});

	const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
		onSuccess: () => {
			utils.studio.getMany.invalidate();
			utils.studio.getOne.invalidate({ id: videoId });
			toast.success("サムネイルの復元が成功しました");
		},
		onError: () => {
			toast.error("エラーが発生しました");
		}
	});

	const update = trpc.videos.update.useMutation({
		onSuccess: () => {
			utils.studio.getMany.invalidate();
			utils.studio.getOne.invalidate({ id: videoId });
			toast.success("動画の編集が成功しました");
		},
		onError: () => {
			toast.error("エラーが発生しました");
		}
	});

	const form = useForm<z.infer<typeof videoUpdateSchema>>({
		resolver: zodResolver(videoUpdateSchema),
		defaultValues: video
	});
	const onSubmit = async (data: z.infer<typeof videoUpdateSchema>) => {
		update.mutate(data);
	};
	const fullUrl = `${
		process.env.VERCEL_URL || "http://localhost:3000"
	}/videos/${videoId}`;

	const onCopy = async () => {
		await navigator.clipboard.writeText(fullUrl);

		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
	};

	return (
		<>
			<ThumbnailUploadModal
				open={thumbnailModalOpen}
				onOpenChange={setThumbnailModalOpen}
				videoId={videoId}
			/>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-2xl font-bold">Video Details</h1>
							<p className="text-sm text-muted-foreground">
								Manage your video detail
							</p>
						</div>
						<div className="flex items-center gap-x-2">
							<Button
								type="submit"
								disabled={update.isPending}
							>
								保存
							</Button>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
									>
										<MoreVerticalIcon />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										onClick={() => remove.mutate({ id: videoId })}
									>
										<TrashIcon className="size-4 mr-2" />
										削除
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
						<div className="space-y-8 lg:col-span-3">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<div className="flex items-center gap-x-2">
												タイトル
												<Button
													size="icon"
													variant="outline"
													type="button"
													className="rounded-full size-6 [&svg]:size-3"
													onClick={() => generateTitle.mutate({ id: videoId })}
													disabled={
														generateTitle.isPending || !video.muxTrackId
													}
												>
													{generateTitle.isPending ? (
														<Loader2Icon className="animate-spin" />
													) : (
														<SparklesIcon />
													)}
												</Button>
											</div>
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="動画のタイトルを追加してください"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<div className="flex items-center gap-x-2">
												動画の説明
												<Button
													size="icon"
													variant="outline"
													type="button"
													className="rounded-full size-6 [&svg]:size-3"
													onClick={() =>
														generateDescription.mutate({ id: videoId })
													}
													disabled={
														generateDescription.isPending || !video.muxTrackId
													}
												>
													{generateDescription.isPending ? (
														<Loader2Icon className="animate-spin" />
													) : (
														<SparklesIcon />
													)}
												</Button>
											</div>
										</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												value={field.value ?? ""}
												rows={10}
												className="resize-none pr-10"
												placeholder="動画の説明を追加してください"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name="thumbnailUrl"
								control={form.control}
								render={() => (
									<FormItem>
										<FormLabel>サムネイル</FormLabel>
										<FormControl>
											<div className="p-0.5 border border-dashed border-neutral-400 relative h-[84px] w-[153px] group">
												<Image
													fill
													alt="thumbnail"
													src={video.thumbnailUrl ?? THUMBNAIL_FALLBACK}
													className="object-cover"
												/>

												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															type="button"
															size="icon"
															className="bg-black/50  hover:bg-black/50 absolute 
                                                        top-1 right-1 rounded-full 
                                                        opacity-100 md:opacity-0 group-hover:opacity-100
                                                        duration-300 size-7"
														>
															<MoreVerticalIcon className=" text-white" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														align="start"
														side="right"
													>
														<DropdownMenuItem
															onClick={() => setThumbnailModalOpen(true)}
														>
															<ImagePlusIcon className="size-4 mr-1" />
															変更
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() =>
																generateThumbnail.mutate({ id: videoId })
															}
														>
															<SparklesIcon className="size-4 mr-1" />
															AIで生成する
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() =>
																restoreThumbnail.mutate({ id: videoId })
															}
														>
															<RotateCcwIcon className="size-4 mr-1" />
															元に戻す
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="categoryId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>カテゴリ</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value ?? undefined}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="カテゴリを選択してください" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{categories.map((category) => (
													<SelectItem
														key={category.id}
														value={category.id}
													>
														{category.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex flex-col gap-y-8 lg:col-span-2">
							<div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
								<div className="aspect-video overflow-hidden relative">
									<VideoPlayer
										playbackId={video.muxPlaybackId}
										thumbnailUrl={video.thumbnailUrl}
									/>
								</div>
								<div className="p-4 flex flex-col gap-y-6">
									<div className="flex justify-between items-center gap-x-2">
										<div className="flex flex-col gap-y-1">
											<p className="text-muted-foreground text-xs">
												動画のリンク
											</p>
											<div className="flex items-center gap-x-2">
												<Link href={`/videos/${video.id}`}>
													<p className="line-clamp-1 text-sm text-blue-500">
														{fullUrl}
													</p>
												</Link>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="shrink-0"
													onClick={onCopy}
													disabled={isCopied}
												>
													{isCopied ? <CopyCheckIcon /> : <CopyIcon />}
												</Button>
											</div>
										</div>
									</div>
									<div className="flex justify-between items-center">
										<div className="flex flex-col gap-y-1">
											<p className="text-muted-foreground text-xs">公開可否</p>
											<p className="text-sm">
												{snakeCaseToTitle(video.muxStatus || "準備中")}
											</p>
										</div>
									</div>
									<div className="flex justify-between items-center">
										<div className="flex flex-col gap-y-1">
											<p className="text-muted-foreground text-xs">
												字幕の生成状況
											</p>
											<p className="text-sm">
												{snakeCaseToTitle(video.muxTrackStatus || "字幕なし")}
											</p>
										</div>
									</div>
								</div>
							</div>
							<FormField
								control={form.control}
								name="visibility"
								render={({ field }) => (
									<FormItem>
										<FormLabel>公開状態</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value ?? undefined}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="公開状態を選択してください" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="公開">
													<div className="flex items-center">
														<Globe2Icon className="size-4 mr-2" />
														公開
													</div>
												</SelectItem>
												<SelectItem value="非公開">
													<div className="flex items-center">
														<LockIcon className="size-4 mr-2" />
														非公開
													</div>
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
				</form>
			</Form>
		</>
	);
};
