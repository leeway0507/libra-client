import { Box, Flex, Text } from "@chakra-ui/react";
import {
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogHeader,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import useLibStore from "@/hooks/store/lib";
import SelectSearch from "./select-search";
import { CloseButton } from "./ui/close-button";

export const BookSelectDrawer = ({ buttonComp }: { buttonComp: React.ReactNode }) => {
	const { chosenLibs, removeLib } = useLibStore();

	return (
		<DialogRoot key={"bottom"} placement={"bottom"} motionPreset="slide-in-bottom" size={"sm"}>
			<DialogTrigger asChild>{buttonComp}</DialogTrigger>
			<DialogContent mb={0}>
				<DialogHeader
					position={"relative"}
					display={"flex"}
					justifyContent={"center"}
					alignItems={"center"}
				>
					<DialogTitle>{"도서관을 선택하세요"}</DialogTitle>
					<DialogCloseTrigger />
				</DialogHeader>
				<DialogBody>
					<Box height={"96"}>
						{chosenLibs !== undefined && <SelectSearch />}
						<Box my={1}>
							{chosenLibs.length === 1 ? (
								<>
									<OptionItem
										label={chosenLibs[0].libName}
										distance={chosenLibs[0].distance}
									/>
									<Text
										my={10}
										textAlign={"center"}
										color={"GrayText"}
										textDecoration={"underline"}
									>
										하나 이상의 도서관을 선택하세요.
									</Text>
								</>
							) : (
								chosenLibs.map((v) => (
									<OptionItem
										key={v.libCode}
										label={v.libName}
										distance={v.distance}
										onDelete={() => removeLib(v.libCode)}
									/>
								))
							)}
						</Box>
					</Box>
				</DialogBody>
			</DialogContent>
		</DialogRoot>
	);
};

function OptionItem({
	label,
	distance,
	onDelete,
}: {
	label: string;
	distance: number;
	onDelete?: () => void;
}) {
	return (
		<Flex
			justifyContent={"space-between"}
			alignItems={"center"}
			_hover={{ bg: "gray.200" }}
			px={2}
			height={"10"}
		>
			<Flex spaceX={2}>
				<Text>{label}</Text>
				{distance !== 0 && <Text color={"GrayText"}>{distance}km</Text>}
			</Flex>
			{onDelete && <CloseButton variant={"plain"} onClick={onDelete} size={"sm"} />}
		</Flex>
	);
}
