import { Flex, Box, Icon, Text } from "@chakra-ui/react";
import { IoMdBookmarks } from "react-icons/io";
import { RiSearch2Fill } from "react-icons/ri";

import { IoMdHome } from "react-icons/io";
import { HiLibrary } from "react-icons/hi";
import { Link } from "react-router";

export default function NavBar() {
	return (
		<Box
			position="fixed"
			bottom={{ base: 0, sm: 7 }}
			bgColor={"gray.50"}
			py={3}
			w={"100%"}
			maxW="md"
		>
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
			opacity={0.8}
			_hover={{
				textDecoration: "none",
			}}
		>
			<Link to={to}>
				<Flex>
					<Flex flexBasis={0.5} />
					<Flex
						mx={"auto"}
						flexBasis={2}
						justifyContent={"center"}
						_hover={{ bgColor: "gray.200" }}
						bgColor={currUrl.pathname === to ? "gray.200" : "transparent"}
						py={1}
						px={3.5}
						rounded={10}
					>
						<Icon size={"lg"}>{icon}</Icon>
					</Flex>
					<Flex flexBasis={0.5} />
				</Flex>
				<Text fontSize={"xs"} textTransform={"capitalize"} textAlign={"center"}>
					{name}
				</Text>
			</Link>
		</Flex>
	);
}
