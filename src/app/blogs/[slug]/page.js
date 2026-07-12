import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";

import BlogDetailView from "@/views/BlogDetailView";
import { connectDB } from "@/lib/server/db";
import Blog from "@/lib/server/models/Blog";
import { makeExcerpt, stripHtml } from "@/lib/server/utils/blog";

export const dynamic = "force-dynamic";

const siteUrl = "https://www.ankitkaushal.in";

function serializeBlog(blog) {
	if (!blog) return null;

	return {
		_id: blog._id?.toString?.() || blog._id,
		title: blog.title,
		slug: blog.slug,
		excerpt: blog.excerpt || makeExcerpt(blog.content),
		content: blog.content || "",
		coverImage: blog.coverImage || "",
		tags: blog.tags || [],
		published: blog.published !== false,
		publishedAt: blog.publishedAt,
		createdAt: blog.createdAt,
		updatedAt: blog.updatedAt,
	};
}

function getBlogFromDataJson(slug) {
	try {
		const dataPath = path.join(process.cwd(), "public", "data.json");
		const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
		const blog = (data.portfolioBlogs || []).find(
			(item) => item.slug === slug && item.published !== false,
		);
		return serializeBlog(blog);
	} catch {
		return null;
	}
}

async function getPublishedBlog(slug) {
	try {
		await connectDB();
		const blog = await Blog.findOne({ slug, published: true }).lean();
		if (blog) return serializeBlog(blog);
	} catch {
		// Fall through to data.json
	}

	return getBlogFromDataJson(slug);
}

function buildArticleJsonLd(blog) {
	const url = `${siteUrl}/blogs/${blog.slug}`;
	const description = blog.excerpt || makeExcerpt(blog.content);

	return {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: blog.title,
		description,
		image: blog.coverImage ? [blog.coverImage] : undefined,
		datePublished: blog.publishedAt || blog.createdAt,
		dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
		author: {
			"@type": "Person",
			name: "Ankit Kaushal",
			url: siteUrl,
		},
		publisher: {
			"@type": "Person",
			name: "Ankit Kaushal",
			url: siteUrl,
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": url,
		},
		url,
		keywords: blog.tags?.length ? blog.tags.join(", ") : undefined,
		articleBody: stripHtml(blog.content).slice(0, 5000) || undefined,
	};
}

export async function generateMetadata({ params }) {
	const { slug } = await params;

	try {
		const blog = await getPublishedBlog(slug);
		if (!blog) {
			return { title: "Blog not found", robots: { index: false } };
		}

		const description = blog.excerpt || makeExcerpt(blog.content);
		const url = `${siteUrl}/blogs/${blog.slug}`;

		return {
			title: blog.title,
			description,
			keywords: blog.tags?.length
				? [...blog.tags, "Ankit Kaushal", "blog"]
				: ["Ankit Kaushal", "blog", blog.title],
			authors: [{ name: "Ankit Kaushal", url: siteUrl }],
			alternates: {
				canonical: url,
			},
			openGraph: {
				title: blog.title,
				description,
				url,
				siteName: "Ankit Kaushal",
				type: "article",
				publishedTime: blog.publishedAt || blog.createdAt,
				modifiedTime: blog.updatedAt || blog.publishedAt || blog.createdAt,
				authors: ["Ankit Kaushal"],
				tags: blog.tags,
				images: blog.coverImage
					? [
							{
								url: blog.coverImage,
								alt: blog.title,
							},
						]
					: [],
			},
			twitter: {
				card: "summary_large_image",
				title: blog.title,
				description,
				images: blog.coverImage ? [blog.coverImage] : [],
			},
			robots: {
				index: true,
				follow: true,
			},
		};
	} catch {
		return { title: "Blog" };
	}
}

export default async function BlogDetailPage({ params }) {
	const { slug } = await params;
	let blog = null;

	try {
		blog = await getPublishedBlog(slug);
	} catch {
		blog = null;
	}

	if (!blog) {
		notFound();
	}

	const jsonLd = buildArticleJsonLd(blog);

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<BlogDetailView slug={slug} initialBlog={blog} />
		</>
	);
}
