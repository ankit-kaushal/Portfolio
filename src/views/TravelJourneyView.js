"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

import Footer from "@/components/common/footer";
import NavBar from "@/components/common/navBar";
import ShootingStars from "@/components/common/ShootingStars";
import layoutStyles from "@/components/layout/layout.module.css";

import styles from "./travelJourney.module.css";

const formatDate = (dateString) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96c93d", "#e056fd"];

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

function TimelineItemWrapper({ isEven, color, children, ...motionProps }) {
	return (
		<motion.div
			className={`${styles.timelineItem} ${
				isEven ? styles.timelineItemEven : styles.timelineItemOdd
			}`}
			{...motionProps}
		>
			<span
				className={styles.timelineDot}
				style={{
					background: color,
					boxShadow: `0 0 0 3px ${color}40`,
				}}
			/>
			{children}
		</motion.div>
	);
}

export default function TravelJourneyView() {
	const data = useSelector((state) => state.data);
	const { user = {} } = data || {};

	const [journeys, setJourneys] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

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

	const renderSkeletons = () =>
		Array(3)
			.fill(null)
			.map((_, index) => {
				const color = colors[index % colors.length];
				return (
					<TimelineItemWrapper
						key={`skeleton-${index}`}
						isEven={index % 2 === 1}
						color={color}
					>
						<div
							className={`${styles.journeyCard} ${styles.skeletonCard}`}
						>
							<div className={styles.skeletonTitle} />
							<div className={styles.skeletonDate} />
							<div className={styles.skeletonDescription} />
							<div className={styles.skeletonDescription} />
							<div className={styles.skeletonDescription} />
						</div>
					</TimelineItemWrapper>
				);
			});

	return (
		<div className={layoutStyles.pageContent}>
			<ShootingStars />
			<NavBar active="about" />
			<div className={layoutStyles.contentWrapper}>
				<div className={styles.wrapper}>
					<div className={styles.content}>
						<motion.div
							className={styles.main}
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
						>
							<div className={styles.titleSubtitleContainer}>
								<div
									className={`${layoutStyles.title} ${styles.travelTitle}`}
								>
									Travel Journeys
								</div>
								<div
									className={`${layoutStyles.subtitle} ${styles.travelSubtitle}`}
								>
									Documenting my adventures around the world
								</div>
							</div>

							<div className={styles.timelineContainer}>
								<motion.div
									className={styles.timelineList}
									variants={containerVariants}
									initial="hidden"
									animate="visible"
								>
									{isLoading
										? renderSkeletons()
										: journeys.map((journey, index) => {
												const color =
													colors[
														index % colors.length
													];
												return (
													<TimelineItemWrapper
														key={journey._id}
														isEven={
															index % 2 === 1
														}
														color={color}
														initial="hidden"
														whileInView="visible"
														viewport={{
															once: true,
															margin: "-50px",
															amount: 0.3,
														}}
														variants={cardVariants}
													>
														<motion.div
															className={
																styles.journeyCard
															}
															whileHover={{
																scale: 1.02,
															}}
															transition={{
																type: "spring",
																stiffness: 300,
															}}
														>
															<h2
																className={
																	styles.journeyTitle
																}
																style={{
																	color,
																}}
															>
																{journey.title}
															</h2>
															<p
																className={
																	styles.journeyDate
																}
															>
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
															</p>
															<p
																className={
																	styles.journeyDescription
																}
																dangerouslySetInnerHTML={{
																	__html: journey.description,
																}}
															/>
															<Link
																href={`/journey/${journey._id}`}
																className={
																	styles.readMoreLink
																}
																style={{
																	color,
																}}
															>
																Read more →
															</Link>
														</motion.div>
													</TimelineItemWrapper>
												);
											})}
								</motion.div>
							</div>
						</motion.div>
					</div>
				</div>
				<div className={layoutStyles.pageFooter}>
					<Footer user={user} />
				</div>
			</div>
		</div>
	);
}
