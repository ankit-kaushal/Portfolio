"use client";

import { Flex, Text, Button } from "uiplex";

export default function AdminSectionHeader({
	title,
	description,
	actionLabel,
	onAction,
	actionIcon,
}) {
	return (
		<Flex
			align="center"
			justify="between"
			gap="1rem"
			marginBottom="1.5rem"
			wrap="wrap"
		>
			<Flex direction="column" gap="0.25rem">
				<Text size="xl" weight="bold">
					{title}
				</Text>
				{description && (
					<Text size="sm" variant="muted">
						{description}
					</Text>
				)}
			</Flex>
			{actionLabel && onAction && (
				<Button
					variant="primary"
					colorScheme="green"
					onClick={onAction}
					leftIcon={actionIcon}
				>
					{actionLabel}
				</Button>
			)}
		</Flex>
	);
}
