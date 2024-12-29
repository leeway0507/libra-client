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
			isMulti
			isClearable={false}
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
				}),
				menu: (base) => ({
					...base,
					height: "200px",
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
