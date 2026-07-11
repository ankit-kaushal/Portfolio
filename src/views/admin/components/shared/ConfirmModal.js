"use client";

import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	Button,
	Text,
} from "uiplex";

export default function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title = "Confirm",
	message = "Are you sure?",
	confirmLabel = "Confirm",
	confirmVariant = "primary",
	confirmColorScheme = "red",
	isLoading = false,
}) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} size="sm">
			<ModalHeader>
				{title}
				<ModalCloseButton onClose={onClose} />
			</ModalHeader>
			<ModalBody>
				<Text>{message}</Text>
			</ModalBody>
			<ModalFooter>
				<Button variant="outline" onClick={onClose} disabled={isLoading}>
					Cancel
				</Button>
				<Button
					variant={confirmVariant}
					colorScheme={confirmColorScheme}
					onClick={onConfirm}
					loading={isLoading}
				>
					{confirmLabel}
				</Button>
			</ModalFooter>
		</Modal>
	);
}
