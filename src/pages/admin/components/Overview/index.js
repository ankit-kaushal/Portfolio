import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faProjectDiagram,
	faMountainCity,
	faEnvelope,
	faEye,
} from "@fortawesome/free-solid-svg-icons";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import axios from "axios";
import styles from "./styles.module.css";

const Overview = () => {
	const [stats, setStats] = useState({
		projects: 0,
		journeys: 0,
		views: 0,
	});
	const [viewsData, setViewsData] = useState([]);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const [projects, journeys] = await Promise.all([
					axios.get("https://www.api.ankitkaushal.in/projects"),
					axios.get(
						"https://www.api.ankitkaushal.in/travel-journeys",
					),
				]);

				setStats({
					projects: projects.data.length,
					journeys: journeys.data.length,
					views: 1234, // Replace with actual views data
				});

				// Mock data for the chart
				setViewsData([
					{ name: "Jan", views: 400 },
					{ name: "Feb", views: 600 },
					{ name: "Mar", views: 800 },
					{ name: "Apr", views: 1000 },
					{ name: "May", views: 900 },
					{ name: "Jun", views: 1200 },
				]);
			} catch (error) {
				console.error("Error fetching stats:", error);
			}
		};

		fetchStats();
	}, []);

	const StatCard = ({ icon, title, value, color }) => (
		<div className={styles.statCard}>
			<div className={styles.statIcon} style={{ backgroundColor: color }}>
				<FontAwesomeIcon icon={icon} />
			</div>
			<div className={styles.statInfo}>
				<h3>{value}</h3>
				<p>{title}</p>
			</div>
		</div>
	);

	return (
		<div className={styles.overviewContainer}>
			<h2>Dashboard Overview</h2>

			<div className={styles.statsGrid}>
				<StatCard
					icon={faProjectDiagram}
					title="Total Projects"
					value={stats.projects}
					color="#3b82f6"
				/>
				<StatCard
					icon={faMountainCity}
					title="Travel Journeys"
					value={stats.journeys}
					color="#10b981"
				/>
				<StatCard
					icon={faEye}
					title="Portfolio Views"
					value={stats.views}
					color="#8b5cf6"
				/>
			</div>

			<div className={styles.chartContainer}>
				<h3>Portfolio Views Trend</h3>
				<ResponsiveContainer width="100%" height={300}>
					<AreaChart data={viewsData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis />
						<Tooltip />
						<Area
							type="monotone"
							dataKey="views"
							stroke="#8b5cf6"
							fill="#8b5cf680"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default Overview;
