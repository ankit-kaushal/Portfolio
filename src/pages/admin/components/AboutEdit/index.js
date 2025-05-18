import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./styles.module.css";
import Toast from "../../../../components/common/Toast";

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
	const [toast, setToast] = useState({ show: false, message: "", type: "" });

	const handleChange = (e) => {
		const { name, value } = e.target;
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
				`https://www.api.ankitkaushal.in/users/${user._id}`,
				formData,
				{
					headers: {
						Authorization: process.env.REACT_APP_AUTHKEY,
					},
				},
			);

			if (response.status === 200) {
				setToast({
					show: true,
					message: "Updated successfully!",
					type: "success",
				});
			}
		} catch (error) {
			setToast({
				show: true,
				message: error.response?.data?.message || "Update failed",
				type: "error",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={styles.editContainer}>
			<h2>Edit About Information</h2>

			{/* Remove the old message div */}

			<form onSubmit={handleSubmit} className={styles.form}>
				<div className={styles.formGroup}>
					<label>Name</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						placeholder="Your Name"
					/>
				</div>

				<div className={styles.formGroup}>
					<label>Description</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						placeholder="Your Description"
						rows="3"
					/>
				</div>

				<div className={styles.formGroup}>
					<label>Current Location</label>
					<input
						type="text"
						name="currentLocation"
						value={formData.currentLocation}
						onChange={handleChange}
						placeholder="Your Current Location"
					/>
				</div>

				<div className={styles.formGroup}>
					<label>Logo URL</label>
					<input
						type="text"
						name="logoUrl"
						value={formData.logoUrl}
						onChange={handleChange}
						placeholder="Logo URL"
					/>
				</div>

				<div className={styles.formGroup}>
					<label>Home Picture URL</label>
					<input
						type="text"
						name="pictureUrl.home"
						value={formData.pictureUrl.home}
						onChange={handleChange}
						placeholder="Home Picture URL"
					/>
				</div>

				<div className={styles.formGroup}>
					<label>About Title</label>
					<input
						type="text"
						name="aboutTitle"
						value={formData.aboutTitle}
						onChange={handleChange}
						placeholder="About Title"
					/>
				</div>

				<div className={styles.formGroup}>
					<label>About Description</label>
					<textarea
						name="aboutDescription"
						value={formData.aboutDescription}
						onChange={handleChange}
						placeholder="About Description"
						rows="5"
					/>
				</div>

				<div className={styles.formGroup}>
					<label>About Picture URL</label>
					<input
						type="text"
						name="pictureUrl.about"
						value={formData.pictureUrl.about}
						onChange={handleChange}
						placeholder="Picture URL"
					/>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					className={styles.submitButton}
				>
					{isLoading ? "Updating..." : "Update"}
				</button>
			</form>

			{toast.show && (
				<Toast
					message={toast.message}
					type={toast.type}
					onClose={() =>
						setToast({ show: false, message: "", type: "" })
					}
				/>
			)}
		</div>
	);
};

export default AboutEdit;
