import axios from "axios";

const RSS_FEED_URL =
	"https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@ankit-kaushal";

function parseMediumPreview(description = "") {
	const imageMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i);
	const text = description
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();

	return {
		excerpt:
			text.length > 140 ? `${text.slice(0, 140).trim()}...` : text,
		coverImage: imageMatch?.[1] || "",
	};
}

export async function fetchMediumBlogs() {
	try {
		const response = await axios.get(RSS_FEED_URL, { timeout: 8000 });
		const items = response.data?.items || [];

		return items.map((item) => {
			const preview = parseMediumPreview(item.description || "");
			return {
				id: item.guid || item.link,
				source: "medium",
				title: item.title,
				excerpt: preview.excerpt,
				coverImage: preview.coverImage,
				link: item.link,
				publishedAt: item.pubDate,
			};
		});
	} catch (error) {
		console.error("Failed to fetch Medium blogs:", error.message);
		return [];
	}
}

export function normalizePortfolioBlogs(blogs = []) {
	return blogs.map((blog) => ({
		id: blog._id?.toString?.() || blog._id || blog.slug,
		source: "portfolio",
		title: blog.title,
		excerpt: blog.excerpt || "",
		coverImage: blog.coverImage || "",
		link: `/blogs/${blog.slug}`,
		slug: blog.slug,
		publishedAt: blog.publishedAt || blog.createdAt,
	}));
}

export function mergeBlogs(portfolioBlogs = [], mediumBlogs = []) {
	return [...portfolioBlogs, ...mediumBlogs].sort((a, b) => {
		const dateA = new Date(a.publishedAt || 0).getTime();
		const dateB = new Date(b.publishedAt || 0).getTime();
		return dateB - dateA;
	});
}
