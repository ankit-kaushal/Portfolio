import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faStar as faStarSolid,
	faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import styles from "./styles.module.css";

const StarRating = ({ rating, onRatingChange }) => {
	const [hoverRating, setHoverRating] = useState(0);

	const handleMouseMove = (e, index) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const width = rect.width;
		const x = e.clientX - rect.left;
		const isHalf = x < width / 2;
		setHoverRating(index + (isHalf ? 0.5 : 1));
	};

	const handleClick = (e, index) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const width = rect.width;
		const x = e.clientX - rect.left;
		const isHalf = x < width / 2;
		onRatingChange(index + (isHalf ? 0.5 : 1));
	};

	const renderStar = (index) => {
		const value = hoverRating || rating;
		const isHalf = value - index === 0.5;
		const isFilled = value >= index + 1;

		return (
			<div
				key={index}
				className={styles.star}
				onMouseMove={(e) => handleMouseMove(e, index)}
				onClick={(e) => handleClick(e, index)}
			>
				<FontAwesomeIcon
					icon={
						isHalf
							? faStarHalfAlt
							: isFilled
								? faStarSolid
								: faStarRegular
					}
					className={isFilled || isHalf ? styles.filled : ""}
				/>
			</div>
		);
	};

	return (
		<div
			className={styles.starRating}
			onMouseLeave={() => setHoverRating(0)}
		>
			{[...Array(5)].map((_, index) => renderStar(index))}
			<span className={styles.ratingValue}>
				{hoverRating || rating || 0}
			</span>
		</div>
	);
};

export default StarRating;
