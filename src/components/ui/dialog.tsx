import { Dialog as ChakraDialog, Portal } from "@chakra-ui/react";
import { CloseButton } from "./close-button";
import * as React from "react";

interface DialogContentProps extends ChakraDialog.ContentProps {
	portalled?: boolean;
	portalRef?: React.RefObject<HTMLElement>;
	backdrop?: boolean;
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
	function DialogContent(props, ref) {
		const { children, portalled = true, portalRef, backdrop = true, ...rest } = props;

		return (
			<Portal disabled={!portalled} container={portalRef}>
				{backdrop && <ChakraDialog.Backdrop />}
				<ChakraDialog.Positioner>
					<ChakraDialog.Content ref={ref} {...(rest as any)} asChild={false}>
						{children}
					</ChakraDialog.Content>
				</ChakraDialog.Positioner>
			</Portal>
		);
	}
);

export const DialogCloseTrigger = React.forwardRef<
	HTMLButtonElement,
	ChakraDialog.CloseTriggerProps
>(function DialogCloseTrigger(props, ref) {
	return (
		<ChakraDialog.CloseTrigger position="absolute" right={4} {...(props as any)} asChild>
			<CloseButton size="md" ref={ref}>
				{props.children}
			</CloseButton>
		</ChakraDialog.CloseTrigger>
	);
});

export const DialogRoot = ChakraDialog.Root;
export const DialogFooter = ChakraDialog.Footer;
export const DialogHeader = ChakraDialog.Header;
export const DialogBody = ChakraDialog.Body;
export const DialogBackdrop = ChakraDialog.Backdrop;
export const DialogTitle = ChakraDialog.Title;
export const DialogDescription = ChakraDialog.Description;
export const DialogTrigger = ChakraDialog.Trigger;
export const DialogActionTrigger = ChakraDialog.ActionTrigger;