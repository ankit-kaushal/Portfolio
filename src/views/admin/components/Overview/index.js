"use client";

import React, { useState, useEffect, useMemo } from "react";
import FaIcon from "@/components/common/FaIcon";
import {
	faProjectDiagram,
	faMountainCity,
	faNewspaper,
	faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import axios from "axios";
import {
	Card,
	CardBody,
	Text,
	Grid,
	Skeleton,
	Flex,
} from "uiplex";
import { apiUrl } from "@/lib/api";
import styles from "../../admin.module.css";

function getMonthKey(date) {
	const d = new Date(date);
	if (Number.isNaN(d.getTime())) return null;
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(monthKey) {
	const [year, month] = monthKey.split("-");
	return new Date(Number(year), Number(month) - 1).toLocaleDateString(
		"en-US",
		{ month: "short", year: "2-digit" },
	);
}

function buildMonthlyChart(projects, journeys) {
	const counts = {};

	projects.forEach((project) => {
		const key = getMonthKey(project.projectPublishDate || project.createdAt);
		if (!key) return;
		counts[key] = counts[key] || { projects: 0, journeys: 0 };
		counts[key].projects += 1;
	});

	journeys.forEach((journey) => {
		const key = getMonthKey(
			journey.duration?.startDate || journey.createdAt,
		);
		if (!key) return;
		counts[key] = counts[key] || { projects: 0, journeys: 0 };
		counts[key].journeys += 1;
	});

	return Object.entries(counts)
		.sort(([a], [b]) => a.localeCompare(b))
		.slice(-12)
		.map(([monthKey, values]) => ({
			name: formatMonthLabel(monthKey),
			projects: values.projects,
			journeys: values.journeys,
			total: values.projects + values.journeys,
		}));
}

const Overview = () => {
	const [stats, setStats] = useState({
		projects: 0,
		journeys: 0,
		blogs: 0,
		works: 0,
	});
	const [chartData, setChartData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const [projectsRes, journeysRes, blogsRes, profileRes] =
					await Promise.all([
						axios.get(apiUrl("/projects")),
						axios.get(apiUrl("/travel-journeys")),
						axios.get(apiUrl("/blogs")),
						axios.get(apiUrl("/profile")),
					]);

				const projects = projectsRes.data;
				const journeys = journeysRes.data;
				const works = profileRes.data?.works || [];
				const blogs = blogsRes.data || [];

				setStats({
					projects: projects.length,
					journeys: journeys.length,
					blogs: blogs.length,
					works: works.length,
				});

				setChartData(buildMonthlyChart(projects, journeys));
			} catch (error) {
				console.error("Error fetching stats:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchStats();
	}, []);

	const statCards = useMemo(
		() => [
			{
				icon: faProjectDiagram,
				title: "Projects",
				value: stats.projects,
				color: "var(--accent-primary)",
			},
			{
				icon: faMountainCity,
				title: "Travel Journeys",
				value: stats.journeys,
				color: "#10b981",
			},
			{
				icon: faNewspaper,
				title: "Blog Articles",
				value: stats.blogs,
				color: "#8b5cf6",
			},
			{
				icon: faBriefcase,
				title: "Work Entries",
				value: stats.works,
				color: "#f59e0b",
			},
		],
		[stats],
	);

	if (isLoading) {
		return (
			<Grid templateColumns="repeat(4, 1fr)" gap="1rem">
				<Skeleton variant="rectangular" height={110} />
				<Skeleton variant="rectangular" height={110} />
				<Skeleton variant="rectangular" height={110} />
				<Skeleton variant="rectangular" height={110} />
			</Grid>
		);
	}

	return (
		<>
			<div className={styles.statGrid}>
				{statCards.map((card) => (
					<Card key={card.title}>
						<CardBody>
							<Flex align="center" gap="1rem">
								<Flex
									align="center"
									justify="center"
									width="48px"
									height="48px"
									borderRadius="12px"
									style={{
										backgroundColor: `${card.color}20`,
										color: card.color,
									}}
								>
									<FaIcon icon={card.icon} />
								</Flex>
								<Flex direction="column" gap="0.15rem">
									<Text size="xl" weight="bold">
										{card.value}
									</Text>
									<Text size="sm" variant="muted">
										{card.title}
									</Text>
								</Flex>
							</Flex>
						</CardBody>
					</Card>
				))}
			</div>

			<Card className={styles.chartCard}>
				<CardBody>
					<Text size="lg" weight="semibold" style={{ marginBottom: "1rem" }}>
						Content Published Over Time
					</Text>
					{chartData.length === 0 ? (
						<Text size="sm" variant="muted">
							No publish dates available yet to build a trend chart.
						</Text>
					) : (
						<ResponsiveContainer width="100%" height={300}>
							<AreaChart data={chartData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis allowDecimals={false} />
								<Tooltip />
								<Legend />
								<Area
									type="monotone"
									dataKey="projects"
									name="Projects"
									stroke="#089669"
									fill="#089669"
									fillOpacity={0.2}
									stackId="1"
								/>
								<Area
									type="monotone"
									dataKey="journeys"
									name="Journeys"
									stroke="#10b981"
									fill="#10b981"
									fillOpacity={0.2}
									stackId="1"
								/>
							</AreaChart>
						</ResponsiveContainer>
					)}
				</CardBody>
			</Card>
		</>
	);
};

export default Overview;
