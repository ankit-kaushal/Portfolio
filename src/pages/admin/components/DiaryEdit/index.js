import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronLeft,
	faChevronRight,
	faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../../../../components/common/Modal";
import styles from "./styles.module.css";
import DiaryForm from "./DiaryForm";

const DiaryEdit = () => {
	const [entries, setEntries] = useState([]);
	const [selectedEntry, setSelectedEntry] = useState(null);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showViewModal, setShowViewModal] = useState(false);
	const [currentDate, setCurrentDate] = useState(new Date());
	const [newEntry, setNewEntry] = useState({
		content: "",
		mood: "",
		tags: "",
		images: [],
	});

	useEffect(() => {
		fetchEntries();
	}, []);

	const fetchEntries = async () => {
		try {
			const response = await axios.get(
				"https://api.ankitkaushal.in/diary",
				{
					headers: {
						Authorization: process.env.REACT_APP_DIARY_KEY,
					},
				},
			);
			setEntries(response.data);
		} catch (error) {
			console.error("Error fetching entries:", error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post(
				"https://api.ankitkaushal.in/diary",
				{
					...newEntry,
					tags: newEntry.tags.split(",").map((tag) => tag.trim()),
					date: new Date().toISOString(),
				},
				{
					headers: {
						Authorization: process.env.REACT_APP_AUTHKEY,
					},
				},
			);
			fetchEntries();
			setNewEntry({ content: "", mood: "", tags: "", images: [] });
			setShowAddModal(false);
		} catch (error) {
			console.error("Error creating entry:", error);
		}
	};

	const handleDelete = async (entryId) => {
		try {
			await axios.delete(`https://api.ankitkaushal.in/diary/${entryId}`, {
				headers: {
					Authorization: process.env.REACT_APP_AUTHKEY,
				},
			});
			fetchEntries();
			setShowViewModal(false);
		} catch (error) {
			console.error("Error deleting entry:", error);
		}
	};

	const handlePrevMonth = () => {
		setCurrentDate(
			new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
		);
	};

	const handleNextMonth = () => {
		setCurrentDate(
			new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
		);
	};

	const getDaysInMonth = (year, month) => {
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const firstDay = new Date(year, month, 1).getDay();
		const prevMonthDays = new Date(year, month, 0).getDate();
		return { daysInMonth, firstDay, prevMonthDays };
	};

	const formatDate = (date) => {
		const months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
	};

	const getEntriesForDate = (date) => {
		return entries.filter((entry) => {
			const entryDate = new Date(entry.date);
			return (
				entryDate.getDate() === date &&
				entryDate.getMonth() === currentDate.getMonth() &&
				entryDate.getFullYear() === currentDate.getFullYear()
			);
		});
	};

	const renderAddModal = () => (
		<Modal
			isOpen={showAddModal}
			onClose={() => setShowAddModal(false)}
			title="Add New Entry"
			actions={
				<div className={styles.modalButtons}>
					<button onClick={handleSubmit}>Save</button>
					<button onClick={() => setShowAddModal(false)}>
						Cancel
					</button>
				</div>
			}
		>
			<DiaryForm
				onSubmit={handleSubmit}
				initialValues={selectedEntry}
				existingTags={getExistingTags()}
			/>
		</Modal>
	);

	const renderViewModal = () => (
		<Modal
			isOpen={showViewModal}
			onClose={() => setShowViewModal(false)}
			title={formatDate(new Date(selectedEntry.date))}
			actions={
				<div className={styles.modalButtons}>
					<button onClick={() => handleDelete(selectedEntry._id)}>
						Delete
					</button>
					<button onClick={() => setShowViewModal(false)}>
						Close
					</button>
				</div>
			}
		>
			<div className={styles.entryContent}>
				<p>{selectedEntry.content}</p>
				<div className={styles.entryMeta}>
					<span>Mood: {selectedEntry.mood}</span>
					<span>Tags: {selectedEntry.tags.join(", ")}</span>
				</div>
				{selectedEntry.images?.length > 0 && (
					<div className={styles.entryImages}>
						{selectedEntry.images.map((image, index) => (
							<img
								key={index}
								src={image}
								alt={`Entry ${index + 1}`}
							/>
						))}
					</div>
				)}
			</div>
		</Modal>
	);

	const { daysInMonth, firstDay, prevMonthDays } = getDaysInMonth(
		currentDate.getFullYear(),
		currentDate.getMonth(),
	);

	// Add this function to extract unique tags from entries
	const getExistingTags = () => {
		const allTags = entries.reduce((tags, entry) => {
			return tags.concat(entry.tags || []);
		}, []);
		return [...new Set(allTags)];
	};

	return (
		<div className={styles.diaryContainer}>
			<div className={styles.header}>
				<div className={styles.monthNavigation}>
					<button
						onClick={handlePrevMonth}
						className={styles.navButton}
					>
						<FontAwesomeIcon icon={faChevronLeft} />
					</button>
					<h2>{formatDate(currentDate)}</h2>
					<button
						onClick={handleNextMonth}
						className={styles.navButton}
					>
						<FontAwesomeIcon icon={faChevronRight} />
					</button>
				</div>
				<button
					className={styles.addButton}
					onClick={() => setShowAddModal(true)}
				>
					<FontAwesomeIcon icon={faPlus} /> Add Entry
				</button>
			</div>

			<div className={styles.calendar}>
				<div className={styles.weekdays}>
					{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
						(day) => (
							<div key={day} className={styles.weekday}>
								{day}
							</div>
						),
					)}
				</div>
				<div className={styles.days}>
					{[...Array(firstDay)].map((_, index) => (
						<div
							key={`prev-${index}`}
							className={`${styles.day} ${styles.prevMonth}`}
						>
							<span className={styles.dateNumber}>
								{prevMonthDays - firstDay + index + 1}
							</span>
						</div>
					))}
					{[...Array(daysInMonth)].map((_, index) => {
						const day = index + 1;
						const dayEntries = getEntriesForDate(day);
						const today = new Date();
						const isToday =
							day === today.getDate() &&
							currentDate.getMonth() === today.getMonth() &&
							currentDate.getFullYear() === today.getFullYear();

						return (
							<div
								key={`current-${day}`}
								className={`${styles.day} ${styles.currentMonth} ${isToday ? styles.today : ""}`}
							>
								<span className={styles.dateNumber}>{day}</span>
								{dayEntries.map((entry) => (
									<div
										key={entry._id}
										className={styles.entryPreview}
										onClick={() => {
											setSelectedEntry(entry);
											setShowViewModal(true);
										}}
									>
										{entry.content.substring(0, 30)}...
									</div>
								))}
							</div>
						);
					})}
					{[...Array(42 - (firstDay + daysInMonth))].map(
						(_, index) => (
							<div
								key={`next-${index}`}
								className={`${styles.day} ${styles.nextMonth}`}
							>
								<span className={styles.dateNumber}>
									{index + 1}
								</span>
							</div>
						),
					)}
				</div>
			</div>

			{showAddModal && renderAddModal()}
			{showViewModal && selectedEntry && renderViewModal()}
		</div>
	);
};

export default DiaryEdit;
