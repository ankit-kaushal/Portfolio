"use client";

import React, { useState, useEffect } from "react";
import FaIcon from "@/components/common/FaIcon";
import {
	faPlus,
	faEdit,
	faTrash,
	faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {
	Button,
	IconButton,
	Card,
	CardBody,
	CardTitle,
	Badge,
	Toast,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	Text,
	Flex,
} from "uiplex";
import { apiUrl, getAuthHeaders } from "@/lib/api";
import AdminSectionHeader from "../shared/AdminSectionHeader";
import ConfirmModal from "../shared/ConfirmModal";
import JourneyForm from "./JourneyForm";
import JourneySkeleton from "./JourneySkeleton";
import styles from "../../admin.module.css";

const EMPTY_FORM = {
	title: "",
	description: "",
	place: "",
	duration: { startDate: "", endDate: "" },
	expense: { amount: "", currency: "INR" },
	buddies: [],
	modeOfTravel: [],
	placesVisited: [],
	photos: [],
	rating: 0,
};

const TravelJourney = () => {
	const [journeys, setJourneys] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [formData, setFormData] = useState(EMPTY_FORM);
	const [isEditing, setIsEditing] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deleteId, setDeleteId] = useState(null);

	useEffect(() => {
		fetchJourneys();
	}, []);

	const fetchJourneys = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(apiUrl("/travel-journeys"));
			setJourneys(response.data);
		} catch (error) {
			console.error("Error fetching journeys:", error);
			Toast.error("Failed to load travel journeys");
		} finally {
			setIsLoading(false);
		}
	};

	const resetForm = () => {
		setFormData(EMPTY_FORM);
		setIsEditing(false);
		setEditingId(null);
	};

	const openModal = (journey = null) => {
		if (journey) {
			setFormData({
				title: journey.title || "",
				description: journey.description || "",
				place: journey.place || "",
				duration: {
					startDate: journey.duration?.startDate || "",
					endDate: journey.duration?.endDate || "",
				},
				expense: {
					amount: journey.expense?.amount ?? "",
					currency: journey.expense?.currency || "INR",
				},
				buddies: Array.isArray(journey.buddies) ? journey.buddies : [],
				modeOfTravel: Array.isArray(journey.modeOfTravel)
					? journey.modeOfTravel
					: [],
				placesVisited: journey.placesVisited || [],
				photos: Array.isArray(journey.photos) ? journey.photos : [],
				rating: Number(journey.rating) || 0,
			});
			setIsEditing(true);
			setEditingId(journey._id);
		} else {
			resetForm();
		}
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		resetForm();
	};

	const handleSubmit = async (e, formattedData) => {
		e.preventDefault();
		try {
			if (isEditing) {
				await axios.patch(
					apiUrl(`/travel-journeys/${editingId}`),
					formattedData,
					{ headers: getAuthHeaders() },
				);
				Toast.success("Journey updated successfully!");
			} else {
				await axios.post(apiUrl("/travel-journeys"), formattedData, {
					headers: getAuthHeaders(),
				});
				Toast.success("New journey added successfully!");
			}
			closeModal();
			fetchJourneys();
		} catch (error) {
			console.error("Error saving journey:", error);
			Toast.error("Failed to save journey. Please try again.");
		}
	};

	const handleDelete = async () => {
		try {
			await axios.delete(apiUrl(`/travel-journeys/${deleteId}`), {
				headers: getAuthHeaders(),
			});
			Toast.success("Journey deleted successfully!");
			setShowDeleteModal(false);
			fetchJourneys();
		} catch (error) {
			console.error("Error deleting journey:", error);
			Toast.error("Failed to delete journey.");
		}
	};

	return (
		<>
			<AdminSectionHeader
				title="Travel Journeys"
				description={`${journeys.length} journey${journeys.length === 1 ? "" : "s"} published`}
				actionLabel="Add Journey"
				onAction={() => openModal()}
				actionIcon={<FaIcon icon={faPlus} />}
			/>

			<div className={styles.journeyGrid}>
				{isLoading ? (
					<>
						<JourneySkeleton />
						<JourneySkeleton />
						<JourneySkeleton />
					</>
				) : (
					journeys.map((journey) => (
						<Card key={journey._id}>
							{journey.photos?.[0]?.url && (
								<img
									src={journey.photos[0].url}
									alt={journey.title}
									className={styles.journeyImage}
								/>
							)}
							<CardBody>
								<CardTitle>{journey.title}</CardTitle>
								<div className={styles.journeyMeta}>
									<Badge variant="primary" size="sm">
										{journey.place}
									</Badge>
									{journey.expense?.amount && (
										<Badge variant="default" size="sm">
											{journey.expense.amount} {journey.expense.currency}
										</Badge>
									)}
								</div>
								<Text size="sm" variant="muted" style={{ marginTop: "0.5rem" }}>
									{new Date(
										journey.duration.startDate,
									).toLocaleDateString()}{" "}
									–{" "}
									{new Date(
										journey.duration.endDate,
									).toLocaleDateString()}
								</Text>
								<div
									className={styles.journeyDescription}
									dangerouslySetInnerHTML={{
										__html: journey.description || "",
									}}
								/>
								<Flex gap="0.5rem" justify="end" style={{ marginTop: "1rem" }}>
									<IconButton
										icon={<FaIcon icon={faExternalLinkAlt} />}
										variant="ghost"
										aria-label="View journey"
										onClick={() =>
											window.open(`/journey/${journey._id}`, "_blank")
										}
									/>
									<IconButton
										icon={<FaIcon icon={faEdit} />}
										variant="ghost"
										aria-label="Edit journey"
										onClick={() => openModal(journey)}
									/>
									<IconButton
										icon={<FaIcon icon={faTrash} />}
										variant="ghost"
										colorScheme="red"
										aria-label="Delete journey"
										onClick={() => {
											setDeleteId(journey._id);
											setShowDeleteModal(true);
										}}
									/>
								</Flex>
							</CardBody>
						</Card>
					))
				)}
			</div>

			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				size="full"
				isCentered
			>
				<ModalHeader>
					{isEditing ? "Edit Journey" : "Add New Journey"}
					<ModalCloseButton onClose={closeModal} />
				</ModalHeader>
				<ModalBody>
					<JourneyForm
						formData={formData}
						setFormData={setFormData}
						onSubmit={handleSubmit}
					/>
				</ModalBody>
				<ModalFooter>
					<Button variant="outline" onClick={closeModal}>
						Cancel
					</Button>
					<Button
						type="submit"
						form="journeyForm"
						variant="primary"
						colorScheme="green"
					>
						{isEditing ? "Update Journey" : "Save Journey"}
					</Button>
				</ModalFooter>
			</Modal>

			<ConfirmModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleDelete}
				title="Delete Journey"
				message="Are you sure you want to delete this journey?"
				confirmLabel="Delete"
			/>
		</>
	);
};

export default TravelJourney;
