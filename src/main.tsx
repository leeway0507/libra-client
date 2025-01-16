import { Global, css } from "@emotion/react";
import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from "react-router";
import routes from "~react-pages";
import { ChakraProvider, Flex, Container, Box } from "@chakra-ui/react";
import { Toaster } from "@/components/ui/toaster";

import { createSystem, defaultConfig } from "@chakra-ui/react";
import "@fontsource/noto-sans/index.css";


const NotFound = lazy(() => import("./pages/404"));
const ErrorPage = lazy(() => import("./pages/error"));

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
				emptyBackground: { value: "#d4d4d8" },
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
			background="emptyBackground"
			px={0}
		>
			<Box
				display={{ smDown: "none" }}
				position={"fixed"}
				w={"100%"}
				top={0}
				maxW={"sm"}
				h={10}
				zIndex={10}
				background="emptyBackground"
			>
				<Box h={3} />
				<Box bgColor={"background"} h={7} roundedTop={"4xl"} />
			</Box>
			<Container maxW="sm" px={0} mt={{ sm: 10 }} bgColor={"Background"}>
				<Flex position={"relative"} direction={"column"}>
					{children}
					<Flex height="75px" />
				</Flex>
			</Container>
			<Box
				display={{ smDown: "none" }}
				position={"fixed"}
				w={"100%"}
				bottom={0}
				maxW={"sm"}
				h={10}
				zIndex={10}
				background="emptyBackground"
			>
				<Box bgColor={"gray.50"} h={7} roundedBottom={"4xl"} />
				<Box h={3} />
			</Box>
			<Toaster />
		</Container>
	);
}

const RouterLayout = () => (
	<>
		<ScrollRestoration />
		<Outlet />
	</>
);

const router = createBrowserRouter([
	{
		element: <RouterLayout />,
		errorElement: <ErrorPage />,
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
