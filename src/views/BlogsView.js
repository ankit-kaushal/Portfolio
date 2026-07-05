"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";

import NavBar from "@/components/common/navBar";
import Footer from "@/components/common/footer";
import Logo from "@/components/common/logo";
import Article from "@/components/articles/article";
import ShootingStars from "@/components/common/ShootingStars";
import layoutStyles from "@/components/layout/layout.module.css";
import INFO from "@/data/user";
import myArticles from "@/data/articles";

import styles from "./blogs.module.css";

export default function BlogsView() {
	const data = useSelector((state) => state.data);
	const { user = {}, blogs = [] } = data || {};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const parseBlogPreview = (description) => {
		if (typeof window === "undefined") return { description: "", imageUrl: "" };

		const parser = new DOMParser();
		const doc = parser.parseFromString(description, "text/html");
		const firstParagraph = doc.querySelector("p");
		let text = firstParagraph ? firstParagraph.textContent : "";
		const maxLength = 100;
		if (text.length > maxLength) {
			text = text.slice(0, maxLength) + "...";
		}
		const firstImage = doc.querySelector("img");
		const imageUrl = firstImage ? firstImage.getAttribute("src") : "";
		return { description: text, imageUrl };
	};

	return (
		<div className={layoutStyles.pageContent}>
			<ShootingStars />
			<NavBar active="blogs" />
			<div className={layoutStyles.contentWrapper}>
				<div className={styles.logoContainer}>
					<div className={styles.logo}>
						<Logo width={46} />
					</div>
				</div>

				<div className={styles.mainContainer}>
					<div
						className={`${layoutStyles.title} ${styles.articlesTitle}`}
					>
						{INFO.blogs.title}
					</div>
					<div
						className={`${layoutStyles.subtitle} ${styles.articlesSubtitle}`}
					>
						{INFO.blogs.description}
					</div>

					<div className={styles.wrapper}>
						{blogs.length
							? blogs.map((blog) => {
									const { description, imageUrl } =
										parseBlogPreview(blog.description);
									return (
										<div
											className={styles.articleItem}
											key={blog.guid}
										>
											<Article
												date={blog.pubDate}
												title={blog.title}
												description={description}
												image={imageUrl}
												link={blog.link}
											/>
										</div>
									);
								})
							: myArticles.map((article, index) => (
									<div
										className={styles.articleItem}
										key={(index + 1).toString()}
									>
										<Article
											date={article().date}
											title={article().title}
											description={article().description}
											link={article().link}
										/>
									</div>
								))}
					</div>
				</div>
				<div className={layoutStyles.pageFooter}>
					<Footer user={user} />
				</div>
			</div>
		</div>
	);
}
