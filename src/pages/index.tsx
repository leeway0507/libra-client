import { Box, Flex } from "@chakra-ui/react";
import SearchBarMock from "@/components/search-bar-mock";
import NavBar from "@/components/navbar";

export default function Page() {
	return (
		<>
			<SearchBarMock />
			<MainBox />
			<NavBar />
		</>
	);
}

function MainBox() {
	return (
		<Box backgroundColor={"blue.50"} flexGrow={1} width={"100%"}>
			<Flex gapX={1}>
				<Flex flexGrow={1}>/</Flex>/
			</Flex>
		</Box>
	);
}
