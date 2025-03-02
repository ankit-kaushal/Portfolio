import React from "react";

import Project from "./project";

import INFO from "../../data/user";

import LOGO_MAPPING from "./logo-mapping";

import "./styles/allProjects.css";

const AllProjects = ({ projects = [] }) => {
	return (
		<div className="all-projects-container">
			{projects.length ? (
				<>
					{projects?.map((project, index) => (
						<div className="all-projects-project" key={index}>
							<Project
								logo={
									LOGO_MAPPING[
										project?.mainStack.toLowerCase()
									]
								}
								title={project?.projectName}
								description={project?.projectDescription}
								linkText="View Project"
								link={project?.projectLink}
							/>
						</div>
					))}
				</>
			) : (
				<>
					{INFO.projects.map((project, index) => (
						<div className="all-projects-project" key={index}>
							<Project
								logo={project.logo}
								title={project.title}
								description={project.description}
								linkText={project.linkText}
								link={project.link}
							/>
						</div>
					))}
				</>
			)}
		</div>
	);
};

export default AllProjects;
