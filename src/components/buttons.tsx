import { Button, Icon, Text } from "@chakra-ui/react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router";

export default function BackButton() {
	const navigate = useNavigate();
	const goBack = () => {
		navigate(-1);
	};
	return (
		<Button onClick={goBack} variant={"plain"} px={0} gap={0}>
			<Icon size="lg" aria-label="back">
				<IoIosArrowBack />
			</Icon>
			<Text>뒤로가기</Text>
		</Button>
	);
}
