import { Center, Icon, Image } from "@chakra-ui/react";
import { IoBookOutline } from "react-icons/io5";


export default function BookImage({ src }: { src: string }) {
	return src ? (
		<Image
			shadow="md"
			rounded="md"
			fit="fit"
			src={src}
			bgColor="gray.50"
			w="100%"
			mx="auto"
			aspectRatio="1/1.414"
		/>
	) : (
		<Center
			borderWidth={1}
			rounded="md"
			shadow="md"
			mb={1}
			w="100%"
			mx="auto"
			aspectRatio="1/1.414"
		>
			<Center fontSize="xs">
				<Icon size={"xl"} opacity={0.3}>
					<IoBookOutline />
				</Icon>
				</Center>
		</Center>
	);
}
