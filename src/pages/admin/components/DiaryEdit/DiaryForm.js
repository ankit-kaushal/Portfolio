import React, { useState } from "react";
import styles from "./styles.module.css";

const moodOptions = [
	{ label: "Happy", emoji: "😊" },
	{ label: "Sad", emoji: "😢" },
	{ label: "Excited", emoji: "🤩" },
	{ label: "Tired", emoji: "😴" },
	{ label: "Neutral", emoji: "😐" },
	{ label: "Exhausted", emoji: "😴" },
	{ label: "Stressed", emoji: "😰" },
	{ label: "Relaxed", emoji: "😌" },
	{ label: "Anxious", emoji: "😰" },
	{ label: "Frustrated", emoji: "😫" },
	{ label: "Bored", emoji: "😐" },
	{ label: "Energetic", emoji: "⚡" },
	{ label: "Worried", emoji: "😰" },
	{ label: "Angry", emoji: "😡" },
	{ label: "Other", emoji: "🤔" },
];

const DiaryForm = ({ onSubmit, initialValues = null, existingTags = [] }) => {
	const [content, setContent] = useState(initialValues?.content || "");
	const [mood, setMood] = useState(initialValues?.mood || "Neutral");
	const [tags, setTags] = useState(initialValues?.tags || []);
	const [tagInput, setTagInput] = useState("");
	const [filteredTags, setFilteredTags] = useState([]);
	const [date, setDate] = useState(
		initialValues?.date || new Date().toISOString().split("T")[0],
	);

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit({ content, mood, tags, date });
		if (!initialValues) {
			setContent("");
			setMood("Neutral");
			setTags([]);
			setTagInput("");
			setDate(new Date().toISOString().split("T")[0]);
		}
	};

	const handleTagInput = (e) => {
		const input = e.target.value;
		setTagInput(input);

		if (input.trim()) {
			const filtered = existingTags.filter(
				(tag) =>
					tag.toLowerCase().includes(input.toLowerCase()) &&
					!tags.includes(tag),
			);
			setFilteredTags(filtered);
		} else {
			setFilteredTags([]);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && tagInput.trim()) {
			e.preventDefault();
			if (!tags.includes(tagInput.trim())) {
				setTags([...tags, tagInput.trim()]);
			}
			setTagInput("");
			setFilteredTags([]);
		}
	};

	const handleTagSelect = (tag) => {
		if (!tags.includes(tag)) {
			setTags([...tags, tag]);
		}
		setTagInput("");
		setFilteredTags([]);
	};

	const handleDeleteTag = (tagToDelete) => {
		setTags(tags.filter((tag) => tag !== tagToDelete));
	};

	return (
		<form onSubmit={handleSubmit} className={styles.diaryForm}>
			<div className={styles.formHeader}>
				<div className={styles.dateField}>
					<label htmlFor="date" className={styles.label}>
						Date
					</label>
					<input
						type="date"
						id="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						className={styles.dateInput}
					/>
				</div>
				<div className={styles.moodSelectContainer}>
					<label htmlFor="mood" className={styles.label}>
						Mood
					</label>
					<select
						id="mood"
						value={mood}
						onChange={(e) => setMood(e.target.value)}
						className={styles.moodSelect}
					>
						{moodOptions.map((option) => (
							<option key={option.label} value={option.label}>
								{option.emoji} {option.label}
							</option>
						))}
					</select>
				</div>
			</div>

			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="Write your diary entry..."
				className={styles.contentField}
				rows={6}
			/>

			<div className={styles.tagsSection}>
				<label className={styles.label}>Tags</label>
				<div className={styles.tagsList}>
					{tags.map((tag) => (
						<span key={tag} className={styles.tag}>
							{tag}
							<button
								type="button"
								onClick={() => handleDeleteTag(tag)}
								className={styles.deleteTag}
							>
								×
							</button>
						</span>
					))}
				</div>
				<div className={styles.tagInputContainer}>
					<input
						type="text"
						value={tagInput}
						onChange={handleTagInput}
						onKeyPress={handleKeyPress}
						placeholder="Type to add or search tags..."
						className={styles.tagInput}
					/>
					{filteredTags.length > 0 && (
						<div className={styles.tagSuggestions}>
							{filteredTags.map((tag) => (
								<button
									key={tag}
									type="button"
									onClick={() => handleTagSelect(tag)}
									className={styles.tagSuggestion}
								>
									{tag}
								</button>
							))}
						</div>
					)}
				</div>
			</div>
			<button type="submit" className={styles.submitButton}>
				{initialValues ? "Update Entry" : "Add Entry"}
			</button>
		</form>
	);
};

export default DiaryForm;
