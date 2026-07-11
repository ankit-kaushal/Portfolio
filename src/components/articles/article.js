import FaIcon from "@/components/common/FaIcon";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import styles from "./article.module.css";

const formatDate = (dateString) => {
	const date = new Date(dateString);

	const day = date.getDate();
	const suffix =
		day % 10 === 1 && day !== 11
			? "st"
			: day % 10 === 2 && day !== 12
				? "nd"
				: day % 10 === 3 && day !== 13
					? "rd"
					: "th";

	const monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sept",
		"Oct",
		"Nov",
		"Dec",
	];

	const month = monthNames[date.getMonth()];
	const year = date.getFullYear();

	return `${day}${suffix} ${month} ${year}`;
};

export default function Article({
	date,
	title,
	description,
	link,
	image,
	internal = false,
}) {
	const content = (
		<div className={styles.articleRightSide}>
			{image && (
				<div
					className={styles.articleImage}
					style={{ backgroundImage: `url(${image})` }}
				/>
			)}
			<div className={styles.articleTitle}>{title}</div>
			<div className={styles.articleDescription}>{description}</div>
			<div className={styles.articleFlex}>
				<div className={styles.articleLink}>
					Read Article{" "}
					<FaIcon style={{ fontSize: "10px" }} icon={faChevronRight} />
				</div>
				<div className={styles.articleDate}>{formatDate(date)}</div>
			</div>
		</div>
	);

	return (
		<div className={styles.article}>
			{internal ? (
				<Link href={link}>{content}</Link>
			) : (
				<a href={link} target="_blank" rel="noreferrer">
					{content}
				</a>
			)}
		</div>
	);
}
