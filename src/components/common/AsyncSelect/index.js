import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";

const AsyncSelect = ({
	value,
	onChange,
	loadOptions,
	isMulti,
	placeholder = "Select...",
	getOptionLabel = (option) => option.label,
	getOptionValue = (option) => option.value,
}) => {
	const [options, setOptions] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const wrapperRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		const loadData = async () => {
			setIsLoading(true);
			try {
				const data = await loadOptions(search);
				setOptions(data);
			} catch (error) {
				console.error("Error loading options:", error);
			}
			setIsLoading(false);
		};

		const timeoutId = setTimeout(loadData, 300);
		return () => clearTimeout(timeoutId);
	}, [search, loadOptions]);

	const handleSelect = (option) => {
		if (isMulti) {
			const newValue = value.some(
				(v) => getOptionValue(v) === getOptionValue(option),
			)
				? value.filter(
						(v) => getOptionValue(v) !== getOptionValue(option),
					)
				: [...value, option];
			onChange(newValue);
		} else {
			onChange(option);
			setIsOpen(false);
		}
	};

	const removeValue = (optionToRemove) => {
		onChange(
			value.filter(
				(v) => getOptionValue(v) !== getOptionValue(optionToRemove),
			),
		);
	};

	return (
		<div className={styles.wrapper} ref={wrapperRef}>
			<div className={styles.control} onClick={() => setIsOpen(true)}>
				<div className={styles.valueContainer}>
					{isMulti ? (
						value.length > 0 ? (
							<div className={styles.multiValue}>
								{value.map((v) => (
									<div
										key={getOptionValue(v)}
										className={styles.tag}
									>
										{getOptionLabel(v)}
										<span
											className={styles.removeTag}
											onClick={(e) => {
												e.stopPropagation();
												removeValue(v);
											}}
										>
											×
										</span>
									</div>
								))}
							</div>
						) : (
							<div className={styles.placeholder}>
								{placeholder}
							</div>
						)
					) : value ? (
						getOptionLabel(value)
					) : (
						<div className={styles.placeholder}>{placeholder}</div>
					)}
				</div>
			</div>
			{isOpen && (
				<div className={styles.menu}>
					<input
						type="text"
						className={styles.search}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search..."
						autoFocus
					/>
					{isLoading ? (
						<div className={styles.loading}>Loading...</div>
					) : (
						<div className={styles.options}>
							{options.map((option) => (
								<div
									key={getOptionValue(option)}
									className={`${styles.option} ${
										isMulti
											? value.some(
													(v) =>
														getOptionValue(v) ===
														getOptionValue(option),
												) && styles.selected
											: getOptionValue(value) ===
													getOptionValue(option) &&
												styles.selected
									}`}
									onClick={() => handleSelect(option)}
								>
									{getOptionLabel(option)}
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default AsyncSelect;
