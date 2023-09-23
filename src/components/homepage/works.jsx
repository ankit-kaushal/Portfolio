import React from "react";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";

import Card from "../common/card";

import "./styles/works.css";

const Works = () => {
	return (
		<div className="works">
			<Card
				icon={faBriefcase}
				title="Work"
				body={
					<div className="works-body">
						<div className="work">
							<img
								src="./cogoport.jpeg"
								alt="Cogoport"
								className="work-image"
							/>
							<div className="work-title">Cogoport Pvt. Ltd.</div>
							<div className="work-subtitle">
								Software Development Engineer I
							</div>
							<div className="work-duration">Jan 2022 - Present</div>
						</div>

						<div className="work">
							<img
								src="./kohli.jpeg"
								alt="Kohli Media LLP"
								className="work-image"
							/>
							<div className="work-title">Kohli Media LLP.</div>
							<div className="work-subtitle">
								Software Engineer
							</div>
							<div className="work-duration">June 2020 - Dec 2021</div>
						</div>
					</div>
				}
			/>
		</div>
	);
};

export default Works;
