"use client";

import Link from "next/link";
import Image from "next/image";
import FaIcon from "@/components/common/FaIcon";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
	faTwitter,
	faGithub,
	faLinkedin,
	faInstagram,
} from "@fortawesome/free-brands-svg-icons";

import INFO from "@/data/user";

import styles from "./socials.module.css";

export default function Socials({ social = {} }) {
	return (
		<div className={styles.socials}>
			<div className={styles.social}>
				<a
					href={social?.twitter || INFO.socials.twitter}
					target="_blank"
					rel="noreferrer"
				>
					<div className={styles.socialIcon}>
						<FaIcon icon={faTwitter} />
					</div>
					<div className={styles.socialText}>Follow on Twitter</div>
				</a>
			</div>

			<div className={styles.social}>
				<a
					href={social?.github || INFO.socials.github}
					target="_blank"
					rel="noreferrer"
				>
					<div className={styles.socialIcon}>
						<FaIcon icon={faGithub} />
					</div>
					<div className={styles.socialText}>Follow on GitHub</div>
				</a>
			</div>

			<div className={styles.social}>
				<a
					href={social?.linkedin || INFO.socials.linkedin}
					target="_blank"
					rel="noreferrer"
				>
					<div className={styles.socialIcon}>
						<FaIcon icon={faLinkedin} />
					</div>
					<div className={styles.socialText}>Follow on LinkedIn</div>
				</a>
			</div>

			<div className={styles.social}>
				<a
					href={social?.instagram || INFO.socials.instagram}
					target="_blank"
					rel="noreferrer"
				>
					<div className={styles.socialIcon}>
						<FaIcon icon={faInstagram} />
					</div>
					<div className={styles.socialText}>Follow on Instagram</div>
				</a>
			</div>

			<div className={styles.email}>
				<div className={styles.emailWrapper}>
					<a
						href={`mailto:${social?.email || INFO.main.email}`}
						target="_blank"
						rel="noreferrer"
					>
						<div className={styles.socialIcon}>
							<FaIcon icon={faEnvelope} />
						</div>
						<div className={styles.socialText}>
							{social?.email || INFO.main.email}
						</div>
					</a>
				</div>
			</div>

			<div className={styles.social}>
				<Link href={INFO.socials.travelJourney}>
					<div className={styles.socialIcon}>
						<Image
							src="/journey.png"
							alt="Travel Route"
							className={styles.journeyIcon}
							width={24}
							height={24}
						/>
					</div>
					<div className={styles.socialText}>
						Explore my Travel Journey
					</div>
				</Link>
			</div>
		</div>
	);
}
