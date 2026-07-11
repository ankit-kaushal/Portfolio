"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import NavBar from "@/components/common/navBar";
import Footer from "@/components/common/footer";
import Logo from "@/components/common/logo";
import Article from "@/components/articles/article";
import ShootingStars from "@/components/common/ShootingStars";
import layoutStyles from "@/components/layout/layout.module.css";
import INFO from "@/data/user";
import myArticles from "@/data/articles";
import { apiUrl } from "@/lib/api";

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

export default function BlogsView() {
	const data = useSelector((state) => state.data);
	const { user = {}, blogs: storeBlogs = [] } = data || {};
	const [blogs, setBlogs] = useState(
		Array.isArray(storeBlogs) ? storeBlogs.map(toFeedItem) : [],
	);
	const [isLoading, setIsLoading] = useState(!storeBlogs.length);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				const [portfolioRes, profileRes] = await Promise.all([
					axios.get(apiUrl("/blogs")),
					axios.get(apiUrl("/profile")),
				]);

				const portfolio = (portfolioRes.data || []).map((blog) =>
					toFeedItem({ ...blog, source: "portfolio" }),
				);
				const medium = (profileRes.data?.mediumBlogs || []).map((blog) =>
					toFeedItem({ ...blog, source: "medium" }),
				);

				const merged = [...portfolio, ...medium].sort((a, b) => {
					return new Date(b.date || 0) - new Date(a.date || 0);
				});

				setBlogs(merged);
			} catch (error) {
				console.error("Error fetching blogs:", error);
				if (!blogs.length) {
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
			} finally {
				setIsLoading(false);
			}
		};

		fetchBlogs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
