"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

import NavBar from "@/components/common/navBar";
import Footer from "@/components/common/footer";
import Logo from "@/components/common/logo";
import ShootingStars from "@/components/common/ShootingStars";
import layoutStyles from "@/components/layout/layout.module.css";
import { getReadingMinutes, stripHtml } from "@/lib/server/utils/blog";
import styles from "./blogDetail.module.css";

function findPortfolioBlog(data, slug) {
	const candidates = [
		...(data?.portfolioBlogs || []),
		...(data?.blogs || []).filter(
			(blog) => blog.source === "portfolio" || blog.slug || blog.content,
		),
	];

	return candidates.find(
		(blog) => blog.slug === slug || blog.link === `/blogs/${slug}`,
	);
}

function slugifyHeading(text = "", index = 0) {
	const base = text
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");

	return base || `section-${index + 1}`;
}

function decodeEntities(text = "") {
	return text
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&nbsp;/g, " ");
}

function extractHeadingsFromHtml(html = "") {
	const matches = [...html.matchAll(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi)];
	const usedIds = new Set();

	return matches
		.map((match, index) => {
			const text = decodeEntities(stripHtml(match[2] || "")).trim();
			if (!text) return null;

			let id = slugifyHeading(text, index);
			let suffix = 2;
			while (usedIds.has(id)) {
				id = `${slugifyHeading(text, index)}-${suffix}`;
				suffix += 1;
			}
			usedIds.add(id);

			return {
				id,
				text,
				level: Number(match[1]),
			};
		})
		.filter(Boolean);
}

function injectHeadingIds(html = "", headings = []) {
	if (!html || !headings.length) return html;

	let index = 0;
	return html.replace(/<h([23])([^>]*)>/gi, (full, level, attrs) => {
		const heading = headings[index];
		index += 1;
		if (!heading) return full;
		if (/\sid\s*=/.test(attrs)) return full;
		return `<h${level}${attrs} id="${heading.id}">`;
	});
}

export default function BlogDetailView({ slug, initialBlog = null }) {
	const data = useSelector((state) => state.data);
	const { user = {} } = data || {};
	const [blog, setBlog] = useState(initialBlog);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(!initialBlog);
	const [activeId, setActiveId] = useState("");

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		if (!slug) return;

		if (!data) {
			if (!initialBlog) setIsLoading(true);
			return;
		}

		const matched = findPortfolioBlog(data, slug);
		if (matched) {
			setBlog(matched);
			setError("");
		} else if (initialBlog) {
			setBlog(initialBlog);
			setError("");
		} else {
			setBlog(null);
			setError("Blog not found");
		}
		setIsLoading(false);
	}, [data, slug, initialBlog]);

	const readingMinutes = blog
		? getReadingMinutes(blog.content || blog.excerpt || "")
		: 0;

	const { contentHtml, headings } = useMemo(() => {
		const raw = blog?.content || "";
		if (!raw) return { contentHtml: "", headings: [] };

		const list = extractHeadingsFromHtml(raw);
		return {
			contentHtml: injectHeadingIds(raw, list),
			headings: list,
		};
	}, [blog?.content]);

	useEffect(() => {
		if (!headings.length) {
			setActiveId("");
			return undefined;
		}

		let frame = 0;

		const updateActiveHeading = () => {
			const offset = Math.round(window.innerHeight * 0.28);
			let currentId = headings[0]?.id || "";

			for (const item of headings) {
				const el = document.getElementById(item.id);
				if (!el) continue;
				const top = el.getBoundingClientRect().top;
				if (top - offset <= 0) {
					currentId = item.id;
				} else {
					break;
				}
			}

			if (currentId) {
				setActiveId((prev) => (prev === currentId ? prev : currentId));
			}
		};

		const onScroll = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(updateActiveHeading);
		};

		// Wait a tick so heading ids from innerHTML are in the DOM
		const ready = window.setTimeout(() => {
			updateActiveHeading();
			window.addEventListener("scroll", onScroll, { passive: true });
			window.addEventListener("resize", onScroll);
		}, 0);

		return () => {
			window.clearTimeout(ready);
			cancelAnimationFrame(frame);
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, [headings, contentHtml]);

	const scrollToHeading = (id) => {
		const el = document.getElementById(id);
		if (!el) return;
		setActiveId(id);
		const top =
			el.getBoundingClientRect().top + window.scrollY - 88;
		window.scrollTo({ top, behavior: "smooth" });
	};

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

				<div className={styles.mainContainer}>
					{isLoading ? (
						<p className={styles.status}>Loading...</p>
					) : error ? (
						<p className={styles.status}>{error}</p>
					) : blog ? (
						<div
							className={`${styles.layout} ${
								headings.length > 0 ? styles.layoutWithToc : ""
							}`}
						>
							<article className={styles.article}>
								<Link href="/blogs" className={styles.backLink}>
									← Back to blogs
								</Link>

								<header className={styles.header}>
									<h1 className={styles.title}>{blog.title}</h1>
									<div className={styles.meta}>
										<time
											dateTime={
												blog.publishedAt ||
												blog.createdAt ||
												undefined
											}
										>
											{new Date(
												blog.publishedAt || blog.createdAt,
											).toLocaleDateString("en-US", {
												day: "numeric",
												month: "short",
												year: "numeric",
											})}
										</time>
										<span
											className={styles.metaDot}
											aria-hidden="true"
										>
											·
										</span>
										<span>{readingMinutes} min read</span>
										{blog.tags?.length > 0 && (
											<>
												<span
													className={styles.metaDot}
													aria-hidden="true"
												>
													·
												</span>
												<span>{blog.tags.join(" · ")}</span>
											</>
										)}
									</div>
								</header>

								{blog.coverImage ? (
									<img
										src={blog.coverImage}
										alt={blog.title}
										className={styles.coverImage}
									/>
								) : null}

								{contentHtml ? (
									<div
										className={styles.content}
										dangerouslySetInnerHTML={{
											__html: contentHtml,
										}}
									/>
								) : blog.excerpt ? (
									<p className={styles.content}>{blog.excerpt}</p>
								) : null}
							</article>

							{headings.length > 0 ? (
								<aside className={styles.toc} aria-label="On this page">
									<p className={styles.tocLabel}>On this page</p>
									<nav className={styles.tocNav}>
										{headings.map((item) => (
											<button
												key={item.id}
												type="button"
												className={`${styles.tocItem} ${
													item.level === 3
														? styles.tocItemNested
														: ""
												} ${
													activeId === item.id
														? styles.tocItemActive
														: ""
												}`}
												onClick={() => scrollToHeading(item.id)}
											>
												{item.text}
											</button>
										))}
									</nav>
								</aside>
							) : null}
						</div>
					) : null}
				</div>

				<div className={layoutStyles.pageFooter}>
					<Footer user={user} />
				</div>
			</div>
		</div>
	);
}
