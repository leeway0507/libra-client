import { Center, Flex, Text } from "@chakra-ui/react";
import { EmptyState } from "@/components/ui/empty-state";
import { IoIosBook } from "react-icons/io";
import NavBar from "@/components/navbar";
import useBookMarkStore, { BookInfo } from "@/hooks/store/bookmark";
import { Link } from "react-router";
import BookImage from "@/components/book-image";

export default function Page() {
	return (
		<>
			<Text mx={5} mt={5} fontSize={"lg"} fontWeight={600} textAlign={"center"}>
				북마크 도서
			</Text>
			<BookMarkList />
			<NavBar />
		</>
	);
}

function BookMarkList() {
	const { bookMarkList } = useBookMarkStore();

	const BookMarkArrComponent = bookMarkList.map((book) => (
		<BookMarkCard key={book.isbn} bookInfo={book} />
	));
	return bookMarkList.length === 0 ? (
		<Center flexGrow={1}>
			<EmptyState
				icon={<IoIosBook />}
				title="북마크한 도서가 없습니다"
				description="대여할 도서를 쉽게 관리하세요"
			/>
		</Center>
	) : (
		<Flex flexGrow={1} mx={5} my={5}>
			<Flex gapY={5} flexDirection={"column"} w={"100%"}>
				{BookMarkArrComponent}
			</Flex>
		</Flex>
	);
}

function BookMarkCard({ bookInfo }: { bookInfo: BookInfo }) {
	return (
		<Link to={`/book/detail/${bookInfo.isbn}?type=bookmark`}>
			<Flex spaceX={5}>
				<Flex basis={"1/4"}>
					<BookImage src={bookInfo.imageUrl} />
				</Flex>
				<Flex basis={"3/4"} direction={"column"} fontSize={"xs"} color={"GrayText"}>
					<Text
						fontSize={"sm"}
						fontWeight={600}
						color={"HighlightText"}
						lineClamp={bookInfo.title.length < 2 ? 0 : 2}
					>
						{bookInfo.title}
					</Text>
					<Text>{bookInfo.author}</Text>
					<Text>{bookInfo.publisher}</Text>
					<Text>{bookInfo.publicationYear}</Text>
				</Flex>
			</Flex>
		</Link>
	);
}
