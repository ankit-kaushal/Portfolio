import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faProjectDiagram,
	faBlog,
	faEnvelope,
	faCog,
	faUser,
	faSignOutAlt,
	faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./styles.module.css";
import AboutEdit from "./components/AboutEdit";

const Admin = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});

	const handleLogin = (e) => {
		e.preventDefault();
		if (
			credentials.username === process.env.REACT_APP_ADMIN_USER &&
			credentials.password === process.env.REACT_APP_ADMIN_PASS
		) {
			setIsAuthenticated(true);
		}
	};

	const [activeSection, setActiveSection] = useState("overview");

	const menuItems = [
		{ icon: faChartLine, text: "Overview", id: "overview" },
		{ icon: faUser, text: "About", id: "about" },
		{ icon: faProjectDiagram, text: "Projects", id: "projects" },
		{ icon: faBlog, text: "Blog Posts", id: "blogs" },
		{ icon: faEnvelope, text: "Messages", id: "messages" },
		{ icon: faCog, text: "Settings", id: "settings" },
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
			case "about":
				return <AboutEdit />;
			default:
				return <h3>Welcome to Admin Dashboard</h3>;
		}
	};

	if (!isAuthenticated) {
		return (
			<div className={styles.loginContainer}>
				<form className={styles.loginForm} onSubmit={handleLogin}>
					<h2>Welcome Back</h2>
					<div className={styles.inputGroup}>
						<input
							type="text"
							placeholder="Username"
							value={credentials.username}
							onChange={(e) =>
								setCredentials({
									...credentials,
									username: e.target.value,
								})
							}
						/>
					</div>
					<div className={styles.inputGroup}>
						<input
							type="password"
							placeholder="Password"
							value={credentials.password}
							onChange={(e) =>
								setCredentials({
									...credentials,
									password: e.target.value,
								})
							}
						/>
					</div>
					<button type="submit">Login</button>
				</form>
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
								className={`${item.className} ${activeSection === item.id ? styles.active : ""}`}
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
