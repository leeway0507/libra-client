import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BookInfo = {
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
	bookMarkList: BookInfo[];
	toggleBookMark: (book: BookInfo) => void;
	checkBookMarked: (book: BookInfo) => boolean;
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
						bookMarkList: state.checkBookMarked(book)
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

			checkBookMarked: (book: BookInfo) => {
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
const _deleteBookMark = (bookMarkList: BookInfo[], book: BookInfo) =>
	bookMarkList.filter((b) => b.isbn !== book.isbn);
const _addBookMark = (bookMarkList: BookInfo[], book: BookInfo) => [book, ...bookMarkList];

// {
// 	b.libInfo = b.libInfo.filter(l=>l.libCode ===libCode )
// }

export default useBookMarkStore;
