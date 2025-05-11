import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles.module.css";

const Modal = ({ isOpen, onClose, title, children, actions }) => {
	if (!isOpen) return null;

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modal}>
				<div className={styles.modalHeader}>
					<h3>{title}</h3>
					<button className={styles.closeButton} onClick={onClose}>
						<FontAwesomeIcon icon={faTimes} />
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
