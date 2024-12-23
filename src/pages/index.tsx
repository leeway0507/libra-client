import { css } from "@emotion/react";

const style = css`
	color: hotpink;
`;

const SomeComponent = ({ children }: { children: React.ReactNode }) => (
	<div css={style}>
		Some hotpink text.
		{children}
	</div>
);

const anotherStyle = css({
	textDecoration: "underline",
});

const AnotherComponent = () => <div css={anotherStyle}>Some text with an underline.</div>;

export default function Page() {
	return (
		<SomeComponent>
			<AnotherComponent />
		</SomeComponent>
	);
}
