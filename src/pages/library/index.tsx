import { Box, Flex, Text, Image, Button, Grid, GridItem } from "@chakra-ui/react";
import NavBar from "@/components/navbar";
import useLibStore, { type LibInfo } from "@/hooks/store/lib";
import { Tag } from "@/components/ui/tag";
import { CiClock2 } from "react-icons/ci";
import { CloseButton } from "@/components/ui/close-button";
import {
	DialogActionTrigger,
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import SelectSearch from "@/components/select-search";
import { district } from "./district";

export default function Page() {
	return (
		<>
			<Main />
			<NavBar />
		</>
	);
}

function Main() {
	const { chosenLibs, removeLib } = useLibStore();

	return (
		<Box bgColor={"Background"} flexGrow={1} width={"100%"} px={3} py={2}>
			<SelectSearch />
			<Box my={4}>
				<Text fontSize={"md"} fontWeight={600}>
					선택한 도서관 {chosenLibs.length}/5
				</Text>
				<Box>
					{chosenLibs.length > 1 ? (
						chosenLibs.map((v) => (
							<LibItem
								key={v.libCode}
								item={v}
								onRemove={() => removeLib(v.libCode)}
							/>
						))
					) : (
						<LibItem item={chosenLibs[0]} />
					)}
				</Box>
			</Box>
		</Box>
	);
}

function LibItem({ item, onRemove }: { item: LibInfo; onRemove?: () => void }) {
	return (
		<Flex borderBottomWidth={1} py={4} gapX={1}>
			<Flex basis={"1/4"}>
				<Image
					rounded="md"
					mx={"auto"}
					w="90%"
					fit="contain"
					src={`/lib-logo/district/${district[item.district as keyof typeof district]}.png`}
					alt={item.libName}
				/>
			</Flex>
			<Flex
				basis={"3/4"}
				direction={"column"}
				color={"GrayText"}
				justifyContent={"center"}
				px={2}
			>
				<Flex alignItems={"center"} justifyContent={"space-between"}>
					<Text color={"HighlightText"} fontWeight={500}>
						[{item.district}] {item.libName}
					</Text>
					{onRemove && <CloseButton size={"xs"} onClick={onRemove} />}
				</Flex>
				<Text fontSize={"sm"}>{item.address}</Text>

				<Flex justifyContent={"space-between"} mt={1}>
					<Flex gapX={2}>
						<OperatingTime>
							<Grid templateColumns="repeat(4, 1fr)" rowGap={8}>
								<GridItem colSpan={1}>
									<Text whiteSpace={"nowrap"}>휴관일</Text>
								</GridItem>
								<GridItem colSpan={3}>
									<Text>{item.closed}</Text>
								</GridItem>
								<GridItem colSpan={1}>
									<Text whiteSpace={"nowrap"}>운영시간</Text>
								</GridItem>
								<GridItem colSpan={3}>
									<Text>{item.operatingTime}</Text>
								</GridItem>
							</Grid>
						</OperatingTime>
					</Flex>
					{item.distance !== 0 && (
						<Text fontSize={"sm"} me={2}>
							{item.distance}km
						</Text>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
}

const OperatingTime = ({ children }: { children: React.ReactNode }) => {
	return (
		<DialogRoot size={"sm"} placement={"center"} motionPreset="slide-in-bottom">
			<DialogTrigger asChild>
				<Tag startElement={<CiClock2 />} variant={"outline"} cursor={"pointer"}>
					<Text fontSize={"x-small"}>운영시간</Text>
				</Tag>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>도서관 운영시간</DialogTitle>
				</DialogHeader>
				<DialogBody>{children}</DialogBody>
				<DialogFooter>
					<DialogActionTrigger asChild>
						<Button>닫기</Button>
					</DialogActionTrigger>
				</DialogFooter>
				<DialogCloseTrigger />
			</DialogContent>
		</DialogRoot>
	);
};
