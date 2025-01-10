import { create } from "zustand";
import { persist } from "zustand/middleware";
import { libInfoSeoul } from "./rawdata/lib-info-seoul";
import { LibLocation } from "./geo-location";
import { getDistance } from "geolib";

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

export interface LibState {
	optionLibs: LibInfo[];
	chosenLibs: LibInfo[];
	addLib: (lib: LibInfo) => void;
	changechosenLibs: (libs: LibInfo[]) => void;
	updateDistance: (userLocation: LibLocation) => void;
	removeLib: (libCode: string) => void;
}

const defaultLibs = [
	{
		libCode: "111314",
		libName: "서울도서관",
		address: "서울특별시 중구 세종대로 110",
		tel: "02-2133-0300",
		latitude: 37.5663245,
		longitude: 126.977752,
		homepage: "http://lib.seoul.go.kr/",
		closed: "매주 월요일 / 공휴일",
		operatingTime: "화~금 09:00~21:00 / 토,일 09:00~18:00",
		district: "서울시",
		distance: 0,
	},
];

const useLibStore = create<LibState>()(
	persist(
		(set) => ({
			chosenLibs: defaultLibs,
			optionLibs: libInfoSeoul,
			addLib: (lib: LibInfo) => {
				set((state) => ({
					chosenLibs: [...state.chosenLibs, lib],
				}));
			},
			changechosenLibs: (libs: LibInfo[]) => {
				set(() => ({
					chosenLibs: libs,
				}));
			},
			updateDistance: (userLocation: LibLocation) => {
				set((state) => ({
					chosenLibs: state.chosenLibs
						.map((v) => ({
							...v,
							distance: calcDistance(
								{ longitude: v.longitude, latitude: v.latitude },
								userLocation
							),
						}))
						.sort((a, b) => a.distance - b.distance),
					optionLibs: state.optionLibs
						.map((v) => ({
							...v,
							distance: calcDistance(
								{ longitude: v.longitude, latitude: v.latitude },
								userLocation
							),
						}))
						.sort((a, b) => a.distance - b.distance),
				}));
			},
			removeLib: (libCode) => {
				set((state) => ({
					chosenLibs: state.chosenLibs.filter((l) => l.libName !== libCode),
				}));
			},
		}),
		{
			name: "libs",
		}
	)
);

function calcDistance(from: LibLocation, userLocation: LibLocation): number {
	const meters = getDistance(from, userLocation);
	const kilometers = meters / 1000;
	return parseFloat(kilometers.toFixed(1));
}

export default useLibStore;
