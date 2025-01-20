import { Button, Flex } from "@chakra-ui/react";
import { BiError } from "react-icons/bi";
import { EmptyState } from "../components/ui/empty-state";
import { useNavigate } from "react-router";

export default function ErrorPage() {
	const navigate = useNavigate();
	const goBack = () => {
		navigate(-1);
	};
	return (
		<Flex
			flexGrow={1}
			direction="column"
			height="100%"
			justifyContent="center"
			alignItems="center"
		>
			<EmptyState
				title="에러가 발생했습니다"
				icon={<BiError />}
				description="잠시후 다시 시도해주세요"
			/>
			<Button onClick={goBack} w="80%">
				뒤로가기
			</Button>
		</Flex>
	);
}
