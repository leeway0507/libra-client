import { describe, it, expect, beforeEach } from "vitest";
import useLibStore, { LibInfo, LibLocation, LibState } from "./lib";
import { renderHook, act } from "@testing-library/react";

describe("useLibStore", () => {
	let store: { current: LibState };

	beforeEach(() => {
		// 테스트마다 새로운 스토어 생성
		const { result } = renderHook(() => useLibStore());
		store = result;
		act(() => {
			store.current.changechosenLibs([]);
		});
	});
	it("should add a library to chosenLibs", () => {
		const lib: LibInfo = {
			libCode: "111004",
			libName: "서울특별시교육청강동도서관",
			address: "서울특별시 강동구 양재대로116길 57",
			tel: "02-2225-9800",
			latitude: 37.5385252,
			longitude: 127.143756,
			homepage: "http://gdlib.sen.go.kr/",
			closed: "매월 첫째주, 셋째주 목요일 / 일요일을 제외한 법정공휴일, 기타 관장이 필요하다고 인정하는 날",
			operatingTime: "07:00-22:00",
			district: "교육청",
			distance: 0,
		};
		act(() => {
			store.current.addLib(lib);
		});
		expect(store.current.chosenLibs).toContainEqual({ ...lib, isBestSeller: true });
	});

	it("should change chosenLibs", () => {
		const libs: LibInfo[] = [
			{
				libCode: "111004",
				libName: "서울특별시교육청강동도서관",
				address: "서울특별시 강동구 양재대로116길 57",
				tel: "02-2225-9800",
				latitude: 37.5385252,
				longitude: 127.143756,
				homepage: "http://gdlib.sen.go.kr/",
				closed: "매월 첫째주, 셋째주 목요일 / 일요일을 제외한 법정공휴일, 기타 관장이 필요하다고 인정하는 날",
				operatingTime: "07:00-22:00",
				district: "교육청",
				distance: 0,
			},
			{
				libCode: "111003",
				libName: "서울특별시교육청강남도서관",
				address: "서울특별시 강남구 선릉로116길 45",
				tel: "02-3448-4741",
				latitude: 37.5137356,
				longitude: 127.046991,
				homepage: "http://gnlib.sen.go.kr/",
				closed: "매월 첫째주, 셋째주 수요일 / 법정공휴일, 기타 사정으로 도서관장이 정하는 날",
				operatingTime: "자료실 평일09:00-18:00 (종합자료실 20:00) 주말09:00-17:00",
				district: "교육청",
				distance: 0,
			},
		];
		act(() => {
			store.current.changechosenLibs(libs);
		});
		expect(store.current.chosenLibs).toEqual(
			libs.map((lib) => ({ ...lib, isBestSeller: true }))
		);
	});

	it("should update distances", () => {
		const userLocation: LibLocation = { latitude: 36.0, longitude: 126.0 };
		const lib: LibInfo = {
			libCode: "111004",
			libName: "서울특별시교육청강동도서관",
			address: "서울특별시 강동구 양재대로116길 57",
			tel: "02-2225-9800",
			latitude: 37.5385252,
			longitude: 127.143756,
			homepage: "http://gdlib.sen.go.kr/",
			closed: "매월 첫째주, 셋째주 목요일 / 일요일을 제외한 법정공휴일, 기타 관장이 필요하다고 인정하는 날",
			operatingTime: "07:00-22:00",
			district: "교육청",
			distance: 0,
		};

		act(() => {
			store.current.chosenLibs = [lib];
			store.current.updateDistance(userLocation);
		});

		expect(store.current.chosenLibs[0].distance).not.toEqual(0);
	});

	it("should remove a library from chosenLibs", () => {
		const lib: LibInfo = {
			libCode: "111004",
			libName: "서울특별시교육청강동도서관",
			address: "서울특별시 강동구 양재대로116길 57",
			tel: "02-2225-9800",
			latitude: 37.5385252,
			longitude: 127.143756,
			homepage: "http://gdlib.sen.go.kr/",
			closed: "매월 첫째주, 셋째주 목요일 / 일요일을 제외한 법정공휴일, 기타 관장이 필요하다고 인정하는 날",
			operatingTime: "07:00-22:00",
			district: "교육청",
			distance: 0,
		};
		act(() => {
			store.current.chosenLibs = [lib];
			store.current.removeLib(lib.libCode);
		});
		expect(store.current.chosenLibs).not.toContainEqual(lib);
	});

	it("should update a library in chosenLibs", () => {
		const lib: LibInfo = {
			libCode: "111004",
			libName: "서울특별시교육청강동도서관",
			address: "서울특별시 강동구 양재대로116길 57",
			tel: "02-2225-9800",
			latitude: 37.5385252,
			longitude: 127.143756,
			homepage: "http://gdlib.sen.go.kr/",
			closed: "매월 첫째주, 셋째주 목요일 / 일요일을 제외한 법정공휴일, 기타 관장이 필요하다고 인정하는 날",
			operatingTime: "07:00-22:00",
			district: "교육청",
			distance: 0,
		};
		act(() => {
			store.current.chosenLibs = [lib];
			store.current.updateLib(lib.libCode, { libName: "Updated Library" });
		});

		expect(store.current.chosenLibs[0].libName).toBe("Updated Library");
	});
});
