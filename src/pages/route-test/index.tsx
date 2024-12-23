import { css } from '@emotion/react'

const style = css`
  color: hotpink;
  
`

const SomeComponent = ({ children }: { children: React.ReactNode }) => (
    <div css={style}>
        Some hotpink text.
        {children}
    </div>
)


const AnotherComponent = () => (
    <div css={{ color: "red", textDecoration: "underline" }}>Route Test 2</div>
)

export default function Page() {
    return <SomeComponent>
        <AnotherComponent />
    </SomeComponent>
}
