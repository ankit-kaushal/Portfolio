import React, { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";

const TOTAL_INPUT = 6;

const OTPInput = ({ onComplete }) => {
	const [inputBox, setInputBox] = useState(Array(TOTAL_INPUT).fill(""));
	const refArr = useRef([]);

	const handleInput = (item, index) => {
		if (isNaN(item)) return;

		const newInputArr = [...inputBox];
		newInputArr[index] = item.trim().slice(-1);
		setInputBox(newInputArr);

		if (item.trim()) {
			if (index < TOTAL_INPUT - 1) {
				refArr.current[index + 1]?.focus();
			} else {
				onComplete(newInputArr.join(""));
			}
		}
	};

	useEffect(() => {
		refArr.current[0]?.focus();
	}, []);

	const handleKeyDown = (event, index) => {
		if (!event.target.value && event.key === "Backspace") {
			refArr.current[index - 1]?.focus();
		}
	};

	return (
		<div className={styles.otpContainer}>
			{inputBox.map((item, i) => (
				<input
					key={i}
					ref={(r) => (refArr.current[i] = r)}
					className={styles.otpInput}
					type="text"
					value={inputBox[i]}
					onChange={(e) => handleInput(e.target.value, i)}
					onKeyDown={(e) => handleKeyDown(e, i)}
					maxLength={1}
					autoComplete="off"
				/>
			))}
		</div>
	);
};

export default OTPInput;
