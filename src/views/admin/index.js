"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import {
	Flex,
	Box,
	Text,
	Alert,
	ThemeToggle,
	Avatar,
} from "uiplex";
import FaIcon from "@/components/common/FaIcon";
import {
	faProjectDiagram,
	faUser,
	faSignOutAlt,
	faChartLine,
	faMountainCity,
	faBook,
	faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import { apiUrl, getAuthHeaders } from "@/lib/api";
import AdminProvider from "./components/AdminProvider";
import OTPInput from "./components/OTPInput";
import { useAdminSession } from "./hooks/useAdminSession";
import Overview from "./components/Overview";
import AboutEdit from "./components/AboutEdit";
import ProjectsEdit from "./components/ProjectsEdit";
import TravelJourney from "./components/TravelJourney";
import DiaryEdit from "./components/DiaryEdit";
import BlogsEdit from "./components/BlogsEdit";
import styles from "./admin.module.css";

const SECTION_META = {
	overview: { title: "Overview", description: "Portfolio stats at a glance" },
	about: { title: "About", description: "Update your profile information" },
	projects: { title: "Projects", description: "Manage portfolio projects" },
	blogs: { title: "Blogs", description: "Create and manage website blogs" },
	travel: { title: "Travel", description: "Manage travel journeys" },
	diary: { title: "Diary", description: "Private diary entries" },
};

const MENU_ITEMS = [
	{ icon: faChartLine, text: "Overview", id: "overview" },
	{ icon: faUser, text: "About", id: "about" },
	{ icon: faProjectDiagram, text: "Projects", id: "projects" },
	{ icon: faNewspaper, text: "Blogs", id: "blogs" },
	{ icon: faMountainCity, text: "Travel", id: "travel" },
	{ icon: faBook, text: "Diary", id: "diary" },
];

function AdminContent() {
	const searchParams = useSearchParams();
	const { isAuthenticated, isSessionChecked, login, logout } = useAdminSession();
	const [activeSection, setActiveSection] = useState("overview");
	const [error, setError] = useState("");

	useEffect(() => {
		const section = searchParams.get("section");
		if (section && SECTION_META[section]) {
			setActiveSection(section);
		}
	}, [searchParams]);

	const handleOTPComplete = async (code) => {
		try {
			const response = await axios.post(
				apiUrl("/validate"),
				{ token: code },
				{ headers: getAuthHeaders() },
			);

			if (response.status === 200) {
				login();
				setError("");
			}
		} catch {
			setError("Invalid authentication code");
		}
	};

	if (!isSessionChecked) {
		return null;
	}

	const renderContent = () => {
		switch (activeSection) {
			case "overview":
				return <Overview />;
			case "about":
				return <AboutEdit />;
			case "projects":
				return <ProjectsEdit />;
			case "blogs":
				return <BlogsEdit />;
			case "travel":
				return <TravelJourney />;
			case "diary":
				return <DiaryEdit />;
			default:
				return <Text>Welcome to Admin Dashboard</Text>;
		}
	};

	if (!isAuthenticated) {
		return (
			<Box className={`${styles.adminRoot} ${styles.loginPage}`}>
				<Box className={styles.loginCard}>
					<Text className={styles.loginTitle}>Admin Login</Text>
					<Text className={styles.loginText}>
						Enter the 6-digit code from your authenticator app
					</Text>
					{error && (
						<Box marginBottom="1rem">
							<Alert variant="error">{error}</Alert>
						</Box>
					)}
					<OTPInput onComplete={handleOTPComplete} />
				</Box>
			</Box>
		);
	}

	const section = SECTION_META[activeSection];

	return (
		<Flex className={`${styles.adminRoot} ${styles.shell}`}>
			<Box as="aside" className={styles.sidebar}>
				<Box className={styles.sidebarHeader}>
					<Box className={styles.brandRow}>
						<Box className={styles.brand}>
							<Avatar
								src="https://res.cloudinary.com/dm4rbcqca/image/upload/v1742022944/logo_ma8a0c.png"
								alt="Admin"
								size="md"
							/>
							<Box className={styles.brandText}>
								<Text className={styles.brandTitle}>Portfolio</Text>
								<Text className={styles.brandSubtitle}>Admin Panel</Text>
							</Box>
						</Box>
						<ThemeToggle />
					</Box>
				</Box>

				<nav className={styles.nav}>
					{MENU_ITEMS.map((item) => (
						<button
							key={item.id}
							type="button"
							className={`${styles.navItem} ${
								activeSection === item.id ? styles.navItemActive : ""
							}`}
							onClick={() => setActiveSection(item.id)}
						>
							<FaIcon icon={item.icon} />
							<span>{item.text}</span>
						</button>
					))}
					<button
						type="button"
						className={`${styles.navItem} ${styles.navItemLogout}`}
						onClick={logout}
					>
						<FaIcon icon={faSignOutAlt} />
						<span>Logout</span>
					</button>
				</nav>
			</Box>

			<Box as="main" className={styles.main}>
				<Box className={styles.contentCard}>
					<Box marginBottom="1.5rem">
						<Text size="xl" weight="bold" className={styles.pageTitle}>
							{section.title}
						</Text>
						<Text size="sm" className={styles.pageDescription}>
							{section.description}
						</Text>
					</Box>
					{renderContent()}
				</Box>
			</Box>
		</Flex>
	);
}

export default function Admin() {
	return (
		<AdminProvider>
			<AdminContent />
		</AdminProvider>
	);
}
