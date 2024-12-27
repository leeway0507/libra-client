import { Box, Flex } from "@chakra-ui/react";
import SearchBarMock from "@/components/search-bar-mock";
import NavBar from "@/components/navbar";

export default function Page() {
	return (
		<Flex direction="column" height="100%" paddingTop={0}>
			<SearchBarMock />
			<MainBox />
			<NavBar />
		</Flex>
	);
}

function MainBox() {
	return (
		<Box backgroundColor={"blue.50"} flexGrow={1} width={"100%"}>
			x
		</Box>
	);
}
