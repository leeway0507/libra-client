import { Global, css } from "@emotion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useRoutes, RouteObject } from "react-router";
import routes from "~react-pages";
import { ChakraProvider, defaultSystem, Flex } from "@chakra-ui/react";
import { Container } from "@chakra-ui/react";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "./pages/404";

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
			height="100%"
			display="flex"
			justifyContent="center"
			overflow="scroll"
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
					</Flex>
			</Container>
			<Toaster />
		</Container>
	);
}

function App() {
	const notFoundRoute: RouteObject = {
		path: "*", // Catch-All Route
		element: <NotFound />,
	};
	routes.push(notFoundRoute);
	return (
		<ChakraProvider value={defaultSystem}>
			<GlobalStyles />

			<Layout>{useRoutes(routes)}</Layout>
		</ChakraProvider>
	);
}

const app = createRoot(document.getElementById("root")!);

app.render(
	<StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>
);
