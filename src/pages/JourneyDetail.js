import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import "./styles/traveljourney.css";
import { Helmet } from "react-helmet";
import Footer from "../components/common/footer";
import NavBar from "../components/common/navBar";
import INFO from "../data/user";
import SEO from "../data/seo";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { startCase } from "lodash";

const DetailContainer = styled(motion.div)`
	padding-top: 120px;
	margin: 0 auto;
`;

const Card = styled(motion.div)`
	transition: all 0.3s ease;

	@media (max-width: 768px) {
		padding: 1.5rem;
	}
`;

const HeaderSection = styled.div`
	display: grid;
	grid-template-columns: 2fr 1.1fr;
	gap: 2rem;
	margin-bottom: 2rem;
	align-items: start;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
`;

const MainInfo = styled.div``;

const SideInfo = styled.div`
	border-left: 2px solid var(--tertiary-color);
	padding-left: 2rem;

	@media (max-width: 768px) {
		border-left: none;
		padding-left: 0;
	}
`;

const Title = styled.div`
	color: var(--primary-color);
	margin-bottom: 1rem;
	font-size: 2.5rem;
	font-weight: 700;
	line-height: 1.2;

	@media (max-width: 768px) {
		font-size: 2rem;
	}
`;

const Place = styled.div`
	color: var(--primary-color);
	margin-bottom: 0.5rem;
	font-size: 1.5rem;
	font-weight: 600;
	opacity: 0.9;
`;

const DateRange = styled.p`
	color: var(--secondary-color);
	font-size: 1.1rem;
	font-weight: 500;
	margin-bottom: 1rem;
`;

const InfoBox = styled.div`
	border: 1px solid var(--tertiary-color);
	padding: 1.5rem;
	border-radius: 12px;
	margin-bottom: 1.5rem;
	transition: all 0.3s ease;

	&:hover {
		box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
	}
`;

const Description = styled.p`
	color: var(--primary-color);
	line-height: 1.8;
	font-size: 1.1rem;
	margin: 1.5rem 0;
	letter-spacing: 0.3px;
`;

const Section = styled.div`
	margin: 2rem 0;
`;

const SectionTitle = styled.div`
	color: var(--primary-color);
	margin-bottom: 1rem;
	font-size: 1.3rem;
	font-weight: 600;
	position: relative;
	padding-left: 1rem;

	&:before {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 4px;
		background: var(--link-color);
		border-radius: 2px;
	}
`;

const SectionSubTitle = styled.div`
	color: var(--primary-color);
	font-size: 1rem;
	font-weight: 600;
`;

const PhotoGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 1.5rem;
	margin: 1.5rem 0;
`;

const Photo = styled(motion.div)`
	cursor: pointer;
	img,
	video {
		width: 100%;
		height: 200px;
		object-fit: cover;
		border-radius: 8px;
		transition: transform 0.2s;

		&:hover {
			transform: scale(1.02);
		}
	}
	p {
		margin-top: 0.5rem;
		text-align: center;
		color: var(--secondary-color);
	}
`;

const Rating = styled.div`
	margin: 1rem 0;
	color: #ffd700;
	font-size: 1.5rem;
	letter-spacing: 2px;
	display: flex;
	gap: 2px;

	svg {
		width: 24px;
		height: 24px;
	}
`;

const Star = ({ filled, half = false }) => {
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
};

const StarRating = ({ rating }) => {
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 >= 0.5;
	const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

	return (
		<Rating>
			{[...Array(fullStars)].map((_, i) => (
				<Star key={`full-${i}`} filled={true} />
			))}
			{hasHalfStar && <Star half={true} filled={true} />}
			{[...Array(emptyStars)].map((_, i) => (
				<Star key={`empty-${i}`} filled={false} />
			))}
		</Rating>
	);
};

const ModeIcon = styled.div`
	display: flex;
	align-items: center;
	gap: 0.8rem;
	font-size: 1rem;
	color: var(--primary-color);
	font-weight: 500;

	.icon {
		font-size: 1.5rem;
		width: 24px;
		height: 24px;
	}
`;

const JourneyDetails = styled(InfoBox)`
	padding: 2rem;

	.details-title {
		font-size: 1.6rem;
		font-weight: 700;
		margin-bottom: 2rem;
		color: var(--primary-color);
	}

	.detail-section {
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--tertiary-color);

		&:last-child {
			margin-bottom: 0;
			padding-bottom: 0;
			border-bottom: none;
		}

		&.row-flex {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 1rem;
		}

		.mode-of-travel-icons {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}
	}
`;

const BuddyGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
	text-align: center;
`;

const BuddyAvatar = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 0.5rem;

	img {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		object-fit: cover;
	}

	.avatar-fallback {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-color: var(--tertiary-color);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		color: var(--primary-color);
	}

	.buddy-name {
		font-size: 0.9rem;
		color: var(--secondary-color);
		margin-top: 0.3rem;

		a {
			color: inherit;
			text-decoration: none;
			&:hover {
				color: var(--link-color);
			}
		}
	}
`;

const BackButton = styled(motion.button)`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	background: none;
	border: none;
	color: var(--primary-color);
	font-size: 1rem;
	cursor: pointer;
	position: absolute;
	top: 40px;

	&:hover {
		color: var(--link-color);
	}

	@media (max-width: 768px) {
		top: 80px;
		left: 40px;
	}
`;

const PhotoModal = styled(motion.div)`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.8);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
	padding: 2rem;

	img,
	video {
		max-width: 90%;
		max-height: 90vh;
		object-fit: contain;
	}
`;

const formatDate = (dateString) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

const getTravelModeIcon = (mode) => {
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
		<ModeIcon>
			<FontAwesomeIcon icon={icon} className="icon" /> {mode}
		</ModeIcon>
	);
};

const getInitials = (name) => {
	return name
		.split(" ")
		.map((word) => word[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
};

const JourneyDetail = () => {
	const { id } = useParams();
	const data = useSelector((state) => state.data);
	const { user = {} } = data || {};
	const [journey, setJourney] = useState(null);
	const navigate = useNavigate();
	const [selectedPhoto, setSelectedPhoto] = useState(null);

	const currentSEO = SEO.find((item) => item.page === "home");

	useEffect(() => {
		const fetchJourneyDetail = async () => {
			try {
				const response = await fetch(
					`https://www.api.ankitkaushal.in.net/travel-journeys/${id}`,
				);
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

	const handlePhotoClick = (photo) => {
		setSelectedPhoto(photo);
	};

	const closeModal = () => {
		setSelectedPhoto(null);
	};

	if (!journey)
		return (
			<div className="loading-wrap">
				<div className="loader"></div>
			</div>
		);

	return (
		<React.Fragment>
			<Helmet>
				<title>
					{journey.title} | {user?.name || INFO.main.title}
				</title>
				<meta name="description" content={journey.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>

				<meta
					property="og:title"
					content={`${journey.title} | ${user?.name || INFO.main.title}`}
				/>
				<meta property="og:description" content={journey.description} />
				{journey.photos && journey.photos.length > 0 && (
					<meta property="og:image" content={journey.photos[0].url} />
				)}
				<meta property="og:type" content="article" />
				<meta property="og:url" content={window.location.href} />

				<meta name="twitter:card" content="summary_large_image" />
				<meta
					name="twitter:title"
					content={`${journey.title} | ${user?.name || INFO.main.title}`}
				/>
				<meta
					name="twitter:description"
					content={journey.description}
				/>
				{journey.photos && journey.photos.length > 0 && (
					<meta
						name="twitter:image"
						content={journey.photos[0].url}
					/>
				)}
			</Helmet>

			<div className="page-content">
				<NavBar active="about" />
				<div className="content-wrapper">
					<DetailContainer
						initial="hidden"
						animate="visible"
						variants={containerVariants}
					>
						<BackButton
							onClick={() => {
								navigate("/travel-journey");
							}}
							whileHover={{ x: -5 }}
							whileTap={{ scale: 0.95 }}
						>
							<FontAwesomeIcon icon={faArrowLeft} /> Back
						</BackButton>
						<Card variants={itemVariants}>
							<HeaderSection>
								<MainInfo>
									<motion.div animate={floatingAnimation}>
										<Title>{journey.title}</Title>
										<Place>{journey.place}</Place>
										<DateRange>
											{formatDate(
												journey.duration.startDate,
											)}{" "}
											{journey.duration.endDate && "-"}
											{journey.duration.endDate &&
												formatDate(
													journey.duration.endDate,
												)}
										</DateRange>
										{journey.rating > 0 && (
											<StarRating
												rating={journey.rating}
											/>
										)}
									</motion.div>
									<Description
										dangerouslySetInnerHTML={{
											__html: journey.description,
										}}
									/>

									{journey.photos.length > 0 && (
										<Section>
											<SectionTitle>
												Photo Gallery
											</SectionTitle>
											<PhotoGrid>
												{journey.photos.map(
													(photo, index) => (
														<Photo
															key={photo._id}
															initial={{
																opacity: 0,
																y: 20,
															}}
															animate={{
																opacity: 1,
																y: 0,
															}}
															transition={{
																delay:
																	index * 0.1,
															}}
															onClick={() =>
																handlePhotoClick(
																	photo,
																)
															}
														>
															{photo.url.match(
																/\.(mp4|webm|ogg|mov)$/,
															) ? (
																<video
																	src={
																		photo.url
																	}
																	autoPlay
																	loop
																	muted
																	playsInline
																	preload="metadata"
																/>
															) : (
																<img
																	src={
																		photo.url
																	}
																	alt={
																		photo.caption
																	}
																/>
															)}
															<p>
																{photo.caption}
															</p>
														</Photo>
													),
												)}
											</PhotoGrid>
										</Section>
									)}
								</MainInfo>

								<SideInfo>
									<JourneyDetails>
										<SectionTitle>
											Journey Details
										</SectionTitle>

										{journey.modeOfTravel?.length > 0 && (
											<div className="detail-section row-flex">
												<SectionSubTitle>
													Mode of Travel
												</SectionSubTitle>
												<div className="mode-of-travel-icons">
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
																	startCase(
																		mode,
																	),
																)}
															</motion.div>
														),
													)}
												</div>
											</div>
										)}

										{journey.expense?.amount && (
											<div className="detail-section row-flex">
												<SectionSubTitle>
													Expense
												</SectionSubTitle>
												<div
													style={{
														fontSize: "1rem",
														color: "var(--primary-color)",
													}}
												>
													{journey.expense.amount}{" "}
													{journey.expense.currency}
												</div>
											</div>
										)}

										{journey.buddies?.length > 0 && (
											<div className="detail-section">
												<SectionSubTitle>
													Travelled with:
												</SectionSubTitle>
												<BuddyGrid>
													{journey.buddies.map(
														(buddy) => (
															<BuddyAvatar
																key={buddy._id}
															>
																{buddy.picture ? (
																	<img
																		src={
																			buddy.picture
																		}
																		alt={
																			buddy.name
																		}
																	/>
																) : (
																	<div className="avatar-fallback">
																		{getInitials(
																			buddy.name,
																		)}
																	</div>
																)}
																<div className="buddy-name">
																	{buddy.profileLink ? (
																		<a
																			href={
																				buddy.profileLink
																			}
																			target="_blank"
																			rel="noopener noreferrer"
																		>
																			{
																				buddy.name
																			}
																		</a>
																	) : (
																		<span>
																			{
																				buddy.name
																			}
																		</span>
																	)}
																</div>
															</BuddyAvatar>
														),
													)}
												</BuddyGrid>
											</div>
										)}

										{journey.placesVisited?.length > 0 && (
											<div className="detail-section">
												<SectionSubTitle>
													Places Explored
												</SectionSubTitle>
												<ul>
													{journey.placesVisited.map(
														(place, index) => (
															<li
																key={index}
																style={{
																	color: "var(--primary-color)",
																}}
															>
																{place}
															</li>
														),
													)}
												</ul>
											</div>
										)}
									</JourneyDetails>
								</SideInfo>
							</HeaderSection>
						</Card>
					</DetailContainer>
					<div className="page-footer">
						<Footer user={user} />
					</div>
				</div>
			</div>
			{selectedPhoto && (
				<PhotoModal
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={closeModal}
				>
					<img src={selectedPhoto.url} alt={selectedPhoto.caption} />
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
				</PhotoModal>
			)}
		</React.Fragment>
	);
};

export default JourneyDetail;
