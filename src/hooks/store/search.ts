import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BookInfo } from "./bookmark";

export type SearchProps = {
	keyword: string;
	bookResult: BookInfo[];
};

export interface BookResultState {
	bookResult: SearchProps;
	saveBookResult: (books: SearchProps) => void;
	removeBookResult: () => void;
}

export const useBookResultStore = create<BookResultState>()((set) => ({
	bookResult: {} as SearchProps,
	saveBookResult: (books: SearchProps) => {
		set(() => ({
			bookResult: books,
		}));
	},
	removeBookResult: () => set(() => ({ bookResult: {} as SearchProps })),
}));

export interface SearchKeywordState {
	RecentKeywords: string[];
	addKeyword: (keyword: string) => void;
	removeKeyword: (keyword: string) => void;
}

export const useSearchKeywordStore = create<SearchKeywordState>()(
	persist(
		(set) => ({
			RecentKeywords: [],
			addKeyword: (keyword: string) => {
				set((state) => ({
					RecentKeywords: [keyword, ...state.RecentKeywords],
				}));
			},
			removeKeyword: (keyword: string) => {
				set((state) => ({
					RecentKeywords: state.RecentKeywords.filter((l) => l !== keyword),
				}));
			},
		}),
		{
			name: "keyword",
		}
	)
);
