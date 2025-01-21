import {
	Box,
	Flex,
	Input,
	Text,
	Container,
	Icon,
	Grid,
	GridItem,
	Button,
	Spinner,
	VStack,
	Center,
	Separator,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { Link, useNavigate, useSearchParams } from "react-router";
import { BookSelectDrawer } from "@/components/book-select-drawer";
import useLibStore from "@/hooks/store/lib";
import NavBar from "@/components/navbar";
import { useSearchKeywordStore as useRecentSearchKeywordStore } from "@/hooks/store/search-keyword";
import { CloseButton } from "@/components/ui/close-button";
import { GoHistory } from "react-icons/go";
import { BiError } from "react-icons/bi";

import useSWR from "swr";
import { EmptyState } from "@/components/ui/empty-state";
import BookImage from "@/components/book-image";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { SubTitle } from "@/components/text";
import { HiLibrary } from "react-icons/hi";
import { IoAlertCircleOutline } from "react-icons/io5";


import { useBookSearch } from "./use-book-search";

type SearchResult = {
	isbn: string;
	title: string;
	author: string;
	publisher: string;
	publicationYear: string;
	imageUrl: string;
	score: number;
};

export default function Page() {
	const [openRecentKeyword, setOpenRecentKeyword] = useState(false);
	return (
		<>
			<SearchBar setOpen={setOpenRecentKeyword} />
			<FilterBox />
			<Main open={openRecentKeyword} />
			<NavBar />
		</>
	);
}

function SearchBar({ setOpen }: { setOpen: (b: boolean) => void }) {
	const { addKeyword } = useRecentSearchKeywordStore();
	const { handleSearch, initSearch, searchParams } = useBookSearch();
	const [search, setSearch] = useState<string>("");
	const navigate = useNavigate();

	const goBack = () => {
		navigate(-1);
	};

	const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			if (e.currentTarget.value.length === 0) {
				alert("검색어를 입력해주세요.");
				return;
			}
			handleSearch(search);
			addKeyword(search);
			setSearch("");
			e.currentTarget.blur();
		}
	};
	const handleClose = () => {
		setSearch("");
		initSearch();
	};
	const keyword = searchParams.get("q");

	const showMaxString = (str: string) => {
		return str.length > 10 ? str.slice(0, 10) + "..." : str;
	};
	const placeholder = keyword ? `${showMaxString(keyword)}에 대한 검색 결과` : "검색하기";

	return (
		<Box position={"sticky"} top={10} bgColor={"Background"} zIndex={5}>
			<Container position={"relative"} px={0} my={0.5}>
				<Button
					position={"absolute"}
					zIndex={1}
					height={"100%"}
					variant="plain"
					px={0}
					onClick={goBack}
				>
					<Icon mx={"auto"} size={"md"} color={"GrayText"}>
						<IoIosArrowBack />
					</Icon>
				</Button>
				<Input
					value={search}
					onKeyUp={handleKeyUp}
					onFocus={() => setOpen(true)}
					onBlur={() =>
						setTimeout(() => {
							setOpen(false);
						}, 150)
					}
					onChange={(e) => setSearch(e.target.value)}
					variant="flushed"
					placeholder={placeholder}
					_placeholder={{ color: "black" }}
					_focus={{ borderColor: "gray.200" }}
					px={10}
					fontSize={"md"}
					height={10}
				/>
				{search.length > 0 ? (
					<Button position={"absolute"} right={0} variant="plain" onClick={handleClose}>
						<Icon size={"xl"} color={"GrayText"}>
							<IoIosClose />
						</Icon>
					</Button>
				) : null}
			</Container>
		</Box>
	);
}

class FetchError extends Error {
	info?: any;
	status?: number;

	constructor(message: string) {
		super(message);
		this.name = "FetchError";
	}
}

const fetcher = async (url: string) => {
	const res = await fetch(url);
	if (!res.ok) {
		const error = new FetchError("An error occurred while fetching the data.");
		error.info = res.json();
		error.status = res.status;
		throw error;
	}
	return res.json();
};

function Main({ open }: { open: boolean }) {
	const [schParams] = useSearchParams(new URLSearchParams(window.location.search));
	const keyword = schParams.get("q");
	const libCode = schParams.get("libCode");

	const searchUrl = new URL("search/normal", import.meta.env.VITE_BACKEND_API);
	searchUrl.searchParams.set("q", keyword || "");
	searchUrl.searchParams.set("libCode", libCode || "");

	const { data, error, isLoading } = useSWR<SearchResult[]>(
		keyword && libCode ? searchUrl.toString() : null,
		(url: string) => fetcher(url),
		{
			refreshInterval: 0,
		}
	);

	const direct: SearchResult[] = [];
	const indirect: SearchResult[] = [];
	data?.forEach((e) => (e.score > 0.5 ? direct.push(e) : indirect.push(e)));

	if (!keyword || !libCode || open) {
		return <RecentKeyword />;
	}

	if (isLoading) {
		return <Loading />;
	}

	if (error) {
		return <ErrorPage />;
	}

	if (!data) {
		return <NotFound keyword={keyword} />;
	}

	return (
		<Box mx={5} pb={5}>
			<Grid templateColumns="repeat(2, 1fr)" columnGap={8} rowGap={8}>
				{direct.map((result) => (
					<BookCard key={result.isbn} result={result} />
				))}
			</Grid>
			<Separator my={3} />
			{indirect.length > 0 && (
				<>
					<Text py={5} fontSize={"xl"} fontWeight={600}>
						기타 추천 도서
					</Text>
					<Grid templateColumns="repeat(2, 1fr)" columnGap={8} rowGap={8}>
						{indirect.map((result) => (
							<BookCard key={result.isbn} result={result} />
						))}
					</Grid>
				</>
			)}
		</Box>
	);
}

function BookCard({ result }: { result: SearchResult }) {
	return (
		<GridItem>
			<Link to={`/book/detail/${result.isbn}`}>
				<BookImage src={result.imageUrl} />
				<Flex direction={"column"} fontSize={"xs"} color={"GrayText"} mt={2}>
					<Text
						fontSize={"sm"}
						fontWeight={600}
						color={"HighlightText"}
						lineClamp={result.title.length < 2 ? 0 : 2}
					>
						{result.title}
					</Text>
					<Text>{result.author}</Text>
					<Text>{result.publicationYear}</Text>
				</Flex>
			</Link>
		</GridItem>
	);
}

const Loading = () => {
	return (
		<Center flexGrow={1} opacity={0.5}>
			<VStack>
				<Spinner />
				<Text>검색중...</Text>
			</VStack>
		</Center>
	);
};

function RecentKeyword() {
	const { RecentKeywords, removeKeyword } = useRecentSearchKeywordStore();
	const { handleSearch } = useBookSearch();
	return (
		<Box mx={5} pb={5}>
			<SubTitle>최근 검색어</SubTitle>
			{RecentKeywords.map((keyword) => (
				<Flex key={keyword.id} _hover={{ bg: "gray.100" }}>
					<Button
						onClick={() => handleSearch(keyword.keyword)}
						variant="plain"
						px={0}
						flexGrow={1}
						justifyContent={"left"}
					>
						<Icon>
							<GoHistory />
						</Icon>
						<Text>{keyword.keyword}</Text>
					</Button>
					<CloseButton onClick={() => removeKeyword(keyword)} variant="plain" size="md" />
				</Flex>
			))}
		</Box>
	);
}

function FilterBox() {
	const { chosenLibs } = useLibStore();
	const [searchParams] = useSearchParams();
	const { handleSearch } = useBookSearch();

	const prevLibCode = searchParams.get("libCode");
	const currLibCode = chosenLibs.map((l) => l.libCode).join(",");

	useEffect(() => {
		if (prevLibCode !== currLibCode!) {
			const keyword = searchParams.get("q");
			keyword && handleSearch(keyword);
		}
	}, [chosenLibs]);

	return (
		<Flex alignItems={"center"} p={2} mb={2}>
			<BookSelectDrawer
				buttonComp={
					<Flex
						display={"inline-flex"}
						alignItems={"center"}
						px={2}
						py={1}
						gapX={1}
						fontWeight={500}
						fontSize={"sm"}
						color={"GrayText"}
						cursor={"button"}
						borderWidth={1}
						borderRadius={"full"}
					>
						<Icon size={"sm"}>
							<HiLibrary />
						</Icon>
						{chosenLibs[chosenLibs.length - 1].libName}{" "}
						{chosenLibs.length > 1 && ` 외 ${chosenLibs.length - 1}개`}
						<Icon color={"gray"}>
							<MdOutlineArrowDropDown />
						</Icon>
					</Flex>
				}
			/>
		</Flex>
	);
}

function ErrorPage() {
	return (
		<Flex flexGrow={1}>
			<EmptyState
				title="에러가 발생했습니다."
				icon={<BiError />}
				description="잠시후 다시 시도해주세요"
			/>
		</Flex>
	);
}
function NotFound({ keyword }: { keyword: string }) {
	return (
		<Flex flexGrow={1}>
			<EmptyState
				title={`${keyword}에 대한 검색 결과가 없습니다.`}
				description="인근 도서관을 추가하여 검색 범위를 늘려 보세요."
				icon={<IoAlertCircleOutline />}
			/>
		</Flex>
	);
}
