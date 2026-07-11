"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import FaIcon from "@/components/common/FaIcon";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
	Button,
	IconButton,
	Card,
	CardBody,
	CardTitle,
	CardSubtitle,
	Badge,
	Link,
	Toast,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Select,
	DateTimePicker,
	Text,
	Flex,
	Skeleton,
} from "uiplex";
import { apiUrl, getAuthHeaders } from "@/lib/api";
import AdminSectionHeader from "../shared/AdminSectionHeader";
import ConfirmModal from "../shared/ConfirmModal";
import styles from "../../admin.module.css";

const EMPTY_FORM = {
	projectName: "",
	projectDescription: "",
	projectPicture: "",
	projectLink: "",
	projectGitHub: "",
	projectType: "personal",
	mainStack: "",
	projectPublishDate: new Date().toISOString().split("T")[0],
};

const ProjectsEdit = () => {
	const data = useSelector((state) => state.data);
	const { projects: projectsData = [] } = data || {};

	const [formData, setFormData] = useState(EMPTY_FORM);
	const [projects, setProjects] = useState(projectsData);
	const [isLoading, setIsLoading] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deleteId, setDeleteId] = useState(null);

	const handleChange = (name, value) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const resetForm = () => {
		setFormData(EMPTY_FORM);
		setEditMode(false);
		setEditingId(null);
	};

	const handleOpenModal = () => {
		resetForm();
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		resetForm();
	};

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			let response;
			if (editMode) {
				response = await axios.patch(
					apiUrl(`/projects/${editingId}`),
					formData,
					{ headers: getAuthHeaders() },
				);
				setProjects(
					projects.map((p) => (p._id === editingId ? response.data : p)),
				);
				Toast.success("Project updated successfully!");
			} else {
				response = await axios.post(apiUrl("/projects"), formData, {
					headers: getAuthHeaders(),
				});
				setProjects([...projects, response.data]);
				Toast.success("Project added successfully!");
			}
			handleCloseModal();
		} catch (error) {
			Toast.error(
				error.response?.data?.message ||
					`Failed to ${editMode ? "update" : "add"} project`,
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		try {
			await axios.delete(apiUrl(`/projects/${deleteId}`), {
				headers: getAuthHeaders(),
			});
			setProjects(projects.filter((project) => project._id !== deleteId));
			Toast.success("Project deleted successfully!");
			setShowDeleteModal(false);
		} catch (error) {
			Toast.error(
				error.response?.data?.message || "Failed to delete project",
			);
		}
	};

	return (
		<>
			<AdminSectionHeader
				title="All Projects"
				description={`${projects.length} project${projects.length === 1 ? "" : "s"} in your portfolio`}
				actionLabel="Add Project"
				onAction={handleOpenModal}
				actionIcon={<FaIcon icon={faPlus} />}
			/>

			<div className={styles.projectGrid}>
				{projects.length === 0
					? Array.from({ length: 3 }).map((_, i) => (
							<Skeleton key={i} variant="rectangular" height={280} />
						))
					: projects.map((project) => (
							<Card key={project._id}>
								{project.projectPicture && (
									<img
										src={project.projectPicture}
										alt={project.projectName}
										className={styles.projectCardImage}
									/>
								)}
								<CardBody>
									<Flex
										align="start"
										justify="between"
										gap="0.75rem"
										style={{ marginBottom: "0.5rem" }}
									>
										<Flex direction="column" gap="0.25rem">
											<CardTitle>{project.projectName}</CardTitle>
											<CardSubtitle>
												{project.mainStack || "No stack listed"}
											</CardSubtitle>
										</Flex>
										<Badge variant="primary" size="sm">
											{project.projectType}
										</Badge>
									</Flex>

									<Text size="sm" variant="muted">
										{project.projectDescription}
									</Text>

									<Flex gap="0.75rem" style={{ marginTop: "0.75rem" }} wrap="wrap">
										{project.projectLink && (
											<Link
												href={project.projectLink}
												isExternal
												variant="link"
											>
												View Project
											</Link>
										)}
										{project.projectGitHub && (
											<Link
												href={project.projectGitHub}
												isExternal
												variant="link"
											>
												GitHub
											</Link>
										)}
									</Flex>

									<div className={styles.projectCardActions}>
										<IconButton
											icon={<FaIcon icon={faEdit} />}
											variant="ghost"
											aria-label="Edit project"
											onClick={() => handleEdit(project)}
										/>
										<IconButton
											icon={<FaIcon icon={faTrash} />}
											variant="ghost"
											colorScheme="red"
											aria-label="Delete project"
											onClick={() => {
												setDeleteId(project._id);
												setShowDeleteModal(true);
											}}
										/>
									</div>
								</CardBody>
							</Card>
						))}
			</div>

			<Modal isOpen={isModalOpen} onClose={handleCloseModal} size="xl">
				<ModalHeader>
					{editMode ? "Edit Project" : "Add New Project"}
					<ModalCloseButton onClose={handleCloseModal} />
				</ModalHeader>
				<ModalBody>
					<form id="projectForm" onSubmit={handleSubmit}>
						<div className={styles.formGrid}>
							<FormControl>
								<FormLabel>Project Name</FormLabel>
								<Input
									value={formData.projectName}
									onChange={(e) =>
										handleChange("projectName", e.target.value)
									}
									placeholder="Project Name"
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Main Stack</FormLabel>
								<Input
									value={formData.mainStack}
									onChange={(e) =>
										handleChange("mainStack", e.target.value)
									}
									placeholder="React, Node.js..."
								/>
							</FormControl>

							<FormControl style={{ gridColumn: "1 / -1" }}>
								<FormLabel>Description</FormLabel>
								<Textarea
									value={formData.projectDescription}
									onChange={(e) =>
										handleChange("projectDescription", e.target.value)
									}
									placeholder="Project Description"
									rows={3}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Project Picture URL</FormLabel>
								<Input
									value={formData.projectPicture}
									onChange={(e) =>
										handleChange("projectPicture", e.target.value)
									}
									placeholder="Image URL"
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Project Link</FormLabel>
								<Input
									value={formData.projectLink}
									onChange={(e) =>
										handleChange("projectLink", e.target.value)
									}
									placeholder="Live URL (optional)"
								/>
							</FormControl>

							<FormControl>
								<FormLabel>GitHub Link</FormLabel>
								<Input
									value={formData.projectGitHub}
									onChange={(e) =>
										handleChange("projectGitHub", e.target.value)
									}
									placeholder="Repository URL"
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Project Type</FormLabel>
								<Select
									value={formData.projectType}
									onChange={(value) =>
										handleChange("projectType", value)
									}
									options={[
										{ value: "personal", label: "Personal" },
										{ value: "professional", label: "Professional" },
									]}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Publish Date</FormLabel>
								<DateTimePicker
									mode="date"
									value={formData.projectPublishDate}
									onChange={(value) =>
										handleChange("projectPublishDate", value)
									}
								/>
							</FormControl>
						</div>
					</form>
				</ModalBody>
				<ModalFooter>
					<Button variant="outline" onClick={handleCloseModal}>
						Cancel
					</Button>
					<Button
						type="submit"
						form="projectForm"
						variant="primary"
						colorScheme="green"
						loading={isLoading}
					>
						{editMode ? "Update Project" : "Add Project"}
					</Button>
				</ModalFooter>
			</Modal>

			<ConfirmModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleDelete}
				title="Delete Project"
				message="Are you sure you want to delete this project? This action cannot be undone."
				confirmLabel="Delete"
			/>
		</>
	);
};

export default ProjectsEdit;
