import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles.module.css";

const PhotoUpload = ({ photos, onChange }) => {
	const [uploading, setUploading] = useState(false);

	const handleFileUpload = async (e) => {
		const files = Array.from(e.target.files);
		setUploading(true);

		try {
			const uploadPromises = files.map(async (file) => {
				const formData = new FormData();
				const blob = new Blob([file], { type: file.type });
				formData.append("file", blob, file.name);

				const response = await fetch(
					"https://www.api.ankitkaushal.in/upload",
					{
						method: "POST",
						body: formData,
						headers: {
							Authorization: process.env.REACT_APP_AUTHKEY,
						},
					},
				);

				const data = await response.json();
				return {
					url: data.url,
					caption: "",
				};
			});

			const uploadedPhotos = await Promise.all(uploadPromises);
			onChange([...photos, ...uploadedPhotos]);
		} catch (error) {
			console.error("Error uploading photos:", error);
		} finally {
			setUploading(false);
		}
	};

	const handleCaptionChange = (index, caption) => {
		const updatedPhotos = [...photos];
		updatedPhotos[index].caption = caption;
		onChange(updatedPhotos);
	};

	const handleRemovePhoto = (index) => {
		const updatedPhotos = photos.filter((_, i) => i !== index);
		onChange(updatedPhotos);
	};

	return (
		<div className={styles.photoUpload}>
			<div className={styles.uploadButton}>
				<input
					type="file"
					multiple
					accept="image/*"
					onChange={handleFileUpload}
					disabled={uploading}
				/>
				<FontAwesomeIcon icon={faUpload} />
				<span>{uploading ? "Uploading..." : "Upload Photos"}</span>
			</div>

			<div className={styles.photoGrid}>
				{photos.map((photo, index) => (
					<div key={index} className={styles.photoItem}>
						<img src={photo.url} alt={`Upload ${index + 1}`} />
						<input
							type="text"
							value={photo.caption}
							onChange={(e) =>
								handleCaptionChange(index, e.target.value)
							}
							placeholder="Add caption..."
							className={styles.captionInput}
						/>
						<button
							onClick={() => handleRemovePhoto(index)}
							className={styles.removeButton}
						>
							<FontAwesomeIcon icon={faTimes} />
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default PhotoUpload;
