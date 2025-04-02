import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect } from "react";
import { Button } from "./ui/button";

interface infiniteScrollProps {
	isManual?: boolean;
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	fetchNextPage: () => void;
}

export const InfiniteScroll = ({
	isManual = false,
	hasNextPage,
	isFetchingNextPage,
	fetchNextPage
}: infiniteScrollProps) => {
	const { targetRef, isIntersecting } = useIntersectionObserver({
		threshold: 0.5,
		rootMargin: "100px"
	});

	useEffect(() => {
		if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
			fetchNextPage();
		}
	}, [
		isManual,
		isIntersecting,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage
	]);

	return (
		<div className="flex flex-col items-center gap-4 p-4">
			<div
				ref={targetRef}
				className="h-1"
			/>
			{hasNextPage ? (
				<Button
					variant="secondary"
					disabled={!hasNextPage || isFetchingNextPage}
					onClick={() => fetchNextPage()}
				>
					{isFetchingNextPage ? "Loading..." : "もっと見る"}
				</Button>
			) : (
				<p className="text-xs text-muted-foreground">最後になりました</p>
			)}
		</div>
	);
};
