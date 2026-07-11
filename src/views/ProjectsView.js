"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";

import NavBar from "@/components/common/navBar";
import Footer from "@/components/common/footer";
import Logo from "@/components/common/logo";
import AllProjects from "@/components/projects/allProjects";
import ShootingStars from "@/components/common/ShootingStars";
import layoutStyles from "@/components/layout/layout.module.css";

import styles from "./projects.module.css";

export default function ProjectsView() {
	const data = useSelector((state) => state.data);
	const { user = {}, projects = [] } = data || {};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className={layoutStyles.pageContent}>
			<ShootingStars />
			<NavBar active="projects" />
			<div className={layoutStyles.contentWrapper}>
				<div className={styles.logoContainer}>
					<div className={styles.logo}>
						<Logo width={46} user={user} />
					</div>
				</div>
				<div className={styles.container}>
					<div className={layoutStyles.title}>
						Things I&apos;ve made trying to put my dent in the
						universe.
					</div>
					<div
						className={`${layoutStyles.subtitle} ${styles.subtitle}`}
					>
						I&apos;ve worked on a variety of projects over the
						years and I&apos;m proud of the progress I&apos;ve made.
						Many of these projects are open-source and available
						for others to explore and contribute to. If you&apos;re
						interested in any of the projects I&apos;ve worked on,
						please feel free to check out the code and suggest any
						improvements or enhancements you might have in mind.
						Collaborating with others is a great way to learn and
						grow, and I&apos;m always open to new ideas and
						feedback.
					</div>
					<div className={styles.list}>
						<AllProjects projects={projects} />
					</div>
				</div>
				<div className={layoutStyles.pageFooter}>
					<Footer user={user} />
				</div>
			</div>
		</div>
	);
}
