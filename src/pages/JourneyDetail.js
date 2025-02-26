import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

const Tag = styled(motion.span)`
	border: 1px solid var(--tertiary-color);
	color: var(--primary-color);
	padding: 0.3rem 0.8rem;
	border-radius: 16px;
	margin-right: 0.5rem;
	display: inline-block;
	margin-bottom: 0.5rem;
	cursor: pointer;
	transition: all 0.3s ease;

	a {
		color: var(--primary-color);
		text-decoration: none;

		&:hover {
			color: var(--link-color);
		}
	}

	&:hover {
		transform: scale(1.05);
		border-color: var(--link-color);
	}
`;

const PhotoGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 1.5rem;
	margin: 1.5rem 0;
`;

const Photo = styled.div`
	img {
		width: 100%;
		height: 200px;
		object-fit: cover;
		border-radius: 8px;
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
`;

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
	width: fit-content;
	margin-top: 0.5rem;

	img {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		object-fit: cover;
	}

	.avatar-fallback {
		width: 40px;
		height: 40px;
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

const formatDate = (dateString) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

const StarRating = ({ rating }) => {
	return (
		<Rating>
			{"★".repeat(rating)}
			{"☆".repeat(5 - rating)}
		</Rating>
	);
};

const getTravelModeIcon = (mode) => {
	const modeMap = {
		flight: faPlane,
		train: faTrain,
		bus: faBus,
		car: faCar,
		bike: faMotorcycle,
		walk: faPersonWalking,
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

	if (!journey) return <div className="loader"></div>;

	return (
		<React.Fragment>
			<Helmet>
				<title>{user?.name || INFO.main.title}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="about" />
				<div className="content-wrapper">
					<DetailContainer
						initial="hidden"
						animate="visible"
						variants={containerVariants}
					>
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
									<Description>
										{journey.description}
									</Description>

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
															href={
																photo.profileLink
															}
														>
															<img
																src={photo.url}
																alt={
																	photo.caption
																}
															/>
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
										)}

										{journey.expense?.amount && (
											<div className="detail-section row-flex">
												<SectionSubTitle>
													Expense
												</SectionSubTitle>
												<div
													style={{
														fontSize: "1rem",
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
															<li key={index}>
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
		</React.Fragment>
	);
};

export default JourneyDetail;
