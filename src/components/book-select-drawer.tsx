import { Button } from "@chakra-ui/react";
import {
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogHeader,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export const BookSelectDrawer = ({
	children,
	buttonName,
	titleName,
}: {
	children: React.ReactNode;
	buttonName: string;
	titleName: string;
}) => {
	return (
		<DialogRoot key={"bottom"} placement={"bottom"} motionPreset="slide-in-bottom" size={"sm"}>
			<DialogTrigger asChild>
				<Button variant="subtle" size={"xs"} px={3} >
					{buttonName}
				</Button>
			</DialogTrigger>
			<DialogContent mb={0}>
				<DialogHeader
					position={"relative"}
					display={"flex"}
					justifyContent={"center"}
					alignItems={"center"}
				>
					<DialogTitle>{titleName}</DialogTitle>
					<DialogCloseTrigger />
				</DialogHeader>
				<DialogBody>{children}</DialogBody>
			</DialogContent>
		</DialogRoot>
	);
};
