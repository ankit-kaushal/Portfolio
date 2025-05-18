import React, { useEffect } from "react";
import styles from "./styles.module.css";

const Toast = ({ message, type, onClose }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 3000);

		return () => clearTimeout(timer);
	}, [onClose]);

	return <div className={`${styles.toast} ${styles[type]}`}>{message}</div>;
};

export default Toast;
