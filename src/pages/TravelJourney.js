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
`;

const TimelineItem = styled(motion.div)`
	position: relative;
	width: 45%;
	margin-bottom: 4rem;
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
`;

const ReadMoreLink = styled(Link)`
	display: inline-block;
	margin-top: 1rem;
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

const TravelJourney = () => {
	const data = useSelector((state) => state.data);

	const { user = {} } = data || {};

	const [journeys, setJourneys] = useState([]);

	const currentSEO = SEO.find((item) => item.page === "home");

	useEffect(() => {
		const fetchJourneys = async () => {
			try {
				const response = await fetch(
					"https://www.api.ankitkaushal.in.net/travel-journeys",
				);
				const data = await response.json();
				setJourneys(data);
			} catch (error) {
				console.error("Error fetching journeys:", error);
			}
		};

		fetchJourneys();
	}, []);

	const cardVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: "easeOut" },
		},
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
										Travel Journey
									</div>

									<div className="subtitle travel-subtitle">
										Documenting my adventures around the
										world
									</div>
								</div>

								<TimelineContainer>
									<TimelineList>
										{journeys.map((journey, index) => (
											<TimelineItem
												key={journey._id}
												isEven={index % 2 === 1}
												color={
													colors[
														index % colors.length
													]
												}
												initial="hidden"
												whileInView="visible"
												viewport={{
													once: true,
													margin: "-100px",
												}}
												variants={cardVariants}
											>
												<JourneyCard
													whileHover={{ scale: 1.02 }}
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
															journey.duration
																.startDate,
														)}{" "}
														-{" "}
														{formatDate(
															journey.duration
																.endDate,
														)}
													</JourneyDate>
													<JourneyDescription>
														{journey.description}
													</JourneyDescription>
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
