import { Box, Flex, Span, Tabs, Text, Icon, Skeleton, Center,Image } from "@chakra-ui/react";
import NavBar from "@/components/navbar";
import useSWR from "swr";
import BookImage from "@/components/book-image";
import { Link } from "react-router";
import useLibStore from "@/hooks/store/lib";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { BookSelectDrawer } from "@/components/book-select-drawer";
import { LibInfo } from "./library";
import { SkeletonText } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

type Item = {
	title: string;
	link: string;
	author: string;
	pubDate: string;
	description: string;
	isbn13: string;
	itemId: number;
	cover: string;
	categoryId: number;
	categoryName: string;
	publisher: string;
	bestDuration: string;
	bestRank: number;
	libCode: string[];
};

type BestSellers = {
	catValue: string;
	catName: string;
	items: Item[];
};

export default function Page() {
	return (
		<>
			<MainBox />
			<NavBar />
		</>
	);
}

const fetcher = (path: string) =>
	fetch(new URL(path, import.meta.env.VITE_BACKEND_API)).then((res) => res.json());

function MainBox() {
	const { chosenLibs } = useLibStore();

	return (
		<>
			<Text px={2} py={3} fontWeight={600} fontSize={"xl"}>
				서울시 200여 도서관 장서 900만 권을 검색하세요.
			</Text>
			<Flex spaceX={1.5} mx={2} py={3} alignItems={"end"}>
				<Text fontWeight={600} fontSize={"xl"}>
					베스트 셀러
				</Text>
				<BookSelectDrawer
					buttonComp={
						<Flex
							display={"inline-flex"}
							alignItems={"center"}
							gapX={1}
							fontWeight={600}
							fontSize={"sm"}
							color={"GrayText"}
							cursor={"button"}
							pb={0.5}
						>
							{chosenLibs[0].libName}{" "}
							{chosenLibs.length > 1 && ` 외 ${chosenLibs.length - 1}개 도서관`}
							<Icon fontSize={"sm"}>
								<IoIosArrowDropdownCircle />
							</Icon>
						</Flex>
					}
				/>
			</Flex>
			<TabArr />
		</>
	);
}

function TabArr() {
	const tabs = [
		{ korName: "일반", engName: "all" },
		{ korName: "컴퓨터/모바일", engName: "dev" },
		{ korName: "여행", engName: "travel" },
		{ korName: "건강/취미", engName: "health" },
		{ korName: "인문학", engName: "humanity" },
		{ korName: "소설/시/희곡", engName: "novel" },
		{ korName: "역사", engName: "history" },
		{ korName: "경제경영", engName: "business" },
		{ korName: "자기계발", engName: "selfdev" },
	];
	return (
		<Tabs.Root
			lazyMount
			unmountOnExit
			defaultValue="all"
			variant={"subtle"}
			display={"flex"}
			flexDirection={"column"}
			flexGrow={1}
		>
			<Tabs.List
				overflowX={"scroll"}
				whiteSpace="nowrap"
				spaceX={2}
				mx={2}
				alignItems={"center"}
			>
				{tabs.map((v) => (
					<Tabs.Trigger
						key={v.engName}
						value={v.engName}
						flexShrink={0}
						px={4}
						h={0}
						py={3.5}
						borderWidth={1}
						rounded="2xl"
						fontSize={"xs"}
						_selected={{ bg: "gray.200", color: "black", fontWeight: 700 }}
						fontWeight={600}
					>
						{v.korName}
					</Tabs.Trigger>
				))}
			</Tabs.List>
			{tabs.map((v) => {
				return (
					<Tabs.Content key={v.engName} value={v.engName} flexGrow={1} display={"flex"}>
						<BestSeller category={v.engName} />
					</Tabs.Content>
				);
			})}
		</Tabs.Root>
	);
}

function BestSeller({ category }: { category: string }) {
	const { chosenLibs: selectedLibs } = useLibStore();
	const libCodes = selectedLibs.map((v) => v.libCode).join(",");
	const { data, error, isLoading } = useSWR<BestSellers>(
		`/book/bestseller/${category}?libCode=${libCodes}`,
		fetcher
	);

	return (
		<Flex flexGrow={1} justifyContent={"center"} px={4}>
			{isLoading ? (
				<LoadingSkeleton />
			) : error || !data?.items ? (
				<NotFound />
			) : (
				<Flex flexGrow={1} direction={"column"} spaceY={5}>
					{data?.items
						.sort((a, b) => a.bestRank - b.bestRank)
						.map((v) => (
							<BookCard result={v} key={v.isbn13} selectedLibs={selectedLibs} />
						))}
				</Flex>
			)}
		</Flex>
	);
}

function BookCard({ result, selectedLibs }: { result: Item; selectedLibs: LibInfo[] }) {
	const [mainTitle, subTitle] = result.title.split(" - ");

	return (
		<Link to={`/book/detail/${result.isbn13}`}>
			<Flex spaceX={4}>
				<Flex basis={"1/4"}>
					<BookImage src={result.cover} />
				</Flex>
				<Flex basis={"3/4"} direction={"column"} color={"GrayText"} fontSize={"xs"}>
					<Text color={"HighlightText"} fontWeight={600} fontSize={"sm"}>
						{mainTitle}
						<Span color={"GrayText"} fontWeight={500} fontSize={"xs"} ps={1}>
							{subTitle}
						</Span>
					</Text>
					<Text>{result.author}</Text>
					<Text>
						{result.publisher} | {result.pubDate.split("-")[0]}
					</Text>

					<Flex  alignItems={"center"} mt={1}>
						<Box borderWidth={1} rounded={"xl"} spaceX={0.5} display={"inline-flex"} pe={2}>
							<Image src="/aladin.png" rounded="full" m={0.5} w={4} aspectRatio={"square"} />
							<Text>{`알라딘 #${result.bestRank}위`}</Text>
						</Box>
					</Flex>
					<Flex gapX={1.5} gapY={2} pt={2} wrap={"wrap"}>
						{result.libCode.map((v) => (
							<Box
								key={v}
								px={1.5}
								py={0.5}
								rounded={"sm"}
								fontWeight={500}
								bgColor={"gray.200"}
								fontSize={"xs"}
								color={"HighlightText"}
								opacity={"0.55"}
								whiteSpace={"nowrap"}
							>
								{selectedLibs.find((s) => s.libCode === v)?.libName}
							</Box>
						))}
					</Flex>
				</Flex>
			</Flex>
		</Link>
	);
}
function LoadingSkeleton() {
	return (
		<Box spaceY={10} w={"full"}>
			{Array.from([0, 1, 2, 3, 4]).map((l) => (
				<Flex spaceX={4} key={l}>
					<Flex basis={"1/4"}>
						<Skeleton aspectRatio={"1/1.414"} w={"full"} h={"full"} />
					</Flex>
					<Flex basis={"3/4"} direction={"column"} spaceY={4} my={1}>
						<SkeletonText noOfLines={2} />
						<SkeletonText flexGrow={1} noOfLines={1} w={"70%"} />
						<SkeletonText flexGrow={1} noOfLines={1} w={"40%"} />
					</Flex>
				</Flex>
			))}
		</Box>
	);
}

function NotFound() {
	return (
		<Center flexGrow={1}>
			<EmptyState
				title="도서가 없습니다."
				description="도서관을 추가하여 검색 범위를 늘려보세요"
			/>
		</Center>
	);
}
