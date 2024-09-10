import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

import "./style/article.css";

const formatDate = (dateString) => {
	const date = new Date(dateString);

	const day = date.getDate();
	const suffix = (day % 10 === 1 && day !== 11) ? 'st' : 
				   (day % 10 === 2 && day !== 12) ? 'nd' : 
				   (day % 10 === 3 && day !== 13) ? 'rd' : 'th';
  
	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
						"Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
	
	const month = monthNames[date.getMonth()];
	const year = date.getFullYear();
	
	return `${day}${suffix} ${month} ${year}`;
};

const Article = (props) => {
	const { date, title, description, link, image } = props;

	return (
		<React.Fragment>
			<div className="article">
				<Link to={link}>
					<div className="article-right-side">
						<div className="article-image" style={{ backgroundImage: `url(${image})` }}></div>
						<div className="article-title">{title}</div>
						<div className="article-description">{description}</div>
						<div className="article-flex">
							<div className="article-link">
								Read Article{" "}
								<FontAwesomeIcon
									style={{ fontSize: "10px" }}
									icon={faChevronRight}
								/>
							</div>
							<div className="article-date">{formatDate(date)}</div>
						</div>
					</div>
				</Link>
			</div>
		</React.Fragment>
	);
};

export default Article;
