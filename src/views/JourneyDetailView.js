"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import FaIcon from "@/components/common/FaIcon";
import {
	faPlane,
	faTrain,
	faBus,
	faCar,
	faMotorcycle,
	faPersonWalking,
	faEllipsis,
	faAutomobile,
	faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

import Footer from "@/components/common/footer";
import NavBar from "@/components/common/navBar";
import ShootingStars from "@/components/common/ShootingStars";
import layoutStyles from "@/components/layout/layout.module.css";
import { apiUrl } from "@/lib/api";

import travelStyles from "./travelJourney.module.css";
import styles from "./journeyDetail.module.css";

const startCase = (str) =>
	str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const formatDate = (dateString) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

function Star({ filled, half = false }) {
	const fillColor = filled ? "#ffd700" : "none";
	const strokeColor = "#ffd700";

	return (
		<svg
			viewBox="0 0 24 24"
			fill={fillColor}
			stroke={strokeColor}
			strokeWidth="1"
		>
			{half ? (
				<>
					<defs>
						<linearGradient id="halfFill">
							<stop offset="50%" stopColor="#ffd700" />
							<stop offset="50%" stopColor="transparent" />
						</linearGradient>
					</defs>
					<path
						fill="url(#halfFill)"
						d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
					/>
				</>
			) : (
				<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
			)}
		</svg>
	);
}

function StarRating({ rating }) {
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 >= 0.5;
	const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

	return (
		<div className={styles.rating}>
			{[...Array(fullStars)].map((_, i) => (
				<Star key={`full-${i}`} filled={true} />
			))}
			{hasHalfStar && <Star half={true} filled={true} />}
			{[...Array(emptyStars)].map((_, i) => (
				<Star key={`empty-${i}`} filled={false} />
			))}
		</div>
	);
}

function getTravelModeIcon(mode) {
	const modeMap = {
		flight: faPlane,
		train: faTrain,
		bus: faBus,
		auto: faAutomobile,
		car: faCar,
		bike: faMotorcycle,
		scooty: faMotorcycle,
		walk: faPersonWalking,
		metro: faTrain,
		other: faEllipsis,
	};

	const icon = modeMap[mode.toLowerCase()] || faEllipsis;

	return (
		<div className={styles.modeIcon}>
			<FaIcon icon={icon} className={styles.modeIconGlyph} /> {mode}
		</div>
	);
}

function getInitials(name) {
	return name
		.split(" ")
		.map((word) => word[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

export default function JourneyDetailView({ id }) {
	const data = useSelector((state) => state.data);
	const { user = {} } = data || {};
	const [journey, setJourney] = useState(null);
	const router = useRouter();
	const [selectedPhoto, setSelectedPhoto] = useState(null);

	useEffect(() => {
		const fetchJourneyDetail = async () => {
			try {
				const response = await fetch(apiUrl(`/travel-journeys/${id}`));
				const data = await response.json();
				setJourney(data);
			} catch (error) {
				console.error("Error fetching journey details:", error);
			}
		};

		fetchJourneyDetail();
	}, [id]);

	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, x: -20 },
		visible: {
			opacity: 1,
			x: 0,
		},
	};

	const floatingAnimation = {
		y: [0, -10, 0],
		transition: {
			duration: 3,
			repeat: Infinity,
			ease: "easeInOut",
		},
	};

	if (!journey) {
		return (
			<div className={layoutStyles.loadingWrap}>
				<div className={travelStyles.loader} />
			</div>
		);
	}

	return (
		<div className={layoutStyles.pageContent}>
			<ShootingStars />
			<NavBar active="about" />
			<div className={layoutStyles.contentWrapper}>
				<motion.div
					className={styles.detailContainer}
					initial="hidden"
					animate="visible"
					variants={containerVariants}
				>
					<motion.button
						type="button"
						className={styles.backButton}
						onClick={() => router.push("/travel-journey")}
						whileHover={{ x: -5 }}
						whileTap={{ scale: 0.95 }}
					>
						<FaIcon icon={faArrowLeft} /> Back
					</motion.button>

					<motion.div className={styles.card} variants={itemVariants}>
						<div className={styles.headerSection}>
							<div>
								<motion.div animate={floatingAnimation}>
									<h1 className={styles.title}>
										{journey.title}
									</h1>
									<h2 className={styles.place}>
										{journey.place}
									</h2>
									<p className={styles.dateRange}>
										{formatDate(journey.duration.startDate)}{" "}
										{journey.duration.endDate && "-"}
										{journey.duration.endDate &&
											formatDate(journey.duration.endDate)}
									</p>
									{journey.rating > 0 && (
										<StarRating rating={journey.rating} />
									)}
								</motion.div>
								<p
									className={styles.description}
									dangerouslySetInnerHTML={{
										__html: journey.description,
									}}
								/>

								{journey.photos.length > 0 && (
									<div className={styles.section}>
										<div className={styles.sectionTitle}>
											Photo Gallery
										</div>
										<div className={styles.photoGrid}>
											{journey.photos.map(
												(photo, index) => (
													<motion.div
														key={photo._id}
														className={styles.photo}
														initial={{
															opacity: 0,
															y: 20,
														}}
														animate={{
															opacity: 1,
															y: 0,
														}}
														transition={{
															delay: index * 0.1,
														}}
														onClick={() =>
															setSelectedPhoto(
																photo,
															)
														}
													>
														{photo.url.match(
															/\.(mp4|webm|ogg|mov)$/,
														) ? (
															<video
																src={photo.url}
																autoPlay
																loop
																muted
																playsInline
																preload="metadata"
															/>
														) : (
															<img
																src={photo.url}
																alt={
																	photo.caption
																}
															/>
														)}
														<p
															className={
																styles.photoCaption
															}
														>
															{photo.caption}
														</p>
													</motion.div>
												),
											)}
										</div>
									</div>
								)}
							</div>

							<div className={styles.sideInfo}>
								<div className={styles.journeyDetails}>
									<div className={styles.sectionTitle}>
										Journey Details
									</div>

									{journey.modeOfTravel?.length > 0 && (
										<div
											className={`${styles.detailSection} ${styles.detailSectionRow}`}
										>
											<div
												className={styles.sectionSubTitle}
											>
												Mode of Travel
											</div>
											<div
												className={
													styles.modeOfTravelIcons
												}
											>
												{journey.modeOfTravel.map(
													(mode, index) => (
														<motion.div
															key={index}
															whileHover={{
																scale: 1.05,
															}}
															whileTap={{
																scale: 0.95,
															}}
														>
															{getTravelModeIcon(
																startCase(mode),
															)}
														</motion.div>
													),
												)}
											</div>
										</div>
									)}

									{journey.expense?.amount && (
										<div
											className={`${styles.detailSection} ${styles.detailSectionRow}`}
										>
											<div
												className={styles.sectionSubTitle}
											>
												Expense
											</div>
											<div className={styles.expenseValue}>
												{journey.expense.amount}{" "}
												{journey.expense.currency}
											</div>
										</div>
									)}

									{journey.buddies?.length > 0 && (
										<div className={styles.detailSection}>
											<div
												className={styles.sectionSubTitle}
											>
												Travelled with:
											</div>
											<div className={styles.buddyGrid}>
												{journey.buddies.map((buddy) => (
													<div
														key={buddy._id}
														className={
															styles.buddyAvatar
														}
													>
														{buddy.picture ? (
															<img
																src={
																	buddy.picture
																}
																alt={buddy.name}
															/>
														) : (
															<div
																className={
																	styles.avatarFallback
																}
															>
																{getInitials(
																	buddy.name,
																)}
															</div>
														)}
														<div
															className={
																styles.buddyName
															}
														>
															{buddy.profileLink ? (
																<a
																	href={
																		buddy.profileLink
																	}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	{buddy.name}
																</a>
															) : (
																<span>
																	{buddy.name}
																</span>
															)}
														</div>
													</div>
												))}
											</div>
										</div>
									)}

									{journey.placesVisited?.length > 0 && (
										<div className={styles.detailSection}>
											<div
												className={styles.sectionSubTitle}
											>
												Places Explored
											</div>
											<ul className={styles.placesList}>
												{journey.placesVisited.map(
													(place, index) => (
														<li key={index}>
															{place}
														</li>
													),
												)}
											</ul>
										</div>
									)}
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>

				<div className={layoutStyles.pageFooter}>
					<Footer user={user} />
				</div>
			</div>

			{selectedPhoto && (
				<motion.div
					className={styles.photoModal}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={() => setSelectedPhoto(null)}
				>
					{selectedPhoto.url.match(/\.(mp4|webm|ogg|mov)$/) ? (
						<video
							src={selectedPhoto.url}
							controls
							preload="metadata"
						/>
					) : (
						<img
							src={selectedPhoto.url}
							alt={selectedPhoto.caption}
						/>
					)}
				</motion.div>
			)}
		</div>
	);
}
