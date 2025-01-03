import { Center, Image, Box } from "@chakra-ui/react";
import { useState } from "react";

export function ImageCover({ children }: { children: React.ReactNode }) {
	return (
		<Center rounded={4} shadow={"md"} mb={1} w="100%">
			{children}
		</Center>
	);
}

export default function BookImage({ src }: { src: string }) {
	const [isError, setIsError] = useState(false);

	return (
		<ImageCover>
			{isError ? (
				<Box aspectRatio={"1/1.414"} w="100%">
					<Center height={"full"}>No Image</Center>
				</Box>
			) : (
				<Image
					rounded="md"
					aspectRatio={"1/1.414"}
					w="100%"
					fit="fit"
					src={src}
					onError={() => {
						setIsError(true);
					}}
					bgColor={"gray.50"}
				/>
			)}
		</ImageCover>
	);
}
