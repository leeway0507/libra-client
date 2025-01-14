import { Button, Flex } from "@chakra-ui/react";
import { IoBanSharp } from "react-icons/io5";

import { EmptyState } from "@/components/ui/empty-state";
import { useNavigate } from "react-router";

export default function NotFound() {
	const navigate = useNavigate();
	const goBack = () => {
		navigate(-1);
	};
	return (
		<Flex
			flexGrow={1}
			direction={"column"}
			height={"100%"}
			justifyContent={"center"}
			alignItems={"center"}
		>
			<EmptyState
				title="페이지를 찾을 수 없습니다"
				icon={<IoBanSharp />}
				description="올바른 주소로 접속해 주세요"
			/>
			<Button onClick={goBack} w={"80%"}>
				뒤로가기
			</Button>
		</Flex>
	);
}
