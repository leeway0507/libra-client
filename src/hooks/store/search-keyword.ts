import { create } from "zustand";
import { persist } from "zustand/middleware";

import { v4 as uuidv4 } from "uuid";

export type Keyword = {
	id: string;
	keyword: string;
};

export interface RecentSearchKeywordState {
	RecentKeywords: Keyword[];
	addKeyword: (keyword: string) => void;
	removeKeyword: (keyword: Keyword) => void;
}

export const useSearchKeywordStore = create<RecentSearchKeywordState>()(
	persist(
		(set) => ({
			RecentKeywords: [],
			addKeyword: (keyword) => {
				set((state) => ({
					RecentKeywords: [{ id: uuidv4(), keyword }, ...state.RecentKeywords],
				}));
			},
			removeKeyword: (keyword) => {
				set((state) => ({
					RecentKeywords: state.RecentKeywords.filter((l) => l.id !== keyword.id),
				}));
			},
		}),
		{
			name: "keyword",
		}
	)
);
