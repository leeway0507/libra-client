import { renderHook } from "@testing-library/react";
import { useCheckClamp } from "./use-check-clamp";
import { describe, it, expect } from "vitest";

describe("useCheckClamp", () => {
	it("should return false when content is not clamped", () => {
		const { result } = renderHook(() => useCheckClamp());
		const div = document.createElement("div");
		div.style.height = "100px";
		div.style.overflow = "hidden";
		div.innerHTML = "<p>Short content</p>";
		Object.defineProperty(div, "scrollHeight", { value: 50 });
		Object.defineProperty(div, "clientHeight", { value: 100 });

		result.current.contentRef.current = div;
		result.current.contentRef.current.dispatchEvent(new Event("resize"));

		expect(result.current.isClamped).toBe(false);
	});

	it("should return true when content is clamped", () => {
		const { result } = renderHook(() => useCheckClamp());
		const div = document.createElement("div");
		div.style.height = "100px";
		div.style.overflow = "hidden";
		div.innerHTML = "<p>Long content</p>";
		Object.defineProperty(div, "scrollHeight", { value: 150 });
		Object.defineProperty(div, "clientHeight", { value: 100 });

		result.current.contentRef.current = div;
		result.current.contentRef.current.dispatchEvent(new Event("resize"));

		expect(result.current.isClamped).toBe(true);
	});

	it("should update isClamped when content changes", () => {
		const { result, rerender } = renderHook(() => useCheckClamp());
		const div = document.createElement("div");
		div.style.height = "100px";
		div.style.overflow = "hidden";
		div.innerHTML = "<p>Initial content</p>";
		Object.defineProperty(div, "scrollHeight", { value: 50 });
		Object.defineProperty(div, "clientHeight", { value: 100 });

		result.current.contentRef.current = div;
		result.current.contentRef.current.dispatchEvent(new Event("resize"));

		expect(result.current.isClamped).toBe(false);

		div.innerHTML = "<p>Updated content with more text</p>";
		Object.defineProperty(div, "scrollHeight", { value: 150 });

		rerender();
		result.current.contentRef.current.dispatchEvent(new Event("resize"));

		expect(result.current.isClamped).toBe(true);
	});
});
