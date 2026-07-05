import FaIcon from "@/components/common/FaIcon";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

import styles from "./project.module.css";

export default function Project({
	logo,
	title,
	description,
	projectPicture = "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
	githubLink,
	liveDemo,
}) {
	return (
		<div className={styles.project}>
			<div className={styles.projectContainer}>
				<div
					className={styles.projectBackground}
					style={{ backgroundImage: `url(${projectPicture})` }}
				/>

				<div className={styles.projectContent}>
					<div className={styles.projectHeader}>
						<div className={styles.projectLogo}>
							<Image
								src={logo}
								alt="logo"
								width={30}
								height={30}
								unoptimized
							/>
						</div>
						<div className={styles.projectTitle}>{title}</div>
					</div>
					<div className={styles.projectInfo}>
						<div className={styles.projectDescription}>
							{description}
						</div>
					</div>

					<div className={styles.projectLinks}>
						{liveDemo && (
							<a
								href={liveDemo}
								target="_blank"
								rel="noopener noreferrer"
								className={styles.projectLink}
							>
								<FaIcon icon={faExternalLinkAlt} />
								<span>Live Demo</span>
							</a>
						)}
						{githubLink && (
							<a
								href={githubLink}
								target="_blank"
								rel="noopener noreferrer"
								className={styles.projectLink}
							>
								<FaIcon icon={faGithub} />
								<span>GitHub</span>
							</a>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
