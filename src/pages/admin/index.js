import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faProjectDiagram,
	faUser,
	faSignOutAlt,
	faChartLine,
	faMountainCity,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./styles.module.css";
import AboutEdit from "./components/AboutEdit";
import ProjectsEdit from "./components/ProjectsEdit";
import axios from "axios";
import OTPInput from "./components/OTPInput";
import TravelJourney from "./components/TravelJourney";
import Overview from "./components/Overview";

const Admin = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
	const [activeSection, setActiveSection] = useState("overview");
	const [error, setError] = useState("");

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
			if (window.innerWidth <= 768) {
				setIsHovered(false);
			}
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const menuItems = [
		{ icon: faChartLine, text: "Overview", id: "overview" },
		{ icon: faUser, text: "About", id: "about" },
		{ icon: faProjectDiagram, text: "Projects", id: "projects" },
		{ icon: faMountainCity, text: "Travel", id: "travel" },
		{
			icon: faSignOutAlt,
			text: "Logout",
			id: "logout",
			onClick: () => setIsAuthenticated(false),
			className: styles.logoutItem,
		},
	];

	const renderContent = () => {
		switch (activeSection) {
			case "overview":
				return <Overview />;
			case "about":
				return <AboutEdit />;
			case "projects":
				return <ProjectsEdit />;
			case "travel":
				return <TravelJourney />;
			default:
				return <h3>Welcome to Admin Dashboard</h3>;
		}
	};

	const handleOTPComplete = async (code) => {
		try {
			const response = await axios.post(
				"https://api.ankitkaushal.in/validate",
				{
					token: code,
				},
				{
					headers: {
						Authorization: process.env.REACT_APP_AUTHKEY,
					},
				},
			);

			if (response.status === 200) {
				setIsAuthenticated(true);
				setError("");
			}
		} catch (error) {
			setError("Invalid authentication code");
		}
	};

	if (!isAuthenticated) {
		return (
			<div className={styles.loginContainer}>
				<div className={styles.loginForm}>
					<h2>Two-Factor Authentication</h2>
					<p className={styles.loginText}>
						Enter the code from your authenticator app
					</p>
					{error && <p className={styles.errorMessage}>{error}</p>}
					<OTPInput onComplete={handleOTPComplete} />
				</div>
			</div>
		);
	}

	return (
		<div
			className={`${styles.adminContainer} ${!isMobile && isHovered ? styles.sidebarExpanded : ""}`}
		>
			<div
				className={styles.sidebar}
				onMouseEnter={() => !isMobile && setIsHovered(true)}
				onMouseLeave={() => !isMobile && setIsHovered(false)}
			>
				<div className={styles.sidebarHeader}>
					<img
						src="https://res.cloudinary.com/dm4rbcqca/image/upload/v1742022944/logo_ma8a0c.png"
						alt="Profile"
						className={styles.profileImage}
					/>
				</div>
				<nav>
					<ul>
						{menuItems.map((item, index) => (
							<li
								key={index}
								onClick={() => {
									item.onClick
										? item.onClick()
										: setActiveSection(item.id);
								}}
								className={`${item.className || ""} ${
									activeSection === item.id
										? styles.active
										: ""
								}`}
							>
								<FontAwesomeIcon icon={item.icon} />
								<span className={styles.menuText}>
									{item.text}
								</span>
							</li>
						))}
					</ul>
				</nav>
			</div>
			<div className={styles.mainContent}>
				<div className={styles.contentArea}>
					{renderContent()}{" "}
					{/* Replace the hardcoded h3 with renderContent() */}
				</div>
			</div>
		</div>
	);
};

export default Admin;
