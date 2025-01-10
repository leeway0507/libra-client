import useGeoStore from "@/hooks/store/geo-location";
import useLibStore from "@/hooks/store/lib";
import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { IoMdLocate } from "react-icons/io";
import Select, { components, OptionProps } from "react-select";

export type SelectProps = {
	value: string;
	label: string;
};

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

export default function SelectSearch() {
	const { requestLocation, userLocation } = useGeoStore();
	const { optionLibs, changechosenLibs, chosenLibs, updateDistance } = useLibStore();

	useEffect(() => {
		if (userLocation.latitude !== 0 && userLocation.latitude !== 0) {
			updateDistance(userLocation);
		}
	}, [userLocation]);
	return (
		<Flex gapX={1}>
			<Flex flexGrow={1}>
				<Select
					value={chosenLibs}
					onChange={(valArr) => changechosenLibs(valArr.map((v) => v))}
					options={optionLibs}
					getOptionValue={(option) => option.libCode}
					getOptionLabel={(option) => `${option.district} ${option.libName}`}
					isMulti
					isClearable={false}
					backspaceRemovesValue={false}
					controlShouldRenderValue={false}
					components={{ Option: Option }}
					placeholder={"도서관 검색"}
					noOptionsMessage={() => "검색 결과가 없습니다."}
					styles={{
						container: (base) => ({
							...base,
							width: "100%",
						}),
						control: (base) => ({
							...base,
							"&:hover": { borderColor: "gray" },
							border: "1px solid lightgray",
							boxShadow: "none",
							cursor: "text",
							minHeight: "var(--chakra-sizes-9)",
							height: "var(--chakra-sizes-9)",
						}),
						menu: (base) => ({
							...base,
							// width: "calc(100vw - 8px)",
							// maxWidth: "calc(var(--chakra-sizes-md) - 8px)",
						}),
						menuList: (base) => ({
							...base,
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
			</Flex>
			<Button variant="outline" size={"sm"} onClick={requestLocation} bgColor={"gray.100"}>
				<Icon>
					<IoMdLocate />
				</Icon>
			</Button>
		</Flex>
	);
}
