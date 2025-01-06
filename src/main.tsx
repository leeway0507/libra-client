import { Global, css } from "@emotion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useRoutes, RouteObject } from "react-router";
import routes from "~react-pages";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { Container } from "@chakra-ui/react";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "./pages/404";
import { createSystem,defaultConfig } from "@chakra-ui/react";
import "@fontsource/noto-sans/index.css"

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Roboto', sans-serif` },
        body: { value: `'Roboto', sans-serif` },
      },
    },
  },
})


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
					<Flex height="50px" />
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
		<ChakraProvider value={system}>
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
