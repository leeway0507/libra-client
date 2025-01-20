import { useEffect, useRef, useState } from "react";

export const useCheckClamp = () => {
	const contentRef = useRef<HTMLDivElement | null>(null);
	const [isClamped, setIsClamped] = useState(false);

	useEffect(() => {
		if (contentRef.current) {
			const { scrollHeight, clientHeight } = contentRef.current;
			setIsClamped(scrollHeight > clientHeight);
		}
	}, [contentRef.current]);
	return { contentRef, isClamped };
};
