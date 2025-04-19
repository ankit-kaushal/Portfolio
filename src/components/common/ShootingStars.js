import React from "react";
import "./styles/ShootingStars.css";

const ShootingStars = () => {
	return (
		<>
			<div className="starry-background">
				{[...Array(100)].map((_, i) => (
					<div key={i} className="background-star"></div>
				))}
			</div>
			<div className="shooting-stars">
				<div className="star"></div>
				<div className="star"></div>
				<div className="star"></div>
				{/* <div className="star"></div>
				<div className="star"></div> */}
			</div>
		</>
	);
};

export default ShootingStars;
