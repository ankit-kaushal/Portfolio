"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import FaIcon from "@/components/common/FaIcon";
import { faArrowRight, faMountainSun } from "@fortawesome/free-solid-svg-icons";

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

function formatDate(dateString) {
	if (!dateString) return "";
	return new Date(dateString).toLocaleDateString("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
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

	const latest = blogs[0] || null;
	const rest = useMemo(() => blogs.slice(1), [blogs]);

	const featuredInner = latest ? (
		<>
			{latest.image ? (
				<div
					className={styles.featuredMedia}
					style={{ backgroundImage: `url(${latest.image})` }}
					aria-hidden="true"
				/>
			) : (
				<div
					className={`${styles.featuredMedia} ${styles.featuredMediaFallback}`}
					aria-hidden="true"
				/>
			)}
			<div className={styles.featuredBody}>
				<div className={styles.featuredMeta}>
					<span className={styles.latestLabel}>Latest</span>
					<span>
						{latest.source === "medium" ? "Medium" : "Portfolio"}
					</span>
					<span>{formatDate(latest.date)}</span>
				</div>
				<h2 className={styles.featuredTitle}>{latest.title}</h2>
				<p className={styles.featuredExcerpt}>{latest.description}</p>
				<span className={styles.featuredCta}>
					Read article <FaIcon icon={faArrowRight} />
				</span>
			</div>
		</>
	) : null;

	return (
		<div className={layoutStyles.pageContent}>
			<ShootingStars />
			<NavBar active="blogs" />

			<div className={layoutStyles.contentWrapper}>
				<div className={styles.logoContainer}>
					<div className={styles.logo}>
						<Logo width={46} user={user} />
					</div>
				</div>

				<section className={styles.hero} aria-label="Blog intro">
					<div className={styles.heroCopy}>
						<h1 className={styles.scriptTitle}>
							<span className={styles.scriptLine1}>
								{INFO.blogs.titleLine1}
							</span>{" "}
							<span className={styles.scriptLine2}>
								{INFO.blogs.titleLine2}
							</span>
						</h1>
						<p className={styles.heroTagline}>{INFO.blogs.tagline}</p>
						<span className={styles.brushUnderline} aria-hidden="true" />
						<Link href="/travel-journey" className={styles.heroTravelCta}>
							<FaIcon icon={faMountainSun} />
							Travel journeys
						</Link>
					</div>

					<div className={styles.heroFeatured} id="latest-post">
						{isLoading ? (
							<div className={styles.featuredSkeleton} aria-hidden="true" />
						) : latest?.internal ? (
							<Link href={latest.link} className={styles.featured}>
								{featuredInner}
							</Link>
						) : latest ? (
							<a
								href={latest.link}
								target="_blank"
								rel="noreferrer"
								className={styles.featured}
							>
								{featuredInner}
							</a>
						) : (
							<div className={styles.emptyState}>No blogs published yet.</div>
						)}
					</div>
				</section>

				<div className={styles.mainContainer}>
					{!isLoading && rest.length > 0 ? (
						<section className={styles.moreSection} aria-label="More writing">
							<h2 className={styles.sectionHeading}>More writing</h2>
							<div className={styles.wrapper}>
								{rest.map((blog) => (
									<div className={styles.articleItem} key={blog.id}>
										<Article
											date={blog.date}
											title={blog.title}
											description={blog.description}
											image={blog.image}
											link={blog.link}
											internal={blog.internal}
											badge={
												blog.source === "medium"
													? "Medium"
													: "Portfolio"
											}
										/>
									</div>
								))}
							</div>
						</section>
					) : null}
				</div>

				<div className={layoutStyles.pageFooter}>
					<Footer user={user} />
				</div>
			</div>
		</div>
	);
}
