import fs from "fs";
import path from "path";
import { connectDB } from "@/lib/server/db";
import Blog from "@/lib/server/models/Blog";

const siteUrl = "https://www.ankitkaushal.in";

const staticRoutes = [
	{ path: "", changeFrequency: "weekly", priority: 1 },
	{ path: "about", changeFrequency: "monthly", priority: 0.8 },
	{ path: "projects", changeFrequency: "monthly", priority: 0.8 },
	{ path: "blogs", changeFrequency: "weekly", priority: 0.9 },
	{ path: "contact", changeFrequency: "monthly", priority: 0.8 },
	{ path: "travel-journey", changeFrequency: "weekly", priority: 0.8 },
];

function readBlogsFromDataJson() {
	try {
		const dataPath = path.join(process.cwd(), "public", "data.json");
		const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
		return (data.portfolioBlogs || [])
			.filter((blog) => blog.slug && blog.published !== false)
			.map((blog) => ({
				url: `${siteUrl}/blogs/${blog.slug}`,
				lastModified: new Date(
					blog.updatedAt || blog.publishedAt || blog.createdAt || Date.now(),
				),
				changeFrequency: "weekly",
				priority: 0.7,
			}));
	} catch {
		return [];
	}
}

async function fetchDynamicEntries() {
	const entries = [];

	try {
		await connectDB();

		const mongoose = (await import("mongoose")).default;
		const TravelJourney =
			mongoose.models.TravelJourney ||
			mongoose.model(
				"TravelJourney",
				new mongoose.Schema(
					{},
					{ strict: false, collection: "traveljourneys" },
				),
			);

		const [journeys, blogs] = await Promise.all([
			TravelJourney.find({}).select("_id updatedAt").lean(),
			Blog.find({
				slug: { $exists: true, $ne: "" },
				$or: [{ published: true }, { published: { $exists: false } }],
			})
				.select("slug updatedAt publishedAt")
				.lean(),
		]);

		journeys.forEach((journey) => {
			entries.push({
				url: `${siteUrl}/journey/${journey._id}`,
				lastModified: new Date(journey.updatedAt || Date.now()),
				changeFrequency: "monthly",
				priority: 0.7,
			});
		});

		blogs.forEach((blog) => {
			if (!blog.slug) return;
			entries.push({
				url: `${siteUrl}/blogs/${blog.slug}`,
				lastModified: new Date(
					blog.updatedAt || blog.publishedAt || Date.now(),
				),
				changeFrequency: "weekly",
				priority: 0.7,
			});
		});
	} catch {
		return readBlogsFromDataJson();
	}

	if (!entries.some((entry) => entry.url.includes("/blogs/"))) {
		entries.push(...readBlogsFromDataJson());
	}

	return entries;
}

export default async function sitemap() {
	const staticEntries = staticRoutes.map((route) => ({
		url: `${siteUrl}${route.path ? `/${route.path}` : ""}`,
		lastModified: new Date(),
		changeFrequency: route.changeFrequency,
		priority: route.priority,
	}));

	const dynamicEntries = await fetchDynamicEntries();

	const byUrl = new Map();
	[...staticEntries, ...dynamicEntries].forEach((entry) => {
		byUrl.set(entry.url, entry);
	});

	return [...byUrl.values()];
}
