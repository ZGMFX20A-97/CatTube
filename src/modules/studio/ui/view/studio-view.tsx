import { VideosSection } from "../sections/videos-section";

export const StudioView = () => {
	return (
		<div className="flex flex-col gap-y-6 pt-2.5">
			<div className="px-4">
				<h1 className="text-2xl font-bold">チャンネルコンテンツ</h1>
				<p className="text-ts text-muted-foreground">
					あなたのチャンネルを管理しよう
				</p>
			</div>
			<VideosSection />
		</div>
	);
};
