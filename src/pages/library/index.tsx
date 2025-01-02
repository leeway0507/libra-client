import { Box, Flex, Text, Image, Icon, Button, Grid, GridItem } from "@chakra-ui/react";
import Select, { components, OptionProps } from "react-select";
import NavBar from "@/components/navbar";
import { libInfoSeoul } from "../../hooks/store/rawdata/lib-info-seoul";
import useLibStore from "@/hooks/store/lib";
import { useEffect, useState } from "react";
import { IoMdLocate } from "react-icons/io";
import { getDistance } from "geolib";
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

type LibInfo = {
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
	const { changeLibs, selectedLibs, removeLib } = useLibStore();
	const [libSeoul, setLibSeoul] = useState<LibInfo[]>(libInfoSeoul);

	const selectedLibInfo = selectedLibs
		.map((v) => libSeoul.find((v2) => v.value === v2.libCode))
		.filter((v): v is LibInfo => v !== undefined);
	const [selected, setSelced] = useState<LibInfo[]>(selectedLibInfo);

	useEffect(() => {
		changeLibs(selected.map((v) => ({ label: v.libName, value: v.libCode })));
	}, [selected]);

	const { getLocation, userLocation } = useGetGeolocation();

	const onRemove = (libCode: string) => {
		removeLib(libCode);
		setSelced((selected) => selected.filter((v) => v.libCode !== libCode));
	};

	useEffect(() => {
		if (userLocation.latitude !== 0 && userLocation.latitude !== 0) {
			setLibSeoul((libSeoul) =>
				libSeoul
					.map((v) => ({
						...v,
						distance: convertMetersToKilometers(
							{ longitude: v.longitude, latitude: v.latitude },
							userLocation
						),
					}))
					.sort((a, b) => a.distance - b.distance)
			);
			setSelced((selected) =>
				selected
					.map((v) => ({
						...v,
						distance: convertMetersToKilometers(
							{ longitude: v.longitude, latitude: v.latitude },
							userLocation
						),
					}))
					.sort((a, b) => a.distance - b.distance)
			);
		}
	}, [userLocation]);
	return (
		<Box bgColor={"Background"} flexGrow={1} width={"100%"} px={1} py={2}>
			<Flex gapX={1}>
				<Flex flexGrow={1}>
					<SelectSearch
						availableOptions={libSeoul}
						selectedOptions={selected}
						setSelectedOptions={setSelced}
						placeHolder="도서관 찾기"
					/>
				</Flex>
				<Button variant="outline" size={"sm"} py={0} onClick={getLocation}>
					<Icon>
						<IoMdLocate />
					</Icon>
				</Button>
			</Flex>
			<Box my={4}>
				<Text fontSize={"md"} fontWeight={600}>
					선택한 도서관 {selected.length}/5
				</Text>
				<Box>
					{selected.length > 1 ? (
						selected.map((v) => (
							<LibItem
								key={v.libCode}
								item={v}
								onRemove={() => onRemove(v.libCode)}
							/>
						))
					) : (
						<LibItem item={selected[0]} />
					)}
				</Box>
			</Box>
		</Box>
	);
}

function convertMetersToKilometers(from: Location, to: Location): number {
	const meters = getDistance(from, to);
	const kilometers = meters / 1000;
	return parseFloat(kilometers.toFixed(1));
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
					// onError={({ currentTarget }) => {
					// 	currentTarget.src = `/lib-logo/district/${district[item.district as keyof typeof district]}.png`;
					// }}
					alt={item.libName}
				/>
			</Flex>
			<Flex
				basis={"3/4"}
				direction={"column"}
				color={"GrayText"}
				justifyContent={"center"}
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
					{item.distance !== 0 && <Text>{item.distance}km</Text>}
				</Flex>
			</Flex>
		</Flex>
	);
}

const Option = (props: OptionProps<LibInfo>) => {
	const { data } = props;

	return (
		<components.Option {...props}>
			<Flex color={"HighlightText"} fontWeight={500} justifyContent={"space-between"}>
				<Text>
					[{data.district}] {data.libName}
				</Text>
				{data.distance > 0 && <Text fontSize={"sm"}>{data.distance + "km"}</Text>}
			</Flex>
		</components.Option>
	);
};

export function SelectSearch({
	availableOptions,
	selectedOptions,
	setSelectedOptions,
	placeHolder,
}: SelectFilterProps) {
	return (
		<Select
			value={selectedOptions}
			onChange={(valArr) => setSelectedOptions(valArr.map((v) => v))}
			options={availableOptions}
			getOptionValue={(option) => option.libCode}
			getOptionLabel={(option) => `${option.district} ${option.libName}`}
			isMulti
			isClearable={false}
			backspaceRemovesValue={false}
			controlShouldRenderValue={false}
			components={{ Option: Option }}
			placeholder={placeHolder || ""}
			noOptionsMessage={() => "검색 결과가 없습니다."}
			styles={{
				container: (base) => ({
					...base,
					width: "100%",
					height: "var(--chakra-sizes-9)",
				}),
				control: (base) => ({
					...base,
					"&:hover": { borderColor: "gray" },
					border: "1px solid lightgray",
					boxShadow: "none",
					cursor: "text",
				}),
				menu: (base) => ({
					...base,
					width: "calc(100vw - 8px)",
					maxWidth: "calc(var(--chakra-sizes-md) - 8px)",
				}),
				menuList: (base) => ({
					...base,
					maxHeight: "400px",
					paddingInline: 0,
					overflow: "scroll",
				}),
				option: (base, state) => ({
					...base,
					backgroundColor: state.isSelected ? "#e2e8f0" : "white",
					color: "black",
					cursor: "pointer",
					":hover": {
						backgroundColor: "#e2e8f0",
					},
				}),
			}}
		/>
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

type Location = { latitude: number; longitude: number };

function useGetGeolocation() {
	const [userLocation, setUserLocation] = useState<Location>({ latitude: 0, longitude: 0 });
	const [error, setError] = useState<string>("");

	const getLocation = () => {
		if (!navigator.geolocation) {
			setError("Geolocation is not supported by your browser");
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setUserLocation({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				});
				setError(""); // Clear any previous errors
			},
			(err) => {
				setError(err.message);
			}
		);
	};

	return { getLocation, userLocation, error };
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
