import { useEffect, useState } from "react";
import Select from "react-select";

export type SelectProps = {
	value: string;
	label: string;
};

export interface SelectFilterProps {
	availableOptions: SelectProps[];
	selectedOptions: SelectProps[];
	setSelectedOptions: (s: SelectProps[]) => void;
	placeHolder?: string;
}

export default function SelectSearch({
	availableOptions: optionArr,
	selectedOptions: selected,
	setSelectedOptions,
	placeHolder,
}: SelectFilterProps) {
	const [value, setValue] = useState<SelectProps[]>(selected);

	useEffect(() => {
		setSelectedOptions(value);
	}, [value, setSelectedOptions]);

	return (
		<Select
			onChange={(valArr) => setValue(valArr.map((v) => v))}
			options={optionArr}
			maxMenuHeight={300}
			defaultValue={selected}
			menuIsOpen
			isMulti
			controlShouldRenderValue={false}
			hideSelectedOptions={false}
			placeholder={placeHolder || ""}
			noOptionsMessage={() => "검색 결과가 없습니다."}
			styles={{
				control: (base) => ({
					...base,
					"&:hover": { borderColor: "gray" }, // border style on hover
					border: "1px solid lightgray", // default border color
					boxShadow: "none", // no box-shadow
					cursor: "text",
					display: "flex",
				}),
				menu: () => ({
					position: "unset",
					height: "200px",
					overflow: "scroll",
				}),
				option: (base, state) => ({
					...base,
					backgroundColor: state.isSelected ? "#e2e8f0" : "white",
					cursor: "pointer",
					":hover": {
						backgroundColor: "#e2e8f0",
					},
				}),
			}}
		/>
	);
}
