import { Global, css } from "@emotion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from "react-router";
import routes from "~react-pages";
import { ChakraProvider, Flex, Container } from "@chakra-ui/react";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "./pages/404";
import { createSystem, defaultConfig } from "@chakra-ui/react";
import "@fontsource/noto-sans/index.css";

const system = createSystem(defaultConfig, {
	theme: {
		tokens: {
			fonts: {
				heading: { value: `'Noto Sans', sans-serif` },
				body: { value: `'Noto Sans', sans-serif` },
			},
			colors: {
				GrayText: { value: "#6b7280" },
				black: { value: "#1F2937" },
			},
			fontSizes: {
				sm: { value: "14px" },
			},
		},
	},
});

function GlobalStyles() {
	return (
		<Global
			styles={css`
				html,
				body,
				#root {
					height: 100%;
					margin: 0;
				}
			`}
		/>
	);
}

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<Container
			width="100%"
			minHeight="100%"
			display="flex"
			justifyContent="center"
			background="gray.200"
			px={0}
		>
			<Container maxW="md" p={0}>
				<Flex
					maxW={"md"}
					position={"relative"}
					minHeight={"100dvh"}
					direction={"column"}
					bgColor={"background"}
				>
					{children}
					<Flex height="75px" />
				</Flex>
			</Container>
			<Toaster />
		</Container>
	);
}

const AppLayout = () => (
	<>
		<ScrollRestoration />
		<Outlet />
	</>
);

const router = createBrowserRouter([
	{
		element: <AppLayout />,
		children: [
			...routes,
			{
				path: "*",
				element: <NotFound />,
			},
		],
	},
]);

const app = createRoot(document.getElementById("root")!);

app.render(
	<StrictMode>
		<ChakraProvider value={system}>
			<GlobalStyles />
			<Layout>
				<RouterProvider router={router} />
			</Layout>
		</ChakraProvider>
	</StrictMode>
);
