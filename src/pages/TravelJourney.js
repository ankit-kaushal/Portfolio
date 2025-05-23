import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "./styles/traveljourney.css";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import Footer from "../components/common/footer";
import NavBar from "../components/common/navBar";
import INFO from "../data/user";
import SEO from "../data/seo";
import { useSelector } from "react-redux";

import ShootingStars from "../components/common/ShootingStars";

const TimelineContainer = styled.div`
	padding: 2rem;
	max-width: 1200px;
	margin: 0 auto;
`;

const TimelineList = styled.div`
	position: relative;
	margin: 2rem 0;

	&::before {
		content: "";
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: 0;
		height: 100%;
		width: 3px;
		background: linear-gradient(180deg, #ff6b6b, #4ecdc4, #45b7d1);
	}

	@media (max-width: 768px) {
		&::before {
			left: 0;
			transform: none;
		}
	}
`;

const TimelineItem = styled(motion.div)`
	position: relative;
	margin-bottom: 1rem;
	width: 45%;
	${(props) => (props.isEven ? "margin-left: auto;" : "margin-right: auto;")}

	&::before {
		content: "";
		position: absolute;
		${(props) => (props.isEven ? "left: -42px;" : "right: -42px;")}
		top: 24px;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: ${(props) => props.color};
		border: 4px solid var(--elements-background-color);
		box-shadow: 0 0 0 3px ${(props) => props.color}40;
		z-index: 1;
	}

	@media (max-width: 768px) {
		width: calc(100% - 40px);
		margin-left: 40px;
		margin-right: 0;

		&::before {
			left: -40px;
			right: auto;
		}
	}
`;

const JourneyCard = styled(motion.div)`
	padding: 25px;
	background: var(--elements-background-color);
	border-radius: 15px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
	transition: transform 0.3s ease;

	&:hover {
		transform: translateY(-5px);
	}
`;

const JourneyTitle = styled.h2`
	color: ${(props) => props.color};
	margin-bottom: 0.5rem;
	margin-top: 0.5rem;
	font-size: 1.5rem;
`;

const JourneyDate = styled.p`
	color: var(--secondary-color);
	font-size: 0.9rem;
	margin: 0.5rem 0;
	font-weight: 500;
`;

const JourneyDescription = styled.p`
	color: var(--primary-color);
	line-height: 1.6;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;

	p {
		margin: 0;
	}
`;

const ReadMoreLink = styled(Link)`
	display: inline-block;
	color: ${(props) => props.color};
	text-decoration: none;
	font-weight: 600;

	&:hover {
		text-decoration: underline;
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

const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96c93d", "#e056fd"];

const SkeletonCard = styled(JourneyCard)`
	background: var(--elements-background-color);

	.skeleton-title,
	.skeleton-date,
	.skeleton-description {
		background: linear-gradient(
			90deg,
			#f0f0f0 25%,
			#e0e0e0 50%,
			#f0f0f0 75%
		);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
		border-radius: 4px;
	}

	.skeleton-title {
		height: 24px;
		width: 70%;
		margin-bottom: 8px;
	}

	.skeleton-date {
		height: 16px;
		width: 40%;
		margin-bottom: 12px;
	}

	.skeleton-description {
		height: 16px;
		margin-bottom: 8px;
		&:last-of-type {
			width: 80%;
		}
	}

	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}
`;

const TravelJourney = () => {
	const data = useSelector((state) => state.data);
	const { user = {} } = data || {};

	const [journeys, setJourneys] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const currentSEO = SEO.find((item) => item.page === "home");

	useEffect(() => {
		const cachedJourneys = localStorage.getItem("travelJourneys");
		const lastFetchTime = localStorage.getItem("journeysFetchTime");
		const ONE_HOUR = 60 * 60 * 1000;

		const fetchJourneys = async () => {
			setIsLoading(true);
			try {
				const response = await fetch(
					"https://www.api.ankitkaushal.in/travel-journeys",
				);
				const data = await response.json();
				setJourneys(data);
				localStorage.setItem("travelJourneys", JSON.stringify(data));
				localStorage.setItem(
					"journeysFetchTime",
					Date.now().toString(),
				);
			} catch (error) {
				console.error("Error fetching journeys:", error);
				if (cachedJourneys) {
					setJourneys(JSON.parse(cachedJourneys));
				}
			} finally {
				setIsLoading(false);
			}
		};

		if (
			cachedJourneys &&
			lastFetchTime &&
			Date.now() - parseInt(lastFetchTime) < ONE_HOUR
		) {
			setJourneys(JSON.parse(cachedJourneys));
			setIsLoading(false);
		} else {
			fetchJourneys();
		}
	}, []);

	const cardVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: "easeOut" },
		},
	};

	const containerVariants = {
		hidden: {},
		visible: {
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const renderSkeletons = () => {
		return Array(3)
			.fill(null)
			.map((_, index) => (
				<TimelineItem
					key={`skeleton-${index}`}
					isEven={index % 2 === 1}
					color={colors[index % colors.length]}
				>
					<SkeletonCard>
						<div className="skeleton-title" />
						<div className="skeleton-date" />
						<div className="skeleton-description" />
						<div className="skeleton-description" />
						<div className="skeleton-description" />
					</SkeletonCard>
				</TimelineItem>
			));
	};

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
				<ShootingStars />
				<NavBar active="about" />
				<div className="content-wrapper">
					<div className="travel-journey-wrapper">
						<div className="travel-journey-content">
							<motion.div
								className="travel-journey-main"
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8 }}
							>
								<div className="title-subtitle-container">
									<div className="title travel-title">
										Travel Journeys
									</div>

									<div className="subtitle travel-subtitle">
										Documenting my adventures around the
										world
									</div>
								</div>

								<TimelineContainer>
									<TimelineList
										as={motion.div}
										variants={containerVariants}
										initial="hidden"
										animate="visible"
									>
										{isLoading
											? renderSkeletons()
											: journeys.map((journey, index) => (
													<TimelineItem
														key={journey._id}
														isEven={index % 2 === 1}
														color={
															colors[
																index %
																	colors.length
															]
														}
														initial="hidden"
														whileInView="visible"
														viewport={{
															once: true,
															margin: "-50px",
															amount: 0.3,
														}}
														variants={cardVariants}
													>
														<JourneyCard
															whileHover={{
																scale: 1.02,
															}}
															transition={{
																type: "spring",
																stiffness: 300,
															}}
														>
															<JourneyTitle
																color={
																	colors[
																		index %
																			colors.length
																	]
																}
															>
																{journey.title}
															</JourneyTitle>
															<JourneyDate>
																{formatDate(
																	journey
																		.duration
																		.startDate,
																)}{" "}
																{journey
																	.duration
																	.endDate &&
																	"-"}{" "}
																{journey
																	.duration
																	.endDate &&
																	formatDate(
																		journey
																			.duration
																			.endDate,
																	)}
															</JourneyDate>
															<JourneyDescription
																dangerouslySetInnerHTML={{
																	__html: journey.description,
																}}
															/>
															<ReadMoreLink
																to={`/journey/${journey._id}`}
																color={
																	colors[
																		index %
																			colors.length
																	]
																}
															>
																Read more →
															</ReadMoreLink>
														</JourneyCard>
													</TimelineItem>
												))}
									</TimelineList>
								</TimelineContainer>
							</motion.div>
						</div>
					</div>
					<div className="page-footer">
						<Footer user={user} />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default TravelJourney;
