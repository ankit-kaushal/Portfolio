import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import AllProjects from "../components/projects/allProjects";

import INFO from "../data/user";
import SEO from "../data/seo";

import { useSelector } from "react-redux";

import ShootingStars from "../components/common/ShootingStars";

import "./styles/projects.css";

const Projects = () => {
	const data = useSelector((state) => state.data);

	const { user = {}, projects = [] } = data || {};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "projects");

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Projects | ${user?.name || INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<ShootingStars />
				<NavBar active="projects" />
				<div className="content-wrapper">
					<div className="projects-logo-container">
						<div className="projects-logo">
							<Logo width={46} user={user} />
						</div>
					</div>
					<div className="projects-container">
						<div className="title projects-title">
							Things I&apos;ve made trying to put my dent in the
							universe.
						</div>

						<div className="subtitle projects-subtitle">
							I&apos;ve worked on a variety of projects over the
							years and I&apos;m proud of the progress I&apos;ve
							made. Many of these projects are open-source and
							available for others to explore and contribute to.
							If you&apos;re interested in any of the projects
							I&apos;ve worked on, please feel free to check out
							the code and suggest any improvements or
							enhancements you might have in mind. Collaborating
							with others is a great way to learn and grow, and
							I&apos;m always open to new ideas and feedback.
						</div>

						<div className="projects-list">
							<AllProjects projects={projects} />
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

export default Projects;
