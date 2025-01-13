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
} from "@chakra-ui/react";

import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { Link, useNavigate, useSearchParams } from "react-router";
import { BookSelectDrawer } from "@/components/book-select-drawer";
import useLibStore from "@/hooks/store/lib";
import NavBar from "@/components/navbar";
import { useSearchKeywordStore as useRecentSearchKeywordStore } from "@/hooks/store/search";
import { CloseButton } from "@/components/ui/close-button";
import { GoHistory } from "react-icons/go";
import { BiError } from "react-icons/bi";

import useSWR from "swr";
import { EmptyState } from "@/components/ui/empty-state";
import BookImage from "@/components/book-image";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { SubTitle } from "@/components/text";
import { HiLibrary } from "react-icons/hi";

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
	return (
		<>
			<Box position={"sticky"} top={0} bgColor={"Background"} zIndex={5}>
				<SearchBar />
			</Box>
			<FilterBox />
			<MainBox />
			<NavBar />
		</>
	);
}

function SearchBar() {
	const { addKeyword } = useRecentSearchKeywordStore();
	const { handleRedirect, removeUrl, searchParams } = useBookSearch();
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
			handleRedirect(search);
			addKeyword(search);
			setSearch("");
			e.currentTarget.blur();
		}
	};
	const handleClose = () => {
		setSearch("");
		removeUrl();
	};
	const keyword = searchParams.get("q");
	const placeholder = keyword ? `${showMaxString(keyword)}에 대한 검색 결과` : "검색하기";

	return (
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
				onChange={(e) => setSearch(e.target.value)}
				variant="flushed"
				placeholder={placeholder}
				_placeholder={{ color: "black"}}
				_focus={{ borderColor: "gray.200" }}
				px={10}
				fontSize={"md"}
				height={10}
				autoFocus
			/>
			{search.length > 0 ? (
				<Button position={"absolute"} right={0} variant="plain" onClick={handleClose}>
					<Icon size={"xl"} color={"GrayText"}>
						<IoIosClose />
					</Icon>
				</Button>
			) : null}
		</Container>
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

function MainBox() {
	const [schParams] = useSearchParams(new URLSearchParams(window.location.search));
	const keyword = schParams.get("q");
	const libCode = schParams.get("libCode");

	const searchUrl = new URL("search/normal", import.meta.env.VITE_BACKEND_API);
	searchUrl.searchParams.set("q", keyword || "");
	searchUrl.searchParams.set("libCode", libCode || "");

	const { data, error, isLoading } = useSWR<SearchResult[]>(
		keyword && libCode ? searchUrl.toString() : null,
		(url: string) => fetcher(url)
	);

	return (
		<Flex flexGrow={1} direction={"column"} mx={5} pb={5}>
			{!keyword || !libCode ? (
				<RecentKeyword />
			) : isLoading ? (
				<Loading />
			) : !error && data ? (
				<>
					{isLoading && <Loading />}
					<Grid templateColumns="repeat(2, 1fr)" columnGap={8} rowGap={8}>
						{data.map((result) => (
							<BookCard key={result.isbn} result={result} />
						))}
					</Grid>
				</>
			) : (
				<ErrorPage />
			)}
		</Flex>
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

const useBookSearch = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { chosenLibs } = useLibStore();
	const url = new URL(window.location.href);
	const handleRedirect = (keyword: string) => {
		url.searchParams.set("q", keyword);
		url.searchParams.set("libCode", chosenLibs.map((v) => v.libCode).join());
		navigate(url.search, { replace: true });
	};
	const removeUrl = () => {
		navigate("", { replace: true });
	};
	return { handleRedirect, removeUrl, searchParams };
};

function RecentKeyword() {
	const { RecentKeywords, removeKeyword } = useRecentSearchKeywordStore();
	const { handleRedirect } = useBookSearch();
	return (
		<Box>
			<SubTitle>최근 검색어</SubTitle>
			{RecentKeywords.map((keyword) => (
				<Flex key={keyword.id} _hover={{ bg: "gray.100" }}>
					<Button
						onClick={() => handleRedirect(keyword.keyword)}
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

const showMaxString = (str: string) => {
	return str.length > 10 ? str.slice(0, 10) + "..." : str;
};

function FilterBox() {
	const { chosenLibs } = useLibStore();
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
