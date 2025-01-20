import { describe, it, expect, beforeEach } from "vitest";
import { useBookMarkStore, BookInfo, BookMarkState } from "./bookmark";
import { act, renderHook } from "@testing-library/react";

const book: BookInfo = {
	isbn: "9788997390915",
	title: "(Do it!) 점프 투 파이썬",
	author: "박응용 지음",
	publisher: "이지스퍼블리싱",
	publicationYear: "2021",
	imageUrl:
		"https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F1481287%3Ftimestamp%3D20220531214654",
	toc: "Table of Contents",
	description: "Sample Description",
	libBooks: [{ libCode: "111004", classNum: "111003" }],
};

describe("useBookMarkStore", () => {
	let store: {current:BookMarkState};

	beforeEach(() => {
		// 테스트마다 새로운 스토어 생성
		const { result } = renderHook(() => useBookMarkStore());
		store = result;
	});

	it("should add a bookmark", () => {
		act(() => store.current.toggleBookMark(book));
		expect(store.current.bookMarkList).toContainEqual(book);
	});

	it("should remove a bookmark", () => {
		act(() => store.current.toggleBookMark(book));
		act(() => store.current.toggleBookMark(book));
		expect(store.current.bookMarkList).not.toContain(book);
	});

	it("should check if a book is bookmarked", () => {
		act(() => store.current.toggleBookMark(book));
		expect(store.current.checkBookMarked(book.isbn)).toBe(true);
		act(() => store.current.toggleBookMark(book));
		expect(store.current.checkBookMarked(book.isbn)).toBe(false);
	});

	it("should not add the same book twice", () => {
		act(() => store.current.toggleBookMark(book));
		act(() => store.current.toggleBookMark(book));
		act(() => store.current.toggleBookMark(book));
		expect(store.current.bookMarkList.length).toBe(1);
	});
});
