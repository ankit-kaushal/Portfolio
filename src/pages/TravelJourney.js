import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "./styles/traveljourney.css";
import { Helmet } from "react-helmet";

import Footer from "../components/common/footer";
import NavBar from "../components/common/navBar";

import INFO from "../data/user";
import SEO from "../data/seo";

import { useSelector } from "react-redux";

const TimelineContainer = styled.div`
	padding: 2rem;
	max-width: 800px;
	margin: 0 auto;
`;

const TimelineList = styled.div`
	position: relative;
	margin: 2rem 0;

	&::before {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 2px;
		background: #e0e0e0;
	}
`;

const TimelineItem = styled.div`
	position: relative;
	margin-left: 30px;
	padding: 20px;
	background: #fff;
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	margin-bottom: 2rem;

	&::before {
		content: "";
		position: absolute;
		left: -36px;
		top: 24px;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: #007bff;
		border: 2px solid #fff;
	}
`;

const JourneyTitle = styled.h2`
	color: #1a1a1a;
	margin-bottom: 0.5rem;
	font-size: 1.5rem;
`;

const JourneyDate = styled.p`
	color: #666;
	font-size: 0.9rem;
	margin: 0.5rem 0;
`;

const JourneyDescription = styled.p`
	color: #444;
	line-height: 1.6;
`;

const ReadMoreLink = styled(Link)`
	display: inline-block;
	margin-top: 1rem;
	color: #007bff;
	text-decoration: none;

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
				<NavBar active="home" />
				<div className="content-wrapper">
					<div className="travel-journey-wrapper">
						<div className="travel-journey-content">
							<div className="travel-journey-main">
								<div className="travel-journey-title">
									<h1>Travel Journey</h1>
									<div className="travel-journey-subtitle">
										Documenting my adventures around the
										world
									</div>
								</div>

								<TimelineContainer>
									<TimelineList>
										{journeys.map((journey) => (
											<TimelineItem key={journey._id}>
												<JourneyTitle>
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
												>
													Read more →
												</ReadMoreLink>
											</TimelineItem>
										))}
									</TimelineList>
								</TimelineContainer>
							</div>
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
