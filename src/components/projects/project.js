import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

import "./styles/project.css";

const Project = (props) => {
	const {
		logo,
		title,
		description,
		projectPicture = "https://images.unsplash.com/photo-1587620962725-abab7fe55159", // default tech image
		githubLink,
		liveDemo,
	} = props;

	return (
		<div className="project">
			<div className="project-container">
				<div
					className="project-background"
					style={{ backgroundImage: `url(${projectPicture})` }}
				/>

				<div className="project-content">
					<div className="project-header">
						<div className="project-logo">
							<img src={logo} alt="logo" />
						</div>
						<div className="project-title">{title}</div>
					</div>
					<div className="project-info">
						<div className="project-description">{description}</div>
					</div>

					<div className="project-links">
						{liveDemo && (
							<a
								href={liveDemo}
								target="_blank"
								rel="noopener noreferrer"
								className="project-link"
							>
								<FontAwesomeIcon icon={faExternalLinkAlt} />
								<span>Live Demo</span>
							</a>
						)}
						{githubLink && (
							<a
								href={githubLink}
								target="_blank"
								rel="noopener noreferrer"
								className="project-link"
							>
								<FontAwesomeIcon icon={faGithub} />
								<span>GitHub</span>
							</a>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Project;
