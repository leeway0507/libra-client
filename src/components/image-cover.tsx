import { Center } from "@chakra-ui/react";

export default function ImageCover({ children }: { children: React.ReactNode }) {
	return (
		<Center rounded={4} shadow={"md"} mb={1} 						w="100%">
			{children}
		</Center>
	);
}
