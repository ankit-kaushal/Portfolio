"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

import NavBar from "@/components/common/navBar";
import Footer from "@/components/common/footer";
import Logo from "@/components/common/logo";
import ShootingStars from "@/components/common/ShootingStars";
import layoutStyles from "@/components/layout/layout.module.css";
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

export default function BlogDetailView({ slug }) {
	const data = useSelector((state) => state.data);
	const { user = {} } = data || {};
	const [blog, setBlog] = useState(null);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		if (!slug) return;

		if (!data) {
			setIsLoading(true);
			return;
		}

		const matched = findPortfolioBlog(data, slug);
		if (matched) {
			setBlog(matched);
			setError("");
		} else {
			setBlog(null);
			setError("Blog not found");
		}
		setIsLoading(false);
	}, [data, slug]);

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
					<Link href="/blogs" className={styles.backLink}>
						← Back to blogs
					</Link>

					{isLoading ? (
						<p className={styles.status}>Loading...</p>
					) : error ? (
						<p className={styles.status}>{error}</p>
					) : blog ? (
						<article className={styles.article}>
							<h1 className={styles.title}>{blog.title}</h1>
							<div className={styles.meta}>
								<span>
									{new Date(
										blog.publishedAt || blog.createdAt,
									).toLocaleDateString("en-US", {
										day: "numeric",
										month: "short",
										year: "numeric",
									})}
								</span>
								{blog.tags?.length > 0 && (
									<span>{blog.tags.join(" · ")}</span>
								)}
							</div>
							{blog.coverImage ? (
								<img
									src={blog.coverImage}
									alt={blog.title}
									className={styles.coverImage}
								/>
							) : null}
							{blog.content ? (
								<div
									className={styles.content}
									dangerouslySetInnerHTML={{ __html: blog.content }}
								/>
							) : blog.excerpt ? (
								<p className={styles.content}>{blog.excerpt}</p>
							) : null}
						</article>
					) : null}
				</div>

				<div className={layoutStyles.pageFooter}>
					<Footer user={user} />
				</div>
			</div>
		</div>
	);
}
