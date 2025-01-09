import { Box, Flex, Span, Tabs, Text } from "@chakra-ui/react";
import NavBar from "@/components/navbar";
import useSWR from "swr";
import BookImage from "@/components/book-image";
import { Link } from "react-router";
import useLibStore, { LibProps } from "@/hooks/store/lib";

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
	return (
		<>
			<Text px={2} py={3} fontWeight={600} fontSize={"xl"}>서울시 200여 도서관 장서 900만 권을 검색하세요.</Text>
			<Text px={2} py={3} fontWeight={600} fontSize={"xl"}>베스트 셀러
			<Span px={2} py={3} fontWeight={600} fontSize={"sm"} color={"GrayText"}>해당 도서관에서 보유중인  베스트셀러 입니다.</Span>
			</Text>
			<TabArr />
		</>
	);
}

function TabArr() {
	const tabs = [
		{ korName: "전체", engName: "all" },
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
		<Tabs.Root lazyMount unmountOnExit defaultValue="all" variant={"subtle"} display={"flex"} flexDirection={"column"} size={"sm"}>
			<Tabs.List overflowX={"scroll"} whiteSpace="nowrap" spaceX={3} mb={2} mx={3}>
				{tabs.map((v) => (
					<Tabs.Trigger
						key={v.engName}
						value={v.engName}
						flexShrink={0}
						px={4}
						borderWidth={1}
						rounded="2xl"
						fontSize={"xs"}
						_selected={{"bg":"gray.200", color:"black"}}
						fontWeight={600}
					>
						{v.korName}
					</Tabs.Trigger>
				))}
			</Tabs.List>
			{tabs.map((v) => {
				return (
					<Tabs.Content key={v.engName} value={v.engName}>
						<BestSeller category={v.engName} />
					</Tabs.Content>
				);
			})}
		</Tabs.Root>
	);
}

function BestSeller({ category }: { category: string }) {
	const { selectedLibs } = useLibStore();
	const libCodes = selectedLibs.map((v) => v.value).join(",");
	const { data } = useSWR<BestSellers>(
		`/book/bestseller/${category}?libCode=${libCodes}`,
		fetcher
	);

	return (
		<Box flexGrow={1} width={"100%"} px={4}>
			<Flex flexGrow={1} direction={"column"} spaceY={5}>
				{data?.items
					.sort((a, b) => a.bestRank - b.bestRank)
					.map((v) => <BookCard result={v} key={v.isbn13} selectedLibs={selectedLibs} />)}
			</Flex>
		</Box>
	);
}

function BookCard({ result, selectedLibs }: { result: Item; selectedLibs: LibProps[] }) {
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
					<Text>{result.publisher}</Text>
					<Text>{result.pubDate.split("-")[0]}</Text>
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
								{selectedLibs.find((s) => s.value === v)?.label}
							</Box>
						))}
					</Flex>
				</Flex>
			</Flex>
		</Link>
	);
}
