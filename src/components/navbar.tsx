import { Flex, Box, Icon, Text } from "@chakra-ui/react";
import { IoMdBookmarks } from "react-icons/io";
import { RiSearch2Fill } from "react-icons/ri";

import { IoMdHome } from "react-icons/io";
import { HiLibrary } from "react-icons/hi";
import { Link } from "react-router";

export default function NavBar() {
	return (
		<Box position="sticky" bottom={0} bgColor={"white"} py={3}>
			<Flex gapX={2}>
				<Item name="홈" to={"/"} icon={<IoMdHome />} />
				<Item name="북마크" to={"/bookmark"} icon={<IoMdBookmarks />} />
				<Item name="도서검색" to={"/search"} icon={<RiSearch2Fill />} />
				<Item name="도서관" to={"/library"} icon={<HiLibrary />} />
			</Flex>
		</Box>
	);
}

function Item({ to, name, icon }: { to: string; name: string; icon: React.ReactNode }) {
	const currUrl = new URL(window.location.href);

	return (
		<Flex
			flexDirection={"column"}
			gap={0}
			w={"100%"}
			focusRing={"none"}
			color={"GrayText"}
			_hover={{
				textDecoration: "none",
			}}
		>
			<Link to={to}>
				<Box
					mx={"auto"}
					width={"50%"}
					_hover={{ bgColor: "gray.200" }}
					bgColor={currUrl.pathname === to ? "gray.200" : "transparent"}
					py={1}
					px={3.5}
					rounded={10}
				>
					<Icon size={"lg"}>{icon}</Icon>
				</Box>
				<Text fontSize={"xs"} textTransform={"capitalize"} textAlign={"center"}>
					{name}
				</Text>
			</Link>
		</Flex>
	);
}
