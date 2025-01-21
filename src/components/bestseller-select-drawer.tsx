import { Box, Flex, Text } from "@chakra-ui/react";
import {
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogHeader,
	DialogRoot,
	DialogTrigger,
} from "@/components/ui/dialog";
import useLibStore, { LibInfo } from "@/hooks/store/lib";
import { Switch } from "@/components/ui/switch";

export const BestSellerSelectDrawer = ({ buttonComp }: { buttonComp: React.ReactNode }) => {
	const { chosenLibs, updateLib } = useLibStore();

	const isOnlyOneActive = chosenLibs.filter((l) => l.isBestSeller).length === 1;

	const handleSwtich = (lib: LibInfo) =>
		updateLib(lib.libCode, { isBestSeller: !lib.isBestSeller });

	return (
		<DialogRoot key="bottom" placement="bottom" motionPreset="slide-in-bottom" size="sm">
			<DialogTrigger asChild>{buttonComp}</DialogTrigger>
			<DialogContent mb={0} roundedTop="3xl">
				<DialogHeader
					position="relative"
					display="flex"
					justifyContent="center"
					alignItems="center"
				>
					<DialogCloseTrigger />
				</DialogHeader>
				<DialogBody>
					<Box height="64">
						{chosenLibs.length === 1 ? (
							<OptionItem
								key={chosenLibs[0].libCode}
								label={chosenLibs[0].libName}
								distance={chosenLibs[0].distance}
								checked={chosenLibs[0].isBestSeller!}
							/>
						) : (
							chosenLibs.map((v) => (
								<OptionItem
									key={v.libCode}
									label={v.libName}
									distance={v.distance}
									checked={v.isBestSeller!}
									handleCheck={
										isOnlyOneActive && v.isBestSeller
											? undefined
											: () => handleSwtich(v)
									}
								/>
							))
						)}
						{isOnlyOneActive && (
							<Text
								my={10}
								textAlign="center"
								color="GrayText"
								textDecoration="underline"
							>
								하나 이상의 도서관을 선택하세요.
							</Text>
						)}
					</Box>
				</DialogBody>
			</DialogContent>
		</DialogRoot>
	);
};

function OptionItem({
	label,
	distance,
	checked,
	handleCheck,
}: {
	label: string;
	distance: number;
	checked: boolean;
	handleCheck?: () => void;
}) {
	return (
		<Flex
			justifyContent="space-between"
			alignItems="center"
			_hover={{ bg: "gray.200" }}
			height="10"
			fontSize="sm"
		>
			<Flex spaceX={2}>
				<Text>{label}</Text>
				{distance !== 0 && <Text color="GrayText">{distance}km</Text>}
			</Flex>
			<Switch
				fontSize="sm"
				checked={checked}
				onCheckedChange={handleCheck}
				disabled={!handleCheck}
			/>
		</Flex>
	);
}
