"use client";

import React, { useRef, useEffect } from "react";
import FaIcon from "@/components/common/FaIcon";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles.module.css";

const Modal = ({ isOpen, onClose, title, children, actions }) => {
	const modalRef = useRef();

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modal} ref={modalRef}>
				<div className={styles.modalHeader}>
					<h3>{title}</h3>
					<button className={styles.closeButton} onClick={onClose}>
						<FaIcon icon={faTimes} />
					</button>
				</div>
				<div className={styles.modalContent}>{children}</div>
				{actions && (
					<div className={styles.modalActions}>{actions}</div>
				)}
			</div>
		</div>
	);
};

export default Modal;
