import { Flex, Icon, Text, Button } from "@chakra-ui/react";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router";

export default function SearchBarMock() {
	return (
		<Link to="/search">
			<Flex
				position={"relative"}
				px={0}
				my={1}
				height={"10"}
				color={"GrayText"}
				borderBottomWidth={1}
			>
				<Button variant="plain" position={"absolute"} zIndex={1} px={0}>
					<Icon mx={"auto"} size={"md"} color={"GrayText"}>
						<IoIosSearch />
					</Icon>
				</Button>
				<Text ps={10} my={"auto"}>
					검색하기
				</Text>
			</Flex>
		</Link>
	);
}
