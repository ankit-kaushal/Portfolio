import React from "react";
import styles from "./styles.module.css";

const ProjectFormModal = ({
	isOpen,
	onClose,
	formData,
	handleChange,
	handleSubmit,
	isLoading,
	editMode,
}) => {
	if (!isOpen) return null;

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modal}>
				<div className={styles.modalHeader}>
					<h3>{editMode ? "Edit Project" : "Add New Project"}</h3>
					<button className={styles.closeButton} onClick={onClose}>
						×
					</button>
				</div>
				<form onSubmit={handleSubmit} className={styles.form}>
					<div className={styles.formGroup}>
						<label>Project Name</label>
						<input
							type="text"
							name="projectName"
							value={formData.projectName}
							onChange={handleChange}
							placeholder="Project Name"
						/>
					</div>

					<div className={styles.formGroup}>
						<label>Description</label>
						<textarea
							name="projectDescription"
							value={formData.projectDescription}
							onChange={handleChange}
							placeholder="Project Description"
							rows="3"
						/>
					</div>

					<div className={styles.formGroup}>
						<label>Project Picture URL</label>
						<input
							type="text"
							name="projectPicture"
							value={formData.projectPicture}
							onChange={handleChange}
							placeholder="Project Picture URL"
						/>
					</div>

					<div className={styles.formGroup}>
						<label>Project Link</label>
						<input
							type="text"
							name="projectLink"
							value={formData.projectLink}
							onChange={handleChange}
							placeholder="Project URL (optional)"
						/>
					</div>

					<div className={styles.formGroup}>
						<label>GitHub Link</label>
						<input
							type="text"
							name="projectGitHub"
							value={formData.projectGitHub}
							onChange={handleChange}
							placeholder="GitHub Repository URL"
						/>
					</div>

					<div className={styles.formGroup}>
						<label>Main Stack</label>
						<input
							type="text"
							name="mainStack"
							value={formData.mainStack}
							onChange={handleChange}
							placeholder="Main Technology Stack"
						/>
					</div>

					<div className={styles.formGroup}>
						<label>Project Type</label>
						<select
							name="projectType"
							value={formData.projectType}
							onChange={handleChange}
						>
							<option value="personal">Personal</option>
							<option value="professional">Professional</option>
						</select>
					</div>

					<div className={styles.formGroup}>
						<label>Publish Date</label>
						<input
							type="date"
							name="projectPublishDate"
							value={formData.projectPublishDate}
							onChange={handleChange}
						/>
					</div>

					<div className={styles.modalActions}>
						<button
							type="submit"
							disabled={isLoading}
							className={styles.submitButton}
						>
							{isLoading
								? editMode
									? "Updating..."
									: "Adding..."
								: editMode
									? "Update Project"
									: "Add Project"}
						</button>
						<button
							type="button"
							onClick={onClose}
							className={styles.cancelButton}
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ProjectFormModal;
