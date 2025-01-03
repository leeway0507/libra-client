import { create } from "zustand";
import { persist } from "zustand/middleware";
import { libCodeAsKey } from "./rawdata/libcode";
export type LibProps = {
	value: string;
	label: string;
};

type libCodeProps = {
	district: string;
	libName: string;
};

export interface LibState {
	libCodes: {
		[key: string]: libCodeProps;
	};
	optionLibs: LibProps[];
	selectedLibs: LibProps[];
	addLib: (lib: LibProps) => void;
	changeLibs: (libs: LibProps[]) => void;
	removeLib: (libCode: string) => void;
}

const optionLibs = Object.entries(libCodeAsKey).map(([libCode, value]) => ({
	value: libCode,
	label: value.libName,
}));

const defaultLibs = [
	{
		label: "서울도서관",
		value: "111314",
	},
];

const useLibStore = create<LibState>()(
	persist(
		(set) => ({
			selectedLibs: defaultLibs,
			optionLibs: optionLibs,
			libCodes: libCodeAsKey,
			addLib: (lib: LibProps) => {
				set((state) => ({
					selectedLibs: [...state.selectedLibs, lib],
				}));
			},
			changeLibs: (libs: LibProps[]) => {
				set(() => ({
					selectedLibs: libs,
				}));
			},
			removeLib: (libCode) => {
				set((state) => ({
					selectedLibs: state.selectedLibs.filter((l) => l.value !== libCode),
				}));
			},
		}),
		{
			name: "libs",
		}
	)
);

export default useLibStore;
