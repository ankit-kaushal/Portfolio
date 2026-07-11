"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
	Button,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Toast,
	Grid,
} from "uiplex";
import { apiUrl, getAuthHeaders } from "@/lib/api";
import styles from "../../admin.module.css";

const AboutEdit = () => {
	const data = useSelector((state) => state.data);
	const { user = {} } = data || {};

	const [formData, setFormData] = useState({
		name: user.name || "",
		description: user.description || "",
		aboutTitle: user.aboutTitle || "",
		aboutDescription: user.aboutDescription || "",
		currentLocation: user.currentLocation || "",
		logoUrl: user.logoUrl || "",
		pictureUrl: {
			home: user.pictureUrl?.home || "",
			about: user.pictureUrl?.about || "",
		},
	});
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (name, value) => {
		if (name.startsWith("pictureUrl.")) {
			const key = name.split(".")[1];
			setFormData((prev) => ({
				...prev,
				pictureUrl: { ...prev.pictureUrl, [key]: value },
			}));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await axios.patch(
				apiUrl(`/users/${user._id}`),
				formData,
				{ headers: getAuthHeaders() },
			);

			if (response.status === 200) {
				Toast.success("Profile updated successfully!");
			}
		} catch (error) {
			Toast.error(error.response?.data?.message || "Update failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Grid templateColumns="repeat(2, 1fr)" className={styles.formGrid} gap="1rem">
				<FormControl>
					<FormLabel>Name</FormLabel>
					<Input
						value={formData.name}
						onChange={(e) => handleChange("name", e.target.value)}
						placeholder="Your Name"
					/>
				</FormControl>

				<FormControl>
					<FormLabel>Current Location</FormLabel>
					<Input
						value={formData.currentLocation}
						onChange={(e) =>
							handleChange("currentLocation", e.target.value)
						}
						placeholder="Your Current Location"
					/>
				</FormControl>

				<FormControl>
					<FormLabel>Logo URL</FormLabel>
					<Input
						value={formData.logoUrl}
						onChange={(e) => handleChange("logoUrl", e.target.value)}
						placeholder="Logo URL"
					/>
				</FormControl>

				<FormControl>
					<FormLabel>Home Picture URL</FormLabel>
					<Input
						value={formData.pictureUrl.home}
						onChange={(e) =>
							handleChange("pictureUrl.home", e.target.value)
						}
						placeholder="Home Picture URL"
					/>
				</FormControl>

				<FormControl>
					<FormLabel>About Title</FormLabel>
					<Input
						value={formData.aboutTitle}
						onChange={(e) => handleChange("aboutTitle", e.target.value)}
						placeholder="About Title"
					/>
				</FormControl>

				<FormControl>
					<FormLabel>About Picture URL</FormLabel>
					<Input
						value={formData.pictureUrl.about}
						onChange={(e) =>
							handleChange("pictureUrl.about", e.target.value)
						}
						placeholder="About Picture URL"
					/>
				</FormControl>

				<FormControl style={{ gridColumn: "1 / -1" }}>
					<FormLabel>Description</FormLabel>
					<Textarea
						value={formData.description}
						onChange={(e) => handleChange("description", e.target.value)}
						placeholder="Your Description"
						rows={3}
					/>
				</FormControl>

				<FormControl style={{ gridColumn: "1 / -1" }}>
					<FormLabel>About Description</FormLabel>
					<Textarea
						value={formData.aboutDescription}
						onChange={(e) =>
							handleChange("aboutDescription", e.target.value)
						}
						placeholder="About Description"
						rows={5}
					/>
				</FormControl>
			</Grid>

			<div className={styles.formActions}>
				<Button
					type="submit"
					variant="primary"
					colorScheme="green"
					loading={isLoading}
				>
					Save Changes
				</Button>
			</div>
		</form>
	);
};

export default AboutEdit;
