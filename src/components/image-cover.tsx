import { Box } from "@chakra-ui/react";

export default function ImageCover({ children }: { children: React.ReactNode }) {
	return (
		<Box rounded={4} shadow={"md"} mb={1}>
			{children}
		</Box>
	);
}
