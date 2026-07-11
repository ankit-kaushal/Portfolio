"use client";

import React, { useCallback, useState } from "react";
import AsyncSelect from "../../../../components/common/AsyncSelect";
import {
	FormControl,
	FormLabel,
	Input,
	Grid,
	Select,
	DateTimePicker,
} from "uiplex";
import StarRating from "../../../../components/common/StarRating";
import PhotoUpload from "../../../../components/common/PhotoUpload";
import { apiUrl } from "@/lib/api";
import styles from "../../admin.module.css";
import RichTextEditor from "./RichTextEditor";

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

const modules = {
	toolbar: [
		[{ header: [1, 2, false] }],
		["bold", "italic", "underline", "strike"],
		[{ list: "ordered" }, { list: "bullet" }],
		["link", "image"],
		["clean"],
	],
};

const JourneyForm = ({ formData, setFormData, onSubmit }) => {
	const [friendsCache, setFriendsCache] = useState([]);
	const safeBuddies = Array.isArray(formData.buddies) ? formData.buddies : [];
	const safeTravelModes = Array.isArray(formData.modeOfTravel)
		? formData.modeOfTravel
		: [];
	const safePlacesVisited = Array.isArray(formData.placesVisited)
		? formData.placesVisited
		: [];

	const loadFriends = useCallback(async (search) => {
		try {
			if (friendsCache.length === 0) {
				const response = await fetch(apiUrl("/friends"));
				const data = await response.json();
				setFriendsCache(data);
				return data.filter((friend) =>
					friend.name.toLowerCase().includes(search.toLowerCase()),
				);
			}
			return friendsCache.filter((friend) =>
				friend.name.toLowerCase().includes(search.toLowerCase()),
			);
		} catch (error) {
			console.error("Error loading friends:", error);
			return [];
		}
	}, [friendsCache]);

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
					buddies: safeBuddies.map((buddy) => buddy._id),
				};
				onSubmit(e, formattedData);
			}}
			id="journeyForm"
		>
			<Grid templateColumns="repeat(2, 1fr)" className={styles.formGrid} gap="1rem">
				<FormControl>
					<FormLabel>Title</FormLabel>
					<Input
						value={formData.title}
						onChange={(e) =>
							setFormData({ ...formData, title: e.target.value })
						}
						placeholder="Journey Title"
						required
					/>
				</FormControl>

				<FormControl>
					<FormLabel>Place</FormLabel>
					<Input
						value={formData.place}
						onChange={(e) =>
							setFormData({ ...formData, place: e.target.value })
						}
						placeholder="Place"
						required
					/>
				</FormControl>

				<FormControl>
					<FormLabel>Start Date</FormLabel>
					<DateTimePicker
						mode="date"
						value={formatDate(formData.duration.startDate)}
						onChange={(value) =>
							setFormData({
								...formData,
								duration: {
									...formData.duration,
									startDate: value,
								},
							})
						}
					/>
				</FormControl>

				<FormControl>
					<FormLabel>End Date</FormLabel>
					<DateTimePicker
						mode="date"
						value={formatDate(formData.duration.endDate)}
						onChange={(value) =>
							setFormData({
								...formData,
								duration: {
									...formData.duration,
									endDate: value,
								},
							})
						}
					/>
				</FormControl>

				<FormControl>
					<FormLabel>Expense Amount</FormLabel>
					<Input
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
				</FormControl>

				<FormControl>
					<FormLabel>Rating</FormLabel>
					<StarRating
						rating={Number(formData.rating)}
						onRatingChange={(value) =>
							setFormData({ ...formData, rating: value })
						}
					/>
				</FormControl>

				<FormControl>
					<FormLabel>Mode of Travel</FormLabel>
					<Select
						mode="multiple"
						searchable
						placeholder="Select modes of travel..."
						value={safeTravelModes}
						onChange={(selected) =>
							setFormData({
								...formData,
								modeOfTravel: selected || [],
							})
						}
						options={travelModes.map((mode) => ({
							value: mode,
							label: mode,
						}))}
					/>
				</FormControl>

				<FormControl>
					<FormLabel>Places Visited</FormLabel>
					<Input
						value={safePlacesVisited.join(", ")}
						onChange={(e) =>
							setFormData({
								...formData,
								placesVisited: e.target.value
									.split(",")
									.map((item) => item.trim())
									.filter(Boolean),
							})
						}
						placeholder="Comma-separated places"
					/>
				</FormControl>

				<FormControl style={{ gridColumn: "1 / -1" }}>
					<FormLabel>Buddies</FormLabel>
					<AsyncSelect
						value={safeBuddies}
						onChange={(selected) =>
							setFormData({
								...formData,
								buddies: selected || [],
							})
						}
						loadOptions={loadFriends}
						isMulti
						placeholder="Select buddies..."
						getOptionLabel={(option) => option.name}
						getOptionValue={(option) => option._id}
					/>
				</FormControl>

				<FormControl style={{ gridColumn: "1 / -1" }}>
					<FormLabel>Description</FormLabel>
					<div className={styles.quillWrap}>
						<RichTextEditor
							value={formData.description}
							onChange={(content) =>
								setFormData({ ...formData, description: content })
							}
							modules={modules}
							placeholder="Write about your journey..."
						/>
					</div>
				</FormControl>

				<FormControl style={{ gridColumn: "1 / -1" }}>
					<FormLabel>Photos</FormLabel>
					<PhotoUpload
						photos={formData.photos}
						onChange={(photos) => setFormData({ ...formData, photos })}
					/>
				</FormControl>
			</Grid>
		</form>
	);
};

export default JourneyForm;
