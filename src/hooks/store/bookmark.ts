import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LibBook = {
	libCode: string;
	bookCode: string;
};

export type BookInfo = {
	isbn: string;
	title: string;
	author: string;
	publisher: string;
	publicationYear: string;
	imageUrl: string;
	toc: string;
	desc?: string;
	libBooks: LibBook[];
};

export interface BookMarkState {
	bookMarkList: BookInfo[];
	toggleBookMark: (book: BookInfo) => void;
	checkBookMarked: (isbn: string) => boolean;
}

export const useBookMarkStore = create<BookMarkState>()(
	persist(
		(set, get) => ({
			bookMarkList: [],
			toggleBookMark: (book: BookInfo) => {
				set((state) => {
					if (state.bookMarkList.length === 0) {
						return {
							bookMarkList: [book],
						};
					}
					return {
						bookMarkList: state.checkBookMarked(book.isbn)
							? _deleteBookMark(state.bookMarkList, book)
							: _addBookMark(state.bookMarkList, book),
					};
				});
			},

			_deleteBook: (book: BookInfo) => {
				set((state) => ({
					bookMarkList: state.bookMarkList.filter((b) => b.isbn !== book.isbn),
				}));
			},

			checkBookMarked: (isbn: string) => {
				const bookMarkList = get().bookMarkList;
				if (bookMarkList.length === 0) {
					return false;
				}
				const isExist = bookMarkList.find((b) => b.isbn === isbn);
				return isExist ? true : false;
			},
		}),
		{
			name: "bookmark",
		}
	)
);
const _deleteBookMark = (bookMarkList: BookInfo[], book: BookInfo) =>
	bookMarkList.filter((b) => b.isbn !== book.isbn);
const _addBookMark = (bookMarkList: BookInfo[], book: BookInfo) => [book, ...bookMarkList];

export default useBookMarkStore;
