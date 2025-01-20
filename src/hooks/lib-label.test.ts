import { describe, it, expect } from "vitest";
import { getLibLabel } from "./lib-label";

// FILE: src/pages/home/lib-label.test.ts

describe("getLibLabel", () => {
	it("should return the name of the single best seller library", () => {
		const libs = [{ libName: "Library A", isBestSeller: true }];
		expect(getLibLabel(libs)).toBe("Library A");
	});

	it('should return "도서관을 선택하세요" when there are no best seller libraries', () => {
		const libs = [
			{ libName: "Library A", isBestSeller: false },
			{ libName: "Library B", isBestSeller: false },
		];
		expect(getLibLabel(libs)).toBe("도서관을 선택하세요");
	});

	it('should return "도서관 전체" when all libraries are best sellers', () => {
		const libs = [
			{ libName: "Library A", isBestSeller: true },
			{ libName: "Library B", isBestSeller: true },
		];
		expect(getLibLabel(libs)).toBe("도서관 전체");
	});

	it("should return the name of the first library and the count of other best seller libraries", () => {
		const libs = [
			{ libName: "Library A", isBestSeller: true },
			{ libName: "Library B", isBestSeller: true },
			{ libName: "Library C", isBestSeller: false },
		];
		expect(getLibLabel(libs)).toBe("Library A 외 1개 도서관");
	});
});
