import { Box, Text, Icon, Flex, Image, Button, Table, Center } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router";
import { IoIosArrowBack } from "react-icons/io";
import { useState } from "react";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import {  toaster } from "@/components/ui/toaster"
import useBookMarkStore from "@/hooks/store/bookmark";
import { BookSearchResult } from "@/hooks/store/search";
import { format } from "date-fns";
import ImageCover from "@/components/image-cover";
import { SubTitle } from "@/components/text";

export type LibBookStatus = {
	district: string;
	libName: string;
	isbn: string;
	bookCode: string;
	bookStatus: string;
};
export interface BookDetail extends BookSearchResult {
	toc: string;
	desc?: string;
}

export default function Page() {
	const { id } = useParams(); // URL에서 동적 매개변수 가져오기
	const bookDetail: BookDetail = {
		isbn: `${id}`,
		title: "Lorem, ipsum dolor.",
		author: "Lorem ipsum dolor sit amet.",
		imageUrl: `/book-img/${3}.jpg`,
		libCode: ["111005", "111015"],
		publicationYear: "2023",
		publisher: "python",
		toc: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis voluptate, earum harum doloribus sequi consequuntur enim eaque a provident recusandae quo expedita sed iure quam tenetur fuga esse! Pariatur, asperiores. Aliquid sit quidem aut earum quaerat eligendi, quia veniam quod quo deleniti?`,
		desc: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Architecto labore soluta dolor. Voluptatem minus quia esse iusto accusamus maxime cumque assumenda dolorem sint, magnam voluptas, architecto ad similique atque ipsum.`,
	};
	return (
		<Box my={1} bgColor={"white"}>
			<SearchBarMock bookDetail={bookDetail} />
			
			<Box mx={4}>
				<BookCard bookInfo={bookDetail} />
				<Flex direction={"column"} mx={2} my={3} gapY={3}>
					<Toc text={bookDetail.toc} />
					<BorrowStatus />
				</Flex>
			</Box>
		</Box>
	);
}

function SearchBarMock({ bookDetail }: { bookDetail: BookDetail }) {
	const navigate = useNavigate();
	const goBack = () => {
		navigate(-1);
	};
	return (
		<Flex my={1} justifyContent={"space-between"} alignItems={"center"}>
			<Button onClick={goBack} variant={"plain"} px={0} gap={0} >
				<Icon size="lg" aria-label="back">
					<IoIosArrowBack />
				</Icon>
				<Text>뒤로가기</Text>
			</Button>
			<BookMarkButton bookDetail={bookDetail} />
		</Flex>
	);
}

function BookMarkButton({ bookDetail }: { bookDetail: BookDetail }) {
	const { checkBookMarked, toggleBookMark } = useBookMarkStore();

	const isBookMarked = checkBookMarked(bookDetail);
	const handleOnclick =()=>{
		toggleBookMark(bookDetail)
		!isBookMarked && toaster.create({
			title: "북마크에 저장하였습니다."
		})
	}
	return (
		<Box pr={3} cursor={"pointer"}>
			<Center
				w={7}
				aspectRatio={"1/1"}
				rounded={3}
				onClick={() => handleOnclick() }
			>
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
				<Text color={"black"} fontSize={"lg"}>{bookInfo.title}</Text>
				<Text>{bookInfo.author}</Text>
				<Text>{bookInfo.publisher}</Text>
				<Text>{bookInfo.publicationYear}</Text>
			</Flex>
		</Flex>
	);
}

function Toc({ text }: { text: string }) {
	const [toggle, setToggle] = useState(false);
	return (
		<Box spaceY={2}>
			<SubTitle>목차</SubTitle>
			<Text lineClamp={toggle ? 0 : 5}>{text}</Text>

			<Button
				display={"block"}
				marginLeft={"auto"}
				variant={"plain"}
				size={"sm"}
				onClick={() => setToggle((b) => !b)}
				p={0}
			>
				{toggle ? "닫기" : "더보기"}
			</Button>
		</Box>
	);
}

function BorrowStatus() {
	const data: LibBookStatus[] = [
		{
			bookCode: "811.111.123",
			bookStatus: "대출중",
			district: "양천구",
			isbn: "123456789",
			libName: "서울특별시교육청양천도서관",
		},
		{
			bookCode: "811.111.123",
			bookStatus: "대여중(2025-01-07)",
			district: "양천구",
			isbn: "123456789",
			libName: "양천구립갈산도서관",
		},
		{
			bookCode: "811.111.123",
			bookStatus: "대출중",
			district: "양천구",
			isbn: "123456789",
			libName: "양천구립목일도서관",
		},
		{
			bookCode: "811.111.123879797",
			bookStatus: "대출중",
			district: "양천구",
			isbn: "123456789",
			libName: "양천구립일리도서관",
		},
	];
	const readableDate = format(Date.now(), "yy/MM/dd HH:mm:ss");

	return (
		<Box spaceY={2}>
			<Flex justifyContent={"space-between"} alignItems={"center"}>
			<SubTitle>대여정보</SubTitle>
				<Text fontSize={"xs"} color={"gray"}>업데이트 : {readableDate}</Text>
			</Flex>
			<BorrowStatusTable data={data} />
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
						<Table.Cell>{item.bookCode}</Table.Cell>
						<Table.Cell textAlign="end">{item.bookStatus}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
}
