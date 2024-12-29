import { Center, Flex, Image, Text } from "@chakra-ui/react";
import { EmptyState } from "@/components/ui/empty-state";
import { IoIosBook } from "react-icons/io";
import SearchBarMock from "@/components/search-bar-mock";
import NavBar from "@/components/navbar";
import useBookMarkStore, { BookInfo } from "@/hooks/store/bookmark";
import { Link } from "react-router";
import ImageCover from "@/components/image-cover";

export default function Page() {
	return (
		<Flex position={"relative"} minHeight={"100vh"} direction={"column"}>
			<SearchBarMock />
			<BookMarkList />
			<NavBar />
		</Flex>
	);
}

function BookMarkList() {
	const { bookMarkList } = useBookMarkStore();

	const BookMarkArrComponent = bookMarkList.map((book) => (
		<BookMarkCard key={book.isbn} bookInfo={book} />
	));
	return bookMarkList.length !== 0 ? (
		<Flex flexGrow={1} mx={5} my={5}>
			<Flex gapY={3} flexDirection={"column"}>
				{BookMarkArrComponent}
			</Flex>
		</Flex>
	) : (
		<Center flexGrow={1}>
			<EmptyState
				icon={<IoIosBook />}
				title="북마크한 도서가 없습니다"
				description="대여 예정 도서를 저장해 쉽게 관리하세요"
			/>
		</Center>
	);
}

function BookMarkCard({ bookInfo }: { bookInfo: BookInfo }) {
	return (
		<Link to={`/book/detail/${bookInfo.isbn}?type=bookmark`}>
			<Flex spaceX={4}>
				<Flex basis={"1/5"}>
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
				<Flex basis={"3/5"} direction={"column"} fontSize={"xs"} color={"GrayText"}>
					<Text fontSize={"md"} fontWeight={600} color={"HighlightText"}>
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
