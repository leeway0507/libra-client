import { Box, Text, Icon, Flex, Image, Button, Table, Center } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router";
import { IoIosArrowBack } from "react-icons/io";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import { toaster } from "@/components/ui/toaster";
import useBookMarkStore, { BookInfo } from "@/hooks/store/bookmark";
import { format } from "date-fns";
import ImageCover from "@/components/image-cover";
import { SubTitle } from "@/components/text";
import useLibStore from "@/hooks/store/lib";
import useSWR from "swr";
import {
	DialogBody,
	DialogCloseBaseTrigger,
	DialogContent,
	DialogHeader,
	DialogRoot,
	DialogTrigger,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import BackButton from "@/components/buttons";

type BookDetailReq = {
	isbn: string;
	libCodes: string[];
};

type LibBook = {
	libCode: number;
	classNum: string;
	bookCode: string;
};

export interface LibBookStatus extends LibBook {
	libName: string;
	bookStatus?: string;
}

export interface BookDetail extends BookInfo {
	toc: string;
	desc?: string;
	libBooks: LibBook[];
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
		// Attach extra info to the error object.
		error.info = res.json();
		error.status = res.status;
		throw error;
	}

	return res.json();
};

export default function Page() {
	const { isbn } = useParams();
	const { selectedLibs } = useLibStore();
	const reqBody: BookDetailReq = { isbn: isbn!, libCodes: selectedLibs.map((v) => v.value) };
	const { data, error, isLoading } = useSWR<BookDetail>("/book/detail", (url: string) =>
		fetcher(url, reqBody)
	);

	if (isLoading) {
		return null;
	}
	if (error?.status === 404) {
		return <NotFoundPage isbn={isbn} />;
	}

	return data !== undefined ? (
		<Box my={1} bgColor="white">
			<SearchBarMock bookDetail={data} />
			<Box mx={4}>
				<BookCard bookInfo={data} />
				<Flex direction="column" mx={2} my={3} gapY={3}>
					{data.toc && <Toc text={data.toc} />}
					<BorrowStatus data={data.libBooks} />
				</Flex>
			</Box>
		</Box>
	) : null;
}
function SearchBarMock({ bookDetail }: { bookDetail?: BookDetail }) {
	return (
		<Flex my={1} justifyContent={"space-between"} alignItems={"center"}>
			<BackButton />
			{bookDetail && <BookMarkButton bookDetail={bookDetail} />}
		</Flex>
	);
}

function BookMarkButton({ bookDetail }: { bookDetail: BookDetail }) {
	const { checkBookMarked, toggleBookMark } = useBookMarkStore();

	const isBookMarked = checkBookMarked(bookDetail);
	const handleOnclick = () => {
		toggleBookMark(bookDetail);
		!isBookMarked &&
			toaster.create({
				title: "북마크에 저장하였습니다.",
			});
	};
	return (
		<Box pr={3} cursor={"pointer"}>
			<Center w={7} aspectRatio={"1/1"} rounded={3} onClick={() => handleOnclick()}>
				<Icon size={"lg"} color={"gray"}>
					{isBookMarked ? <FaBookmark /> : <FaRegBookmark />}
				</Icon>
			</Center>
		</Box>
	);
}

function BookCard({ bookInfo }: { bookInfo: BookDetail }) {
	return (
		<Flex spaceX={4}>
			<Flex basis={"1/4"}>
				<ImageCover>
					<Image
						rounded="md"
						aspectRatio={"3/4"}
						w="100%"
						fit="contain"
						src={`/book-img/${3}.jpg`}
						onError={({ currentTarget }) => {
							currentTarget.onerror = null; // prevents looping
							currentTarget.src = "/book-img/1.jpg";
						}}
					/>
				</ImageCover>
			</Flex>
			<Flex basis={"2/4"} direction={"column"} color={"gray"} fontSize={"sm"}>
				<Text color={"black"} fontSize={"lg"}>
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
		<Box spaceY={2}>
			<SubTitle>목차</SubTitle>
			<Text lineClamp={text.length < 10 ? 0 : 10} whiteSpace={"pre-wrap"}>
				{text}
			</Text>
			<SpecPage buttonName="더보기" content={text} />
		</Box>
	);
}

function BorrowStatus({ data }: { data: LibBook[] }) {
	const { liCodes: libCode } = useLibStore();
	const LibBookStatus = data.map((b) => ({ ...b, libName: libCode[b.libCode]?.libName }));

	const readableDate = format(Date.now(), "yy/MM/dd HH:mm:ss");

	return (
		<Box spaceY={2}>
			<Flex justifyContent={"space-between"} alignItems={"center"}>
				<SubTitle>대여정보</SubTitle>
				<Text fontSize={"xs"} color={"gray"}>
					업데이트 : {readableDate}
				</Text>
			</Flex>
			<BorrowStatusTable data={LibBookStatus} />
		</Box>
	);
}

function BorrowStatusTable({ data }: { data: LibBookStatus[] }) {
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
				{data.map((item) => (
					<Table.Row key={item.libName}>
						<Table.Cell>{item.libName}</Table.Cell>
						<Table.Cell>{item.classNum + item.bookCode}</Table.Cell>
						<Table.Cell textAlign="end">{item.bookStatus || "-"}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
}

function SpecPage({ buttonName, content }: { buttonName: string; content: string }) {
	return (
		<DialogRoot scrollBehavior="inside" size="sm">
			<DialogTrigger asChild>
				<Button variant="plain" ms={"auto"} px={0} display={"block"}>
					{buttonName}
				</Button>
			</DialogTrigger>
			<DialogContent my={0} maxHeight={"100vh"}>
				<DialogHeader px={2}>
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
