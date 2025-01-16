import useLibStore, { type LibInfo, type LibLocation } from "@/hooks/store/lib";
import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import { IoMdLocate } from "react-icons/io";
import Select, { ActionMeta, components, OptionProps } from "react-select";

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
	const { optionLibs, addLib, removeLib, chosenLibs, updateDistance } = useLibStore();

	const handleRequestLocation = () => {
		requestLocation(updateDistance);
	};
	const handleChange = (actionMeta: ActionMeta<LibInfo>) => {
		if (actionMeta.action === "select-option") {
			addLib(actionMeta.option!);
		} else if (actionMeta.action === "remove-value") {
			removeLib(actionMeta.removedValue.libCode);
		}
	};
	return (
		<Flex gapX={1}>
			<Flex flexGrow={1}>
				<Select
					isDisabled={
						chosenLibs.length === parseInt(import.meta.env.VITE_MAX_LIBRARY_COUNT)
					}
					value={chosenLibs}
					onChange={(_, actionMeta) => handleChange(actionMeta)}
					options={optionLibs}
					getOptionValue={(option) => option.libCode}
					getOptionLabel={(option) => `${option.district} ${option.libName}`}
					isMulti
					isClearable={false}
					backspaceRemovesValue={false}
					controlShouldRenderValue={false}
					components={{ Option: Option }}
					placeholder={"도서관 찾기"}
					noOptionsMessage={() => "검색 결과가 없습니다."}
					styles={{
						container: (base) => ({
							...base,
							width: "100%",
						}),
						placeholder: (base) => ({
							...base,
							color: "var(--chakra-colors-black)",
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
			<Button
				variant="outline"
				size={"sm"}
				onClick={handleRequestLocation}
				bgColor={"gray.100"}
			>
				<Icon>
					<IoMdLocate />
				</Icon>
			</Button>
		</Flex>
	);
}

const requestLocation = (calcDistance: (u: LibLocation) => void) => {
	if (!navigator.geolocation) {
		console.error("Geolocation is not supported by your browser");
	}

	navigator.geolocation.getCurrentPosition(
		(position) => {
			calcDistance({
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			});
		},
		(err) => {
			console.error(err);
		}
	);
};
