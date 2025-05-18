import React from "react";
import ReactQuill from "react-quill";
import AsyncSelect from "../../../../components/common/AsyncSelect";
import "react-quill/dist/quill.snow.css";
import styles from "./styles.module.css";
import StarRating from "../../../../components/common/StarRating";
import PhotoUpload from "../../../../components/common/PhotoUpload";

const travelModes = [
	"flight",
	"train",
	"bus",
	"car",
	"auto",
	"bike",
	"scooty",
	"metro",
	"walk",
	"other",
];

const JourneyForm = ({ formData, setFormData, onSubmit, isEditing }) => {
	const modules = {
		toolbar: [
			[{ header: [1, 2, false] }],
			["bold", "italic", "underline", "strike"],
			[{ list: "ordered" }, { list: "bullet" }],
			["link", "image"],
			["clean"],
		],
	};

	const loadFriends = async (search) => {
		try {
			const response = await fetch(
				"https://www.api.ankitkaushal.in/friends",
			);
			const data = await response.json();
			return data.filter((friend) =>
				friend.name.toLowerCase().includes(search.toLowerCase()),
			);
		} catch (error) {
			console.error("Error loading friends:", error);
			return [];
		}
	};

	const formatDate = (dateString) => {
		if (!dateString) return "";
		return new Date(dateString).toISOString().slice(0, 10);
	};

	const formatDateForSubmit = (date, isEndDate) => {
		if (!date) return "";
		const baseDate = new Date(date);
		if (isEndDate) {
			baseDate.setHours(23, 59, 59, 999);
		} else {
			baseDate.setHours(0, 1, 0, 0);
		}
		return baseDate.toISOString();
	};

	return (
		<form
			className={styles.journeyForm}
			onSubmit={(e) => {
				e.preventDefault();
				const formattedData = {
					...formData,
					duration: {
						startDate: formatDateForSubmit(
							formData.duration.startDate,
							false,
						),
						endDate: formatDateForSubmit(
							formData.duration.endDate,
							true,
						),
					},
					rating:
						Number(formData.rating) > 0
							? Number(formData.rating)
							: undefined,
				};
				onSubmit(e, formattedData);
			}}
			id="journeyForm"
		>
			<div className={styles.formGrid}>
				<div className={styles.inputGroup}>
					<label>Title</label>
					<input
						type="text"
						value={formData.title}
						onChange={(e) =>
							setFormData({ ...formData, title: e.target.value })
						}
						placeholder="Journey Title"
						required
					/>
				</div>
				<div className={styles.inputGroup}>
					<label>Place</label>
					<input
						type="text"
						value={formData.place}
						onChange={(e) =>
							setFormData({ ...formData, place: e.target.value })
						}
						placeholder="Place"
						required
					/>
				</div>
				<div className={styles.inputGroup}>
					<label>Start Date</label>
					<input
						type="date"
						value={formatDate(formData.duration.startDate)}
						onChange={(e) =>
							setFormData({
								...formData,
								duration: {
									...formData.duration,
									startDate: e.target.value,
								},
							})
						}
						required
					/>
				</div>
				<div className={styles.inputGroup}>
					<label>End Date</label>
					<input
						type="date"
						value={formatDate(formData.duration.endDate)}
						onChange={(e) =>
							setFormData({
								...formData,
								duration: {
									...formData.duration,
									endDate: e.target.value,
								},
							})
						}
						required
					/>
				</div>
				<div className={styles.inputGroup}>
					<label>Expense Amount</label>
					<input
						type="number"
						value={formData.expense.amount}
						onChange={(e) =>
							setFormData({
								...formData,
								expense: {
									...formData.expense,
									amount: e.target.value,
								},
							})
						}
						placeholder="Amount"
					/>
				</div>
				<div className={styles.inputGroup}>
					<label>Rating</label>
					<StarRating
						rating={Number(formData.rating)}
						onRatingChange={(value) =>
							setFormData({ ...formData, rating: value })
						}
					/>
				</div>
				<div className={styles.inputGroup}>
					<label>Mode of Travel</label>
					<AsyncSelect
						value={formData.modeOfTravel.map((mode) => ({
							value: mode,
							label: mode,
						}))}
						onChange={(selected) => {
							const selectedModes = selected
								? selected.map((option) => option.value)
								: [];
							setFormData({
								...formData,
								modeOfTravel: selectedModes,
							});
						}}
						loadOptions={(inputValue) => {
							return new Promise((resolve) => {
								const filtered = travelModes
									.filter((mode) =>
										mode
											.toLowerCase()
											.includes(inputValue.toLowerCase()),
									)
									.map((mode) => ({
										value: mode,
										label: mode,
									}));
								resolve(filtered);
							});
						}}
						isMulti
						placeholder="Select modes of travel..."
						defaultOptions={travelModes.map((mode) => ({
							value: mode,
							label: mode,
						}))}
					/>
				</div>
				<div className={styles.inputGroup}>
					<label>Places Visited</label>
					<input
						type="text"
						value={formData.placesVisited.join(", ")}
						onChange={(e) =>
							setFormData({
								...formData,
								placesVisited: e.target.value
									.split(",")
									.map((item) => item.trim()),
							})
						}
						placeholder="Enter places separated by commas"
					/>
				</div>
				<div className={styles.inputGroup}>
					<label>Buddies</label>
					<AsyncSelect
						value={formData.buddies}
						onChange={(selected) =>
							setFormData({
								...formData,
								buddies: selected,
							})
						}
						loadOptions={loadFriends}
						isMulti
						placeholder="Select buddies..."
						getOptionLabel={(option) => option.name}
						getOptionValue={(option) => option._id}
					/>
				</div>
			</div>
			<div className={styles.formGrid}>
				<div className={styles.inputGroup}>
					<label>Description</label>
					<ReactQuill
						value={formData.description}
						onChange={(content) =>
							setFormData({ ...formData, description: content })
						}
						modules={modules}
						placeholder="Write about your journey..."
					/>
				</div>
				<div className={styles.inputGroup}>
					<label>Photos</label>
					<PhotoUpload
						photos={formData.photos}
						onChange={(photos) =>
							setFormData({ ...formData, photos })
						}
					/>
				</div>
			</div>
		</form>
	);
};

export default JourneyForm;
