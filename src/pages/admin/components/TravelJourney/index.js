import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPlus,
	faEdit,
	faTrash,
	faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import styles from "./styles.module.css";
import Modal from "../../../../components/common/Modal";
import JourneyForm from "./JourneyForm";
import JourneySkeleton from "./JourneySkeleton";
import Toast from "../../../../components/common/Toast";

const TravelJourney = () => {
	const [journeys, setJourneys] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		place: "",
		duration: {
			startDate: "",
			endDate: "",
		},
		expense: {
			amount: "",
			currency: "INR",
		},
		buddies: [],
		modeOfTravel: [],
		placesVisited: [],
		photos: [],
		rating: 0,
	});
	const [isEditing, setIsEditing] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [toast, setToast] = useState({ show: false, message: "", type: "" });

	useEffect(() => {
		fetchJourneys();
	}, []);

	const fetchJourneys = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(
				"https://api.ankitkaushal.in/travel-journeys",
			);
			setJourneys(response.data);
		} catch (error) {
			console.error("Error fetching journeys:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (isEditing) {
				await axios.put(
					`https://api.ankitkaushal.in/travel-journeys/${editingId}`,
					formData,
					{
						headers: {
							Authorization: process.env.REACT_APP_AUTHKEY,
						},
					},
				);
				setToast({
					show: true,
					message: "Journey updated successfully!",
					type: "success",
				});
			} else {
				await axios.post(
					"https://api.ankitkaushal.in/travel-journeys",
					formData,
					{
						headers: {
							Authorization: process.env.REACT_APP_AUTHKEY,
						},
					},
				);
				setToast({
					show: true,
					message: "New journey added successfully!",
					type: "success",
				});
			}
			fetchJourneys();
			resetForm();
		} catch (error) {
			console.error("Error saving journey:", error);
			setToast({
				show: true,
				message: "Failed to save journey. Please try again.",
				type: "error",
			});
		}
	};

	const handleEdit = (journey) => {
		setFormData({
			title: journey.title,
			description: journey.description,
			place: journey.place,
			duration: journey.duration,
			expense: journey.expense,
			buddies: journey.buddies,
			modeOfTravel: journey.modeOfTravel,
			placesVisited: journey.placesVisited,
			photos: journey.photos,
			rating: journey.rating,
		});
		setIsEditing(true);
		setEditingId(journey._id);
	};

	const handleDelete = async (id) => {
		try {
			await axios.delete(
				`https://api.ankitkaushal.in/travel-journeys/${id}`,
				{
					headers: {
						Authorization: process.env.REACT_APP_AUTHKEY,
					},
				},
			);
			setToast({
				show: true,
				message: "Journey deleted successfully!",
				type: "success",
			});
			fetchJourneys();
		} catch (error) {
			console.error("Error deleting journey:", error);
			setToast({
				show: true,
				message: "Failed to delete journey. Please try again.",
				type: "error",
			});
		}
	};

	const resetForm = () => {
		setFormData({
			title: "",
			description: "",
			place: "",
			duration: {
				startDate: "",
				endDate: "",
			},
			expense: {
				amount: "",
				currency: "INR",
			},
			buddies: [],
			modeOfTravel: [],
			placesVisited: [],
			photos: [],
			rating: 0,
		});
		setIsEditing(false);
		setEditingId(null);
	};

	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = (journey = null) => {
		if (journey) {
			handleEdit(journey);
		} else {
			resetForm();
		}
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		resetForm();
	};
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deleteId, setDeleteId] = useState(null);

	const handleDeleteClick = (id) => {
		setDeleteId(id);
		setShowDeleteModal(true);
	};

	const confirmDelete = async () => {
		await handleDelete(deleteId);
		setShowDeleteModal(false);
	};

	return (
		<div className={styles.travelContainer}>
			<div className={styles.header}>
				<h2>Travel Journey</h2>
				<button
					className={styles.addButton}
					onClick={() => openModal()}
				>
					<FontAwesomeIcon icon={faPlus} /> Add New Journey
				</button>
			</div>

			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				title={isEditing ? "Edit Journey" : "Add New Journey"}
				actions={
					<>
						<button
							type="button"
							className={styles.cancelButton}
							onClick={closeModal}
						>
							Cancel
						</button>
						<button
							type="submit"
							className={styles.submitButton}
							form="journeyForm"
						>
							{isEditing ? "Update Journey" : "Save Journey"}
						</button>
					</>
				}
			>
				<JourneyForm
					formData={formData}
					setFormData={setFormData}
					onSubmit={handleSubmit}
					isEditing={isEditing}
					id="journeyForm"
				/>
			</Modal>

			<div className={styles.journeyList}>
				{isLoading ? (
					<>
						<JourneySkeleton />
						<JourneySkeleton />
						<JourneySkeleton />
					</>
				) : (
					journeys.map((journey) => (
						<div key={journey._id} className={styles.journeyCard}>
							{journey.photos[0] && (
								<img
									src={journey.photos[0].url}
									alt={journey.title}
								/>
							)}
							<div className={styles.journeyContent}>
								<h3>{journey.title}</h3>
								<p className={styles.location}>
									{journey.place}
								</p>
								<p className={styles.date}>
									{new Date(
										journey.duration.startDate,
									).toLocaleDateString()}{" "}
									-
									{new Date(
										journey.duration.endDate,
									).toLocaleDateString()}
								</p>
								<p className={styles.expense}>
									Expense: {journey.expense.amount}{" "}
									{journey.expense.currency}
								</p>
								<p className={styles.description}>
									{journey.description}
								</p>
							</div>
							<div className={styles.cardActions}>
								<a
									href={`/journey/${journey._id}`}
									target="_blank"
									rel="noopener noreferrer"
									className={styles.redirectButton}
								>
									<FontAwesomeIcon icon={faExternalLinkAlt} />
								</a>
								<button
									className={styles.editButton}
									onClick={() => openModal(journey)}
								>
									<FontAwesomeIcon icon={faEdit} />
								</button>
								<button
									className={styles.deleteButton}
									onClick={() => handleDelete(journey._id)}
								>
									<FontAwesomeIcon icon={faTrash} />
								</button>
							</div>
						</div>
					))
				)}
			</div>
			<Modal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				title="Confirm Delete"
				actions={
					<>
						<button
							className={styles.cancelButton}
							onClick={() => setShowDeleteModal(false)}
						>
							Cancel
						</button>
						<button
							className={styles.deleteButton}
							onClick={confirmDelete}
						>
							Delete
						</button>
					</>
				}
			>
				<p>Are you sure you want to delete this journey?</p>
			</Modal>
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

export default TravelJourney;
