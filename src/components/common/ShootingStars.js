"use client";

import styles from "./ShootingStars.module.css";

export default function ShootingStars() {
	return (
		<>
			<div className={styles.starryBackground}>
				{[...Array(100)].map((_, i) => (
					<div key={i} className={styles.backgroundStar} />
				))}
			</div>
			<div className={styles.shootingStars}>
				<div className={styles.star} />
				<div className={styles.star} />
				<div className={styles.star} />
			</div>
		</>
	);
}
