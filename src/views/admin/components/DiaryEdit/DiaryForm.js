"use client";

import React, { useState } from "react";
import {
	Button,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Select,
	DateTimePicker,
	Badge,
	Flex,
	Grid,
} from "uiplex";
import styles from "../../admin.module.css";

const moodOptions = [
	{ value: "Happy", label: "😊 Happy" },
	{ value: "Sad", label: "😢 Sad" },
	{ value: "Excited", label: "🤩 Excited" },
	{ value: "Tired", label: "😴 Tired" },
	{ value: "Neutral", label: "😐 Neutral" },
	{ value: "Exhausted", label: "😴 Exhausted" },
	{ value: "Worried", label: "😰 Worried" },
	{ value: "Other", label: "🤔 Other" },
];

const DiaryForm = ({ onSubmit, initialValues = null, existingTags = [] }) => {
	const [content, setContent] = useState(initialValues?.content || "");
	const [mood, setMood] = useState(initialValues?.mood || "Neutral");
	const [tags, setTags] = useState(initialValues?.tags || []);
	const [tagInput, setTagInput] = useState("");
	const [filteredTags, setFilteredTags] = useState([]);
	const [date, setDate] = useState(
		initialValues?.date
			? new Date(initialValues.date).toISOString().split("T")[0]
			: new Date().toISOString().split("T")[0],
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

	const handleTagInput = (value) => {
		setTagInput(value);
		if (value.trim()) {
			const filtered = existingTags.filter(
				(tag) =>
					tag.toLowerCase().includes(value.toLowerCase()) &&
					!tags.includes(tag),
			);
			setFilteredTags(filtered);
		} else {
			setFilteredTags([]);
		}
	};

	const addTag = (tag) => {
		if (!tags.includes(tag)) {
			setTags([...tags, tag]);
		}
		setTagInput("");
		setFilteredTags([]);
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && tagInput.trim()) {
			e.preventDefault();
			addTag(tagInput.trim());
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Grid templateColumns="repeat(2, 1fr)" className={styles.formGrid} gap="1rem">
				<FormControl>
					<FormLabel>Date</FormLabel>
					<DateTimePicker mode="date" value={date} onChange={setDate} />
				</FormControl>

				<FormControl>
					<FormLabel>Mood</FormLabel>
					<Select
						value={mood}
						onChange={setMood}
						options={moodOptions}
					/>
				</FormControl>

				<FormControl style={{ gridColumn: "1 / -1" }}>
					<FormLabel>Entry</FormLabel>
					<Textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Write your diary entry..."
						rows={6}
					/>
				</FormControl>

				<FormControl style={{ gridColumn: "1 / -1" }}>
					<FormLabel>Tags</FormLabel>
					<div className={styles.tagList}>
						{tags.map((tag) => (
							<Badge key={tag} variant="primary">
								<Flex align="center" gap="0.35rem">
									{tag}
									<button
										type="button"
										onClick={() =>
											setTags(tags.filter((t) => t !== tag))
										}
										style={{
											border: "none",
											background: "transparent",
											cursor: "pointer",
											padding: 0,
										}}
									>
										×
									</button>
								</Flex>
							</Badge>
						))}
					</div>
					<Input
						value={tagInput}
						onChange={(e) => handleTagInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Type and press Enter to add tags..."
					/>
					{filteredTags.length > 0 && (
						<div className={styles.tagSuggestions}>
							{filteredTags.map((tag) => (
								<Button
									key={tag}
									type="button"
									size="sm"
									variant="outline"
									onClick={() => addTag(tag)}
								>
									{tag}
								</Button>
							))}
						</div>
					)}
				</FormControl>
			</Grid>

			<div className={styles.formActions}>
				<Button type="submit" variant="primary" colorScheme="green">
					{initialValues ? "Update Entry" : "Save Entry"}
				</Button>
			</div>
		</form>
	);
};

export default DiaryForm;
