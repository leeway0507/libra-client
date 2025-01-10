import { Box, Flex, Text, Image, Button, Grid, GridItem } from "@chakra-ui/react";
import NavBar from "@/components/navbar";
import useLibStore from "@/hooks/store/lib";
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

export type LibInfo = {
	libCode: string;
	libName: string;
	address: string;
	tel: string;
	latitude: number;
	longitude: number;
	homepage: string;
	closed: string;
	operatingTime: string;
	district: string;
	distance: number;
};

export type SelectProps = {
	value: string;
	label: string;
};

export interface SelectFilterProps {
	availableOptions: LibInfo[];
	selectedOptions: LibInfo[];
	setSelectedOptions: (s: LibInfo[]) => void;
	placeHolder?: string;
}

export default function Page() {
	return (
		<>
			<MainBox />
			<NavBar />
		</>
	);
}

function MainBox() {
	const { chosenLibs, removeLib } = useLibStore();

	return (
		<Box bgColor={"Background"} flexGrow={1} width={"100%"} px={1} py={2}>
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
			<Flex basis={"3/4"} direction={"column"} color={"GrayText"} justifyContent={"center"}>
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
					{item.distance !== 0 && <Text>{item.distance}km</Text>}
				</Flex>
			</Flex>
		</Flex>
	);
}

type District = {
	[key: string]: number;
};

const district: District = {
	강남구: 1,
	강동구: 2,
	강북구: 3,
	강서구: 4,
	관악구: 5,
	광진구: 6,
	구로구: 7,
	금천구: 8,
	노원구: 9,
	도봉구: 10,
	동대문구: 11,
	동작구: 12,
	마포구: 13,
	서대문구: 14,
	서초구: 15,
	성동구: 16,
	성북구: 17,
	송파구: 18,
	양천구: 19,
	영등포구: 20,
	용산구: 21,
	은평구: 22,
	종로구: 23,
	중구: 24,
	중랑구: 25,
	교육청: 26,
	서울시: 27,
};

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
