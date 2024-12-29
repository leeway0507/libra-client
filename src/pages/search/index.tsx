import {
	Box,
	Flex,
	Input,
	Text,
	Container,
	Icon,
	Grid,
	GridItem,
	Image,
	Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { Link, useNavigate, useSearchParams } from "react-router";
import { DrawerBottom } from "@/components/drawer-bottom";
import SelectSearch from "@/components/select-search";
import useLibStore from "@/hooks/store/lib";
import NavBar from "@/components/navbar";
import { useSearchKeywordStore } from "@/hooks/store/search";
import { CloseButton } from "@/components/ui/close-button";
import { GoHistory } from "react-icons/go";
import bookResultFromApi from "./mock-data";
import ImageCover from "@/components/image-cover";
import { BookInfo } from "@/hooks/store/bookmark";
export default function Page() {
	return (
		<Flex
			direction="column"
			position={"relative"}
			minHeight={"100vh"}
			bgColor={"white"}
			spaceY={4}
		>
			<Box position={"sticky"} top={0} bgColor={"Background"} zIndex={5}>
				<SearchBar />
			</Box>
			<OptionBox />
			<MainBox />
			<NavBar />
		</Flex>
	);
}

function SearchBar() {
	const { addKeyword } = useSearchKeywordStore();
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
	const keyword = searchParams.get("keyword");
	const placeholder = keyword ? `${showMaxString(keyword)}에 대한 검색 결과` : "검색하기";

	return (
		<Container position={"relative"} px={0} my={1}>
			<Button
				position={"absolute"}
				zIndex={1}
				height={"100%"}
				variant="plain"
				px={0}
				onClick={goBack}
			>
				<Icon mx={"auto"} size={"lg"} color={"gray"}>
					<IoIosArrowBack />
				</Icon>
			</Button>
			<Input
				value={search}
				onKeyUp={handleKeyUp}
				onChange={(e) => setSearch(e.target.value)}
				variant="flushed"
				placeholder={placeholder}
				_placeholder={{ color: "black" }}
				_focus={{ borderColor: "gray.200" }}
				px={10}
				fontSize={"md"}
				autoFocus
			/>
			{search.length > 0 ? (
				<Button position={"absolute"} right={0} variant="plain" onClick={handleClose}>
					<Icon size={"xl"} color={"gray"}>
						<IoIosClose />
					</Icon>
				</Button>
			) : null}
		</Container>
	);
}

function MainBox() {
	const [schParams, _] = useSearchParams(new URLSearchParams(window.location.search));
	const keyword = schParams.get("keyword");

	return (
		<Flex flexGrow={1} direction={"column"} mx={5} pb={5}>
			{keyword ? (
				<>
					{/* <Flex justifyContent={"center"} width={"100%"} py={4} px={4}>
						<Text fontSize={"lg"}>{showMaxString(keyword)}에 대한 검색 결과</Text>
					</Flex> */}
					<Grid templateColumns="repeat(2, 1fr)" columnGap={4} rowGap={8}>
						{bookResultFromApi.map((result) => (
							<BookCard key={result.isbn} result={result} />
						))}
					</Grid>
				</>
			) : (
				<RecentKeyword />
			)}
		</Flex>
	);
}

function BookCard({ result }: { result: BookInfo }) {
	return (
		<GridItem>
			<Link to={`/book/detail/${result.isbn}`}>
				<ImageCover>
					<Image
						rounded="md"
						aspectRatio={"2/3"}
						w="100%"
						fit="fit"
						src={`/book-img/${result.isbn}.jpg`}
						onError={({ currentTarget }) => {
							currentTarget.onerror = null; // prevents looping
							currentTarget.src = "/book-img/1.jpg";
						}}
						bgColor={"gray.50"}
					/>
				</ImageCover>
				<Flex direction={"column"} fontSize={"sm"} color={"gray"}>
					<Text>{result.title}</Text>
					<Text>{result.author}</Text>
				</Flex>
			</Link>
		</GridItem>
	);
}

// const useBookSearch = ()=>{
// 	const [searchParams,setSearchParams] = useSearchParams(new URLSearchParams(window.location.search))
// 	const libs = useLibStore((state) => state.libArr);

// 	const handleRedirect = (keyword: string) => {
// 		setSearchParams((prev) => {
// 			prev.set("keyword", keyword);
// 			return prev;
// 		  })
// 		setSearchParams((prev) => {
// 			prev.set("libs", libs.map((v) => v.value).join());
// 			return prev;
// 		  })

// 	};
// 	const removeUrl = ()=>{
// 		setSearchParams(new URLSearchParams)
// 	}
// 	return {handleRedirect,removeUrl,searchParams}
// }

const useBookSearch = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const libs = useLibStore((state) => state.selectedLibs);
	const url = new URL(window.location.href);
	const handleRedirect = (keyword: string) => {
		url.searchParams.set("keyword", keyword);
		url.searchParams.set("libs", libs.map((v) => v.value).join());
		navigate(url.search, { replace: true });
	};
	const removeUrl = () => {
		navigate("", { replace: true });
	};
	return { handleRedirect, removeUrl, searchParams };
};

function RecentKeyword() {
	const { RecentKeywords, removeKeyword } = useSearchKeywordStore();
	const { handleRedirect } = useBookSearch();
	return (
		<Box>
			<Text>최근 검색어</Text>
			{RecentKeywords.map((keyword, idx) => (
				<Flex key={keyword + idx} _hover={{ bg: "gray.100" }}>
					<Button
						onClick={() => handleRedirect(keyword)}
						variant="plain"
						px={0}
						flexGrow={1}
						justifyContent={"left"}
					>
						<Icon>
							<GoHistory />
						</Icon>
						<Text>{keyword}</Text>
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

function OptionBox() {
	const { defaultLibs, selectedLibs, removeLib, changeLibs } = useLibStore();
	return (
		<Box>
			<DrawerBottom buttonName="도서관" titleName="필터">
				<Box height={"96"}>
					{/* {JSON.stringify(libs)} */}
					{selectedLibs !== undefined && (
						<SelectSearch
							availableOptions={defaultLibs}
							selectedOptions={selectedLibs}
							setSelectedOptions={changeLibs}
							placeHolder="도서관 검색"
						/>
					)}

					<Box my={1}>
						{selectedLibs.length === 1 ? (
							<>
								<OptionItem label={selectedLibs[0].label} />
								<Text
									my={10}
									textAlign={"center"}
									color={"gray"}
									textDecoration={"underline"}
								>
									하나 이상의 도서관을 선택하세요.
								</Text>
							</>
						) : (
							selectedLibs.map((v) => (
								<OptionItem
									key={v.value}
									label={v.label}
									onDelete={() => removeLib(v.value)}
								/>
							))
						)}
					</Box>
				</Box>
			</DrawerBottom>
		</Box>
	);
}

function OptionItem({ label, onDelete }: { label: string; onDelete?: () => void }) {
	return (
		<Flex
			justifyContent={"space-between"}
			alignItems={"center"}
			_hover={{ bg: "gray.200" }}
			px={2}
			height={"10"}
		>
			<Text>{label}</Text>
			{onDelete && <CloseButton variant={"plain"} onClick={onDelete} size={"sm"} />}
		</Flex>
	);
}
