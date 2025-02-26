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

const DetailContainer = styled(motion.div)`
	padding-top: 120px;
	margin: 0 auto;
`;

const Card = styled(motion.div)`
	padding: 2rem;
	transition: all 0.3s ease;
`;

const Title = styled.h1`
	color: var(--primary-color);
	margin-bottom: 1rem;
`;

const Place = styled.h3`
	color: var(--primary-color);
	margin-bottom: 0.5rem;
`;

const DateRange = styled.p`
	color: var(--secondary-color);
	font-size: 0.9rem;
`;

const Rating = styled.div`
	margin: 1rem 0;
	color: #ffd700;
	font-size: 1.5rem;
`;

const Description = styled.p`
	color: var(--primary-color);
	line-height: 1.6;
	margin: 1rem 0;
`;

const Section = styled.div`
	margin: 1.5rem 0;
`;

const SectionTitle = styled.h4`
	color: var(--primary-color);
	margin-bottom: 0.5rem;
`;

const Tag = styled(motion.span)`
	background: var(--quaternary-color);
	color: var(--primary-color);
	padding: 0.3rem 0.8rem;
	border-radius: 16px;
	margin-right: 0.5rem;
	display: inline-block;
	margin-bottom: 0.5rem;
	cursor: pointer;

	a {
		color: var(--primary-color);
		text-decoration: none;

		&:hover {
			color: var(--link-color);
		}
	}

	&:hover {
		transform: scale(1.05);
	}
`;

const PhotoGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	gap: 1rem;
	margin: 1rem 0;
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
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5 }}
							>
								<Title>{journey.title}</Title>
								<Place>{journey.place}</Place>
								<DateRange>
									{formatDate(journey.duration.startDate)} -
									{formatDate(journey.duration.endDate)}
								</DateRange>
								<StarRating rating={journey.rating} />
								<Description>{journey.description}</Description>

								<Section>
									<SectionTitle>Mode of Travel:</SectionTitle>
									{journey.modeOfTravel.map((mode, index) => (
										<Tag
											key={index}
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											{mode}
										</Tag>
									))}
								</Section>

								<Section>
									<SectionTitle>Expense:</SectionTitle>
									<p>
										{journey.expense.amount}{" "}
										{journey.expense.currency}
									</p>
								</Section>

								{journey.buddies.length > 0 && (
									<Section>
										<SectionTitle>
											Travel Buddies:
										</SectionTitle>
										{journey.buddies.map((buddy) => (
											<Tag key={buddy._id}>
												<a
													href={buddy.profileLink}
													target="_blank"
													rel="noopener noreferrer"
												>
													{buddy.name}
												</a>
											</Tag>
										))}
									</Section>
								)}

								{journey.photos.length > 0 && (
									<Section>
										<SectionTitle>Photos:</SectionTitle>
										<PhotoGrid>
											{journey.photos.map((photo) => (
												<motion.div
													key={photo._id}
													whileHover={{
														scale: 1.05,
													}}
													transition={{
														duration: 0.2,
													}}
												>
													<Photo>
														<img
															src={photo.url}
															alt={photo.caption}
														/>
														<p>{photo.caption}</p>
													</Photo>
												</motion.div>
											))}
										</PhotoGrid>
									</Section>
								)}
							</motion.div>
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
