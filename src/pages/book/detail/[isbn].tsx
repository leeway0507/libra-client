import { Box, Text, Icon, Flex, Button, Table, Center, Stack } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router";
import { IoIosArrowBack } from "react-icons/io";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import { toaster } from "@/components/ui/toaster";
import useBookMarkStore, { BookInfo, LibBook } from "@/hooks/store/bookmark";
import BookImage from "@/components/book-image";
import { SubTitle } from "@/components/text";
import useLibStore from "@/hooks/store/lib";
import useSWR from "swr";
import {
	DialogBody,
	DialogCloseBaseTrigger,
	DialogContent,
	DialogHeader,
	DialogRoot,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import BackButton from "@/components/buttons";
import { useSearchParams } from "react-router";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

type BookDetailReq = {
	isbn: string;
	libCodes: string[];
};

export interface LibBookStatus {
	bookCode: string;
	libName: string;
	bookStatus?: string;
}

class FetchError extends Error {
	info?: any;
	status?: number;

	constructor(message: string) {
		super(message);
		this.name = "FetchError";
	}
}

const fetcher = async (path: string, body: BookDetailReq) => {
	const res = await fetch(new URL(path, import.meta.env.VITE_BACKEND_API), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
	if (!res.ok) {
		const error = new FetchError("An error occurred while fetching the data.");
		error.info = res.json();
		error.status = res.status;
		throw error;
	}

	return res.json();
};

export default function Page() {
	const { isbn } = useParams();
	const { chosenLibs } = useLibStore();
	const { bookMarkList } = useBookMarkStore();
	const [srchParams] = useSearchParams();
	const pageType = srchParams.get("type");

	const reqBody: BookDetailReq = {
		isbn: isbn!,
		libCodes:
			pageType === "bookmark"
				? bookMarkList
						.find((b) => b.isbn === isbn)
						?.libBooks.map((v) => v.libCode.toString()) || []
				: chosenLibs.map((v) => v.libCode),
	};

	const swrCacheKey = JSON.stringify({ path: "/book/detail", reqBody: reqBody });

	const { data, error, isLoading } = useSWR<BookInfo>(
		swrCacheKey,
		() => fetcher("/book/detail", reqBody),
		{
			keepPreviousData: true,
			refreshInterval: 0,
		}
	);

	if (isLoading) {
		return <Loading />;
	}
	if (error?.status === 404) {
		return <NotFoundPage isbn={isbn} />;
	}

	return data === undefined ? null : (
		<>
			<SearchBarMock bookDetail={data} />
			<Box mx={4}>
				<BookCard bookInfo={data} />
				<Flex direction="column" mx={2} flexGrow={1}>
					{data.toc && <Toc text={data.toc} />}
					<Box spaceY={2}>
						<Flex justifyContent={"space-between"} alignItems={"center"}>
							<SubTitle>대여정보</SubTitle>
						</Flex>
						<BorrowStatusTable libBooks={data.libBooks} />
					</Box>
				</Flex>
			</Box>
		</>
	);
}
function SearchBarMock({ bookDetail }: { bookDetail?: BookInfo }) {
	return (
		<Flex my={1} justifyContent={"space-between"} alignItems={"center"}>
			<BackButton />
			{bookDetail && <BookMarkButton bookDetail={bookDetail} />}
		</Flex>
	);
}
function NotFoundPage({ isbn }: { isbn?: string }) {
	return (
		<Flex bgColor="white" direction={"column"} h={"100%"}>
			<SearchBarMock />
			<Center flexGrow={1}>
				<EmptyState
					title={"페이지를 찾을 수 없습니다."}
					description={isbn && `${isbn}에 대한 결과가 없습니다`}
				/>
			</Center>
		</Flex>
	);
}

function BookMarkButton({ bookDetail }: { bookDetail: BookInfo }) {
	const { checkBookMarked, toggleBookMark } = useBookMarkStore();
	const [srchParams] = useSearchParams();

	const navigate = useNavigate();

	const isBookMarked = checkBookMarked(bookDetail.isbn);
	const handleOnclick = () => {
		toggleBookMark(bookDetail);
		!isBookMarked &&
			toaster.create({
				title: "북마크에 저장하였습니다.",
			});
		if (srchParams.get("type") === "bookmark") {
			navigate("/bookmark");
		}
	};

	return (
		<Box pr={3} cursor={"pointer"}>
			<Center w={7} aspectRatio={"1/1"} rounded={3} onClick={() => handleOnclick()}>
				<Icon size={"lg"} color={"GrayText"}>
					{isBookMarked ? <FaBookmark /> : <FaRegBookmark />}
				</Icon>
			</Center>
		</Box>
	);
}

function BookCard({ bookInfo }: { bookInfo: BookInfo }) {
	return (
		<Flex spaceX={4}>
			<Flex basis={"1/4"}>
				<BookImage src={`/book-img/${3}.jpg`} />
			</Flex>
			<Flex basis={"3/4"} direction={"column"} color={"GrayText"} fontSize={"sm"}>
				<Text color={"HighlightText"} fontWeight={600} fontSize={"md"}>
					{bookInfo.title}
				</Text>
				<Text>{bookInfo.author}</Text>
				<Text>{bookInfo.publisher}</Text>
				<Text>{bookInfo.publicationYear}</Text>
			</Flex>
		</Flex>
	);
}

function Toc({ text }: { text: string }) {
	return (
		<Box spaceY={2} mt={3}>
			<SubTitle>목차</SubTitle>
			<Text lineClamp={text.length < 10 ? 0 : 10} whiteSpace={"pre-wrap"} fontSize={"sm"}>
				{text}
			</Text>
			<SpecPage buttonName="더보기" content={text} />
		</Box>
	);
}

function BorrowStatusTable({ libBooks }: { libBooks: LibBook[] }) {
	return (
		<Table.Root size="sm">
			<Table.Header>
				<Table.Row bg="bg.subtle">
					<Table.ColumnHeader>도서관</Table.ColumnHeader>
					<Table.ColumnHeader>장서번호</Table.ColumnHeader>
					<Table.ColumnHeader textAlign="end">대출상태</Table.ColumnHeader>
				</Table.Row>
			</Table.Header>
			<Table.Body fontSize={"xs"}>
				{libBooks.map((libBook) => (
					<Row defaultItem={libBook} key={libBook.libCode} />
				))}
			</Table.Body>
		</Table.Root>
	);
}

function Row({ defaultItem }: { defaultItem: LibBook }) {
	const { optionLibs } = useLibStore();
	const { isbn } = useParams();
	const {
		data: scrapResp,
		error,
		isLoading,
	} = useSWR<LibBookStatus[]>(
		new URL(
			`scrap/${defaultItem.libCode}/${isbn}`,
			import.meta.env.VITE_BACKEND_API
		).toString(),
		(url: string) => fetch(url).then((res) => res.json())
	);

	const libInfo = optionLibs.find((l) => l.libCode === defaultItem.libCode);

	const getCellValue = (key: "bookCode" | "bookStatus", fallbackValue?: string) => {
		if (isLoading) return <SkeletonText noOfLines={1} />;
		if (error || !scrapResp) return fallbackValue || "-";
		const matchedData = scrapResp.find((v) => v.libName.includes(libInfo?.libName!));
		return matchedData?.[key] || fallbackValue || "-";
	};

	return (
		<Table.Row key={defaultItem.libCode}>
			<Table.Cell>{libInfo!.libName}</Table.Cell>
			<Table.Cell>{getCellValue("bookCode", defaultItem.bookCode)}</Table.Cell>
			<Table.Cell textAlign="end">{getCellValue("bookStatus")}</Table.Cell>
		</Table.Row>
	);
}

function SpecPage({ buttonName, content }: { buttonName: string; content: string }) {
	const [searchParams, setSearchParams] = useSearchParams();
	const isOpen = searchParams.get("tocOpen");

	const handleChange = () => {
		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);
			isOpen ? newParams.delete("tocOpen") : newParams.set("tocOpen", "true");
			return newParams;
		});
	};
	const navigation = useNavigate();
	return (
		<DialogRoot
			scrollBehavior={"inside"}
			lazyMount
			open={Boolean(isOpen)}
			onOpenChange={() => navigation(-1)}
		>
			<Button variant="plain" ms={"auto"} px={0} display={"block"} onClick={handleChange}>
				{buttonName}
			</Button>
			<DialogContent my={0} maxHeight={"100dvh"}>
				<DialogHeader px={2} py={1}>
					<DialogCloseBaseTrigger>
						<Button variant={"plain"} px={0}>
							<Icon size="lg" aria-label="back">
								<IoIosArrowBack />
							</Icon>
							<Text>뒤로가기</Text>
						</Button>
					</DialogCloseBaseTrigger>
				</DialogHeader>
				<DialogBody whiteSpace={"pre-wrap"}>{content}</DialogBody>
			</DialogContent>
		</DialogRoot>
	);
}

function Loading() {
	return (
		<Box mx={4} my={8} spaceY={10}>
			<Flex spaceX={4}>
				<Flex basis={"1/4"}>
					<Skeleton aspectRatio={"1/1.414"} w={"full"} h={"full"} />
				</Flex>
				<Flex basis={"3/4"} direction={"column"} spaceY={4} my={1}>
					<SkeletonText noOfLines={4} gap={4} />
				</Flex>
			</Flex>
			<Skeleton aspectRatio={"1/0.6"} w={"full"} />
			<SkeletonText noOfLines={1} h={"25px"} w={"25%"} />
			<Stack>
				<SkeletonText noOfLines={1} />
				<SkeletonText noOfLines={1} />
			</Stack>
		</Box>
	);
}
