import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BookMark = {
	isbn: string;
	title: string;
	author: string;
	publisher: string;
	publicationYear: string;
	imageUrl: string;
};
// export type BookLibInfo = {
// 	libCode: string;
// 	libName: string;
// 	classNum: string;
// };

export interface BookMarkState {
	bookMarkList: BookMark[];
	toggleBookMark: (book: BookMark) => void;
	checkBookMarked: (book: BookMark) => boolean;
}

export const useBookMarkStore = create<BookMarkState>()(
	persist(
		(set, get) => ({
			bookMarkList: [],
			toggleBookMark: (book: BookMark) => {
				set((state) => {
					if (state.bookMarkList.length === 0) {
						return {
							bookMarkList: [book],
						};
					}
					return {
						bookMarkList: state.checkBookMarked(book)
							? _deleteBookMark(state.bookMarkList, book)
							: _addBookMark(state.bookMarkList, book),
					};
				});
			},

			_deleteBook: (book: BookMark) => {
				set((state) => ({
					bookMarkList: state.bookMarkList.filter((b) => b.isbn !== book.isbn),
				}));
			},

			checkBookMarked: (book: BookMark) => {
				const bookMarkList = get().bookMarkList;
				if (bookMarkList.length === 0) {
					return false;
				}
				const isExist = bookMarkList.find((b) => b.isbn === book.isbn);
				return isExist ? true : false;
			},
		}),
		{
			name: "bookmark",
		}
	)
);
const _deleteBookMark = (bookMarkList: BookMark[], book: BookMark) =>
	bookMarkList.filter((b) => b.isbn !== book.isbn);
const _addBookMark = (bookMarkList: BookMark[], book: BookMark) => [book, ...bookMarkList];

// {
// 	b.libInfo = b.libInfo.filter(l=>l.libCode ===libCode )
// }

export default useBookMarkStore;
