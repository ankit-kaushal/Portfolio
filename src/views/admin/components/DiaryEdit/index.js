"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import FaIcon from "@/components/common/FaIcon";
import {
	faChevronLeft,
	faChevronRight,
	faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
	Button,
	IconButton,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	Badge,
	Text,
	Flex,
	Toast,
} from "uiplex";
import { apiUrl, getAuthHeaders, getDiaryAuthHeaders } from "@/lib/api";
import AdminSectionHeader from "../shared/AdminSectionHeader";
import ConfirmModal from "../shared/ConfirmModal";
import DiaryForm from "./DiaryForm";
import styles from "../../admin.module.css";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DiaryEdit = () => {
	const [entries, setEntries] = useState([]);
	const [selectedEntry, setSelectedEntry] = useState(null);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showViewModal, setShowViewModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [currentDate, setCurrentDate] = useState(new Date());

	useEffect(() => {
		fetchEntries();
	}, []);

	const fetchEntries = async () => {
		try {
			const response = await axios.get(apiUrl("/diary"), {
				headers: getDiaryAuthHeaders(),
			});
			setEntries(response.data);
		} catch (error) {
			console.error("Error fetching entries:", error);
			Toast.error("Failed to load diary entries");
		}
	};

	const handleSubmit = async (formData) => {
		try {
			await axios.post(
				apiUrl("/diary"),
				{
					content: formData.content,
					mood: formData.mood,
					tags: formData.tags,
					date: formData.date,
				},
				{ headers: getAuthHeaders() },
			);
			Toast.success("Diary entry saved!");
			fetchEntries();
			setShowAddModal(false);
		} catch (error) {
			console.error("Error creating entry:", error);
			Toast.error("Failed to save diary entry");
		}
	};

	const handleDelete = async () => {
		try {
			await axios.delete(apiUrl(`/diary/${selectedEntry._id}`), {
				headers: getAuthHeaders(),
			});
			Toast.success("Entry deleted");
			fetchEntries();
			setShowDeleteModal(false);
			setShowViewModal(false);
			setSelectedEntry(null);
		} catch (error) {
			console.error("Error deleting entry:", error);
			Toast.error("Failed to delete entry");
		}
	};

	const getDaysInMonth = (year, month) => {
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const firstDay = new Date(year, month, 1).getDay();
		const prevMonthDays = new Date(year, month, 0).getDate();
		return { daysInMonth, firstDay, prevMonthDays };
	};

	const formatMonthYear = (date) =>
		date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

	const getEntriesForDate = (date) =>
		entries.filter((entry) => {
			const entryDate = new Date(entry.date);
			return (
				entryDate.getDate() === date &&
				entryDate.getMonth() === currentDate.getMonth() &&
				entryDate.getFullYear() === currentDate.getFullYear()
			);
		});

	const getExistingTags = () => {
		const allTags = entries.reduce(
			(tags, entry) => tags.concat(entry.tags || []),
			[],
		);
		return [...new Set(allTags)];
	};

	const { daysInMonth, firstDay, prevMonthDays } = getDaysInMonth(
		currentDate.getFullYear(),
		currentDate.getMonth(),
	);

	return (
		<>
			<AdminSectionHeader
				title="Diary Calendar"
				description={`${entries.length} entr${entries.length === 1 ? "y" : "ies"} total`}
				actionLabel="Add Entry"
				onAction={() => setShowAddModal(true)}
				actionIcon={<FaIcon icon={faPlus} />}
			/>

			<div className={styles.calendarHeader}>
				<div className={styles.monthNav}>
					<IconButton
						icon={<FaIcon icon={faChevronLeft} />}
						variant="ghost"
						aria-label="Previous month"
						onClick={() =>
							setCurrentDate(
								new Date(
									currentDate.getFullYear(),
									currentDate.getMonth() - 1,
								),
							)
						}
					/>
					<Text size="lg" weight="semibold">
						{formatMonthYear(currentDate)}
					</Text>
					<IconButton
						icon={<FaIcon icon={faChevronRight} />}
						variant="ghost"
						aria-label="Next month"
						onClick={() =>
							setCurrentDate(
								new Date(
									currentDate.getFullYear(),
									currentDate.getMonth() + 1,
								),
							)
						}
					/>
				</div>
			</div>

			<div className={styles.calendar}>
				<div className={styles.weekdays}>
					{WEEKDAYS.map((day) => (
						<div key={day} className={styles.weekday}>
							{day}
						</div>
					))}
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
					{[...Array(42 - (firstDay + daysInMonth))].map((_, index) => (
						<div
							key={`next-${index}`}
							className={`${styles.day} ${styles.nextMonth}`}
						>
							<span className={styles.dateNumber}>{index + 1}</span>
						</div>
					))}
				</div>
			</div>

			<Modal
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				size="lg"
			>
				<ModalHeader>
					Add New Entry
					<ModalCloseButton onClose={() => setShowAddModal(false)} />
				</ModalHeader>
				<ModalBody>
					<DiaryForm
						onSubmit={handleSubmit}
						existingTags={getExistingTags()}
					/>
				</ModalBody>
			</Modal>

			<Modal
				isOpen={showViewModal}
				onClose={() => setShowViewModal(false)}
				size="md"
			>
				<ModalHeader>
					{selectedEntry &&
						new Date(selectedEntry.date).toLocaleDateString("en-US", {
							month: "long",
							day: "numeric",
							year: "numeric",
						})}
					<ModalCloseButton onClose={() => setShowViewModal(false)} />
				</ModalHeader>
				<ModalBody>
					{selectedEntry && (
						<>
							<Text style={{ marginBottom: "1rem" }}>{selectedEntry.content}</Text>
							<Flex gap="0.5rem" wrap="wrap" style={{ marginBottom: "1rem" }}>
								<Badge variant="primary">{selectedEntry.mood}</Badge>
								{selectedEntry.tags?.map((tag) => (
									<Badge key={tag} variant="default">
										{tag}
									</Badge>
								))}
							</Flex>
							{selectedEntry.images?.length > 0 && (
								<Flex direction="column" gap="0.75rem">
									{selectedEntry.images.map((image, index) => (
										<img
											key={index}
											src={image}
											alt={`Entry ${index + 1}`}
											style={{
												width: "100%",
												borderRadius: "10px",
											}}
										/>
									))}
								</Flex>
							)}
						</>
					)}
				</ModalBody>
				<ModalFooter>
					<Button
						variant="outline"
						colorScheme="red"
						onClick={() => setShowDeleteModal(true)}
					>
						Delete
					</Button>
					<Button
						variant="primary"
						colorScheme="green"
						onClick={() => setShowViewModal(false)}
					>
						Close
					</Button>
				</ModalFooter>
			</Modal>

			<ConfirmModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleDelete}
				title="Delete Entry"
				message="Are you sure you want to delete this diary entry?"
				confirmLabel="Delete"
			/>
		</>
	);
};

export default DiaryEdit;
