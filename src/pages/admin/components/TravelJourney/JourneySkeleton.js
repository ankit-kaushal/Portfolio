import React from "react";
import styles from "./styles.module.css";

const JourneySkeleton = () => {
	return (
		<div className={`${styles.journeyCard} ${styles.skeletonCard}`}>
			<div className={`${styles.skeletonImage} ${styles.skeleton}`} />
			<div className={styles.journeyContent}>
				<div className={`${styles.skeletonTitle} ${styles.skeleton}`} />
				<div
					className={`${styles.skeletonLocation} ${styles.skeleton}`}
				/>
				<div className={`${styles.skeletonDate} ${styles.skeleton}`} />
				<div
					className={`${styles.skeletonExpense} ${styles.skeleton}`}
				/>
				<div
					className={`${styles.skeletonDescription} ${styles.skeleton}`}
				/>
			</div>
			<div className={styles.cardActions}>
				<div
					className={`${styles.skeletonButton} ${styles.skeleton}`}
				/>
				<div
					className={`${styles.skeletonButton} ${styles.skeleton}`}
				/>
				<div
					className={`${styles.skeletonButton} ${styles.skeleton}`}
				/>
			</div>
		</div>
	);
};

export default JourneySkeleton;
