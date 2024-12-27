import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LibProps = {
	value: string;
	label: string;
};

export interface LibState {
	libArr: LibProps[];
	addLib: (lib: LibProps) => void;
	changeLibs: (libs: LibProps[]) => void;
	removeLib: (lib: LibProps) => void;
}

const useLibStore = create<LibState>()(
	persist(
		(set) => ({
			libArr: [],
			addLib: (lib: LibProps) => {
				set((state) => ({
					libArr: [...state.libArr, lib],
				}));
			},
			changeLibs: (libs: LibProps[]) => {
				set(() => ({
					libArr: libs,
				}));
			},
			removeLib: (lib: LibProps) => {
				set((state) => ({
					libArr: state.libArr.filter((l) => l.value === lib.value),
				}));
			},
		}),
		{
			name: "libs",
		}
	)
);

export default useLibStore;
