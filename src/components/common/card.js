"use client";

import FaIcon from "@/components/common/FaIcon";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons/faBriefcase";

import styles from "./card.module.css";

export default function Card({ title, body }) {
	return (
		<div className={styles.card}>
			<div className={styles.cardContainer}>
				<div className={styles.cardHeader}>
					<div className={styles.cardIcon}>
						<FaIcon icon={faBriefcase} />
					</div>
					<div className={styles.cardTitle}>{title}</div>
				</div>
				<div className={styles.cardBody}>
					<div className={styles.cardText}>{body}</div>
				</div>
			</div>
		</div>
	);
}
