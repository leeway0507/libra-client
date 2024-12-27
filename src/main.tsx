import { Global, css } from "@emotion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useRoutes } from "react-router";
import routes from "~react-pages";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Container } from "@chakra-ui/react";
import {  Toaster } from "@/components/ui/toaster"

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
			background="gray.400"
			px={0}
		>
			<Container maxW="md" background="white" flexGrow={1} p={0}>
				{children}
			</Container>
			<Toaster />
		</Container>
	);
}

function App() {
	return (
		<>
			<GlobalStyles />
			<Layout>{useRoutes(routes)}</Layout>
		</>
	);
}

const app = createRoot(document.getElementById("root")!);

app.render(
	<StrictMode>
		<BrowserRouter>
			<ChakraProvider value={defaultSystem}>
				<App />
			</ChakraProvider>
		</BrowserRouter>
	</StrictMode>
);
