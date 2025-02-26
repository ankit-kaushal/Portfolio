import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
	faTwitter,
	faGithub,
	faLinkedin,
	faInstagram,
} from "@fortawesome/free-brands-svg-icons";

import INFO from "../../data/user";

import "./styles/socials.css";

const Socials = ({ social = {} }) => {
	return (
		<div className="socials">
			<div className="social">
				<a
					href={social?.twitter || INFO.socials.twitter}
					target="_blank"
					rel="noreferrer"
				>
					<div className="social-icon">
						<FontAwesomeIcon
							icon={faTwitter}
							className="social-icon"
						/>
					</div>
					<div className="social-text">Follow on Twitter</div>
				</a>
			</div>

			<div className="social">
				<a
					href={social?.github || INFO.socials.github}
					target="_blank"
					rel="noreferrer"
				>
					<div className="social-icon">
						<FontAwesomeIcon
							icon={faGithub}
							className="social-icon"
						/>
					</div>
					<div className="social-text">Follow on GitHub</div>
				</a>
			</div>

			<div className="social">
				<a
					href={social?.linkedin || INFO.socials.linkedin}
					target="_blank"
					rel="noreferrer"
				>
					<div className="social-icon">
						<FontAwesomeIcon
							icon={faLinkedin}
							className="social-icon"
						/>
					</div>
					<div className="social-text">Follow on LinkedIn</div>
				</a>
			</div>

			<div className="social">
				<a
					href={social?.instagram || INFO.socials.instagram}
					target="_blank"
					rel="noreferrer"
				>
					<div className="social-icon">
						<FontAwesomeIcon
							icon={faInstagram}
							className="social-icon"
						/>
					</div>
					<div className="social-text">Follow on Instagram</div>
				</a>
			</div>

			<div className="email">
				<div className="email-wrapper">
					<a
						href={`mailto:${social?.email || INFO.main.email}`}
						target="_blank"
						rel="noreferrer"
					>
						<div className="social-icon">
							<FontAwesomeIcon icon={faEnvelope} />
						</div>

						<div className="social-text">
							{social?.email || INFO.main.email}
						</div>
					</a>
				</div>
			</div>

			<div className="social">
				<a
					href={INFO.socials.travelJourney}
					target="_blank"
					rel="noreferrer"
				>
					<div className="social-icon">
						<img
							src="/journey.png"
							alt="Travel Route"
							className="journey-icon"
						/>
					</div>
					<div className="social-text">Explore my Travel Journey</div>
				</a>
			</div>
		</div>
	);
};

export default Socials;
