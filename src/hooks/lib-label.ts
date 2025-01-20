type Props = {
	isBestSeller?: boolean | undefined;
	libName: string;
};

const getLibLabel = (libs: Props[]) => {
	const activedLibs = libs.filter((lib) => lib.isBestSeller);
	if (activedLibs.length === 1) {
		return activedLibs[0].libName;
	}

	if (activedLibs.length === 0) {
		return "도서관을 선택하세요";
	}

	const allInclude = activedLibs.length === libs.length;
	if (allInclude) {
		return "도서관 전체";
	}
	return (
		libs[0].libName +
		(activedLibs.length - 1 > 0 ? ` 외 ${activedLibs.length - 1}개 도서관` : "")
	);
};

export { getLibLabel };
