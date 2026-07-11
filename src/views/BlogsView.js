"use client";

import { useEffect, useState } from "react";
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

function getPortfolioPreview(blog) {
	const description =
		blog.excerpt ||
		(blog.content || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

	return {
		description:
			description.length > 140
				? `${description.slice(0, 140)}...`
				: description,
		imageUrl: blog.coverImage || "",
	};
}

function getMediumPreview(blog) {
	const description =
		blog.excerpt ||
		(blog.description || "")
			.replace(/<[^>]*>/g, " ")
			.replace(/\s+/g, " ")
			.trim();

	const imageUrl =
		blog.coverImage ||
		blog.description?.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ||
		"";

	return {
		description:
			description.length > 140
				? `${description.slice(0, 140)}...`
				: description,
		imageUrl,
	};
}

function toFeedItem(item) {
	if (item.source === "medium" || item.link?.includes("medium.com")) {
		const preview = getMediumPreview(item);
		return {
			id: item.id || item.guid || item.link,
			title: item.title,
			date: item.publishedAt || item.pubDate,
			description: preview.description,
			image: preview.imageUrl,
			link: item.link,
			internal: false,
			source: "medium",
		};
	}

	const preview = getPortfolioPreview(item);
	return {
		id: item.id || item._id,
		title: item.title,
		date: item.publishedAt || item.createdAt,
		description: preview.description,
		image: preview.imageUrl,
		link: item.link || `/blogs/${item.slug}`,
		internal: true,
		source: "portfolio",
	};
}

function buildBlogFeed(data) {
	if (Array.isArray(data?.blogs) && data.blogs.length) {
		return data.blogs.map(toFeedItem);
	}

	const portfolio = (data?.portfolioBlogs || []).map((blog) =>
		toFeedItem({ ...blog, source: "portfolio" }),
	);
	const medium = (data?.mediumBlogs || []).map((blog) =>
		toFeedItem({ ...blog, source: "medium" }),
	);

	return [...portfolio, ...medium].sort(
		(a, b) => new Date(b.date || 0) - new Date(a.date || 0),
	);
}

export default function BlogsView() {
	const data = useSelector((state) => state.data);
	const { user = {} } = data || {};
	const [blogs, setBlogs] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		if (!data) return;

		const feed = buildBlogFeed(data);
		if (feed.length) {
			setBlogs(feed);
		} else {
			setBlogs(
				myArticles.map((articleFn, index) => {
					const article = articleFn();
					return {
						id: `static-${index}`,
						title: article.title,
						date: article.date,
						description: article.description,
						image: "",
						link: article.link,
						internal: false,
						source: "medium",
					};
				}),
			);
		}
		setIsLoading(false);
	}, [data]);

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
					<div className={`${layoutStyles.title} ${styles.articlesTitle}`}>
						{INFO.blogs.title}
					</div>
					<div
						className={`${layoutStyles.subtitle} ${styles.articlesSubtitle}`}
					>
						{INFO.blogs.description}
					</div>

					<div className={styles.wrapper}>
						{isLoading ? (
							<div className={styles.emptyState}>Loading blogs...</div>
						) : blogs.length ? (
							blogs.map((blog) => (
								<div className={styles.articleItem} key={blog.id}>
									<div className={styles.sourceBadge}>
										{blog.source === "medium" ? "Medium" : "Portfolio"}
									</div>
									<Article
										date={blog.date}
										title={blog.title}
										description={blog.description}
										image={blog.image}
										link={blog.link}
										internal={blog.internal}
									/>
								</div>
							))
						) : (
							<div className={styles.emptyState}>
								No blogs published yet.
							</div>
						)}
					</div>
				</div>
				<div className={layoutStyles.pageFooter}>
					<Footer user={user} />
				</div>
			</div>
		</div>
	);
}
