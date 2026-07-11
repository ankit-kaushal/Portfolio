import Project from "./project";
import INFO from "@/data/user";
import LOGO_MAPPING from "./logo-mapping";

import styles from "./allProjects.module.css";

export default function AllProjects({ projects = [] }) {
	return (
		<div className={styles.allProjectsContainer}>
			{projects.length ? (
				projects.map((project, index) => (
					<div className={styles.allProjectsProject} key={index}>
						<Project
							logo={
								LOGO_MAPPING[project?.mainStack.toLowerCase()]
							}
							title={project?.projectName}
							description={project?.projectDescription}
							liveDemo={project?.projectLink}
							githubLink={project?.projectGitHub}
							projectPicture={project?.projectPicture}
						/>
					</div>
				))
			) : (
				INFO.projects.map((project, index) => (
					<div className={styles.allProjectsProject} key={index}>
						<Project
							logo={project.logo}
							title={project.title}
							description={project.description}
							liveDemo={project.link}
						/>
					</div>
				))
			)}
		</div>
	);
}
