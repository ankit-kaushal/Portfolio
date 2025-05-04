import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./styles.module.css";
import Toast from "../../../../components/toast";
import ProjectFormModal from "./ProjectFormModal";

const ProjectsEdit = () => {
	const data = useSelector((state) => state.data);
	const { projects: projectsData = [] } = data || {};

	const [formData, setFormData] = useState({
		projectName: "",
		projectDescription: "",
		projectPicture: "",
		projectLink: "",
		projectGitHub: "",
		projectType: "personal",
		mainStack: "",
		projectPublishDate: new Date().toISOString().split("T")[0],
	});

	const [projects, setProjects] = useState(projectsData);
	const [isLoading, setIsLoading] = useState(false);
	const [toast, setToast] = useState({ show: false, message: "", type: "" });

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Add new state for edit mode
	const [editMode, setEditMode] = useState(false);
	const [editingId, setEditingId] = useState(null);

	// Update handleSubmit to handle both create and edit
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			let response;
			if (editMode) {
				response = await axios.patch(
					`https://www.api.ankitkaushal.in/projects/${editingId}`,
					formData,
					{
						headers: {
							Authorization: process.env.REACT_APP_AUTHKEY,
						},
					},
				);

				if (response.status === 200) {
					setProjects(
						projects.map((p) =>
							p._id === editingId ? response.data : p,
						),
					);
					setToast({
						show: true,
						message: "Project updated successfully!",
						type: "success",
					});
				}
			} else {
				response = await axios.post(
					`https://www.api.ankitkaushal.in/projects`,
					formData,
					{
						headers: {
							Authorization: process.env.REACT_APP_AUTHKEY,
						},
					},
				);

				if (response.status === 201) {
					setProjects([...projects, response.data]);
					setToast({
						show: true,
						message: "Project added successfully!",
						type: "success",
					});
				}
			}

			// Reset form
			setFormData({
				projectName: "",
				projectDescription: "",
				projectPicture: "",
				projectLink: "",
				projectGitHub: "",
				projectType: "personal",
				mainStack: "",
				projectPublishDate: new Date().toISOString().split("T")[0],
			});
			setEditMode(false);
			setEditingId(null);
		} catch (error) {
			setToast({
				show: true,
				message:
					error.response?.data?.message ||
					`Failed to ${editMode ? "update" : "add"} project`,
				type: "error",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (id) => {
		try {
			await axios.delete(
				`https://www.api.ankitkaushal.in/projects/${id}`,
				{
					headers: {
						Authorization: process.env.REACT_APP_AUTHKEY,
					},
				},
			);
			setProjects(projects.filter((project) => project._id !== id));
			setToast({
				show: true,
				message: "Project deleted successfully!",
				type: "success",
			});
		} catch (error) {
			setToast({
				show: true,
				message:
					error.response?.data?.message || "Failed to delete project",
				type: "error",
			});
		}
	};

	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditMode(false);
		setEditingId(null);
		setFormData({
			projectName: "",
			projectDescription: "",
			projectPicture: "",
			projectLink: "",
			projectGitHub: "",
			projectType: "personal",
			mainStack: "",
			projectPublishDate: new Date().toISOString().split("T")[0],
		});
	};

	// Update handleEdit
	const handleEdit = (project) => {
		setFormData({
			projectName: project.projectName,
			projectDescription: project.projectDescription,
			projectPicture: project.projectPicture,
			projectLink: project.projectLink || "",
			projectGitHub: project.projectGitHub || "",
			projectType: project.projectType,
			mainStack: project.mainStack,
			projectPublishDate: new Date(project.projectPublishDate)
				.toISOString()
				.split("T")[0],
		});
		setEditingId(project._id);
		setEditMode(true);
		setIsModalOpen(true);
	};

	return (
		<div className={styles.projectsContainer}>
			<div className={styles.header}>
				<h2>Manage Projects</h2>
				<button onClick={handleOpenModal} className={styles.addButton}>
					Add New Project
				</button>
			</div>

			<div className={styles.projectsList}>
				{projects.map((project) => (
					<div key={project._id} className={styles.projectCard}>
						<img
							src={project.projectPicture}
							alt={project.projectName}
							className={styles.projectLogo}
						/>
						<div className={styles.projectInfo}>
							<h3>{project.projectName}</h3>
							<p>{project.projectDescription}</p>
							<div className={styles.projectMeta}>
								<span>Type: {project.projectType}</span>
								<span>Stack: {project.mainStack}</span>
								<span>
									Published:{" "}
									{new Date(
										project.projectPublishDate,
									).toLocaleDateString()}
								</span>
							</div>
							<div className={styles.projectLinks}>
								{project.projectLink && (
									<a
										href={project.projectLink}
										target="_blank"
										rel="noopener noreferrer"
									>
										View Project
									</a>
								)}
								{project.projectGitHub && (
									<a
										href={project.projectGitHub}
										target="_blank"
										rel="noopener noreferrer"
									>
										GitHub
									</a>
								)}
							</div>
						</div>
						<button
							onClick={() => handleEdit(project)}
							className={styles.editButton}
						>
							Edit
						</button>
						<button
							onClick={() => handleDelete(project._id)}
							className={styles.deleteButton}
						>
							Delete
						</button>
					</div>
				))}
			</div>

			<ProjectFormModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				formData={formData}
				handleChange={handleChange}
				handleSubmit={handleSubmit}
				isLoading={isLoading}
				editMode={editMode}
			/>
		</div>
	);
};

export default ProjectsEdit;
