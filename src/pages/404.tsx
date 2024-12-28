import BackButton from "@/components/buttons";
import { EmptyState } from "@/components/ui/empty-state";
import { Box, Center, Flex } from "@chakra-ui/react";

export default function NotFound({ isbn }: { isbn?: string }) {
	return (
		<Flex my={1} bgColor="white" direction={"column"} h={"100%"}>
			<Box>
				<BackButton />
			</Box>
			<Center flexGrow={1}>
				<EmptyState
					title={"페이지를 찾을 수 없습니다."}
					description={isbn && `${isbn}에 대한 결과가 없습니다`}
				/>
			</Center>
		</Flex>
	);
}
