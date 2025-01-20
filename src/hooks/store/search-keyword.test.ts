import { describe, it, expect, beforeEach } from "vitest";
import { useSearchKeywordStore, Keyword } from "./search-keyword";

describe("useSearchKeywordStore", () => {
	beforeEach(() => {
		useSearchKeywordStore.setState({ RecentKeywords: [] });
	});

	it("should add a keyword", () => {
		const keyword = "test";
		useSearchKeywordStore.getState().addKeyword(keyword);
		const recentKeywords = useSearchKeywordStore.getState().RecentKeywords;
		expect(recentKeywords.length).toBe(1);
		expect(recentKeywords[0].keyword).toBe(keyword);
	});

	it("should remove a keyword", () => {
		const keyword: Keyword = { id: "1", keyword: "test" };
		useSearchKeywordStore.setState({ RecentKeywords: [keyword] });
		useSearchKeywordStore.getState().removeKeyword(keyword);
		const recentKeywords = useSearchKeywordStore.getState().RecentKeywords;
		expect(recentKeywords.length).toBe(0);
	});
});
