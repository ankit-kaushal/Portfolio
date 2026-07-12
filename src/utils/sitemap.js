const { create } = require("xmlbuilder2");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const configuredSiteUrl = (
	process.env.SITE_URL || "https://www.ankitkaushal.in"
).replace(/\/$/, "");

// Never publish localhost URLs in the sitemap
const baseUrl = /localhost|127\.0\.0\.1/.test(configuredSiteUrl)
	? "https://www.ankitkaushal.in"
	: configuredSiteUrl;

const staticRoutes = [
	{ path: "", priority: 1.0 },
	{ path: "about", priority: 0.8 },
	{ path: "projects", priority: 0.8 },
	{ path: "blogs", priority: 0.8 },
	{ path: "contact", priority: 0.8 },
	{ path: "travel-journey", priority: 0.8 },
];

function getMongoUri() {
	const cluster = process.env.DB_CLUSTER;
	const username = process.env.DB_USERNAME;
	const password = process.env.DB_PASSWORD;
	const dbName = process.env.DB_NAME;

	if (!cluster || !username || !password || !dbName) {
		throw new Error(
			"Missing DB_CLUSTER, DB_USERNAME, DB_PASSWORD, or DB_NAME",
		);
	}

	return `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(
		password,
	)}@${cluster}.hcapf5i.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=${cluster}`;
}

function readBlogsFromDataJson() {
	try {
		const dataPath = path.join(__dirname, "../../public/data.json");
		const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
		const blogs = data.portfolioBlogs || [];

		return blogs
			.filter((blog) => blog.slug && blog.published !== false)
			.map((blog) => ({
				path: `blogs/${blog.slug}`,
				priority: 0.7,
				lastmod: blog.updatedAt || blog.publishedAt || blog.createdAt,
			}));
	} catch {
		return [];
	}
}

function mergeRoutesByPath(...routeGroups) {
	const byPath = new Map();

	routeGroups.flat().forEach((route) => {
		if (!route?.path) return;
		const existing = byPath.get(route.path);
		if (!existing) {
			byPath.set(route.path, route);
			return;
		}

		const existingDate = new Date(existing.lastmod || 0).getTime();
		const nextDate = new Date(route.lastmod || 0).getTime();
		if (nextDate >= existingDate) {
			byPath.set(route.path, { ...existing, ...route });
		}
	});

	return [...byPath.values()];
}

async function fetchDynamicRoutes() {
	await mongoose.connect(getMongoUri());

	const TravelJourney =
		mongoose.models.TravelJourney ||
		mongoose.model(
			"TravelJourney",
			new mongoose.Schema({}, { strict: false, collection: "traveljourneys" }),
		);

	const Blog =
		mongoose.models.Blog ||
		mongoose.model(
			"Blog",
			new mongoose.Schema({}, { strict: false, collection: "blogs" }),
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

	await mongoose.disconnect();

	const journeyRoutes = journeys.map((journey) => ({
		path: `journey/${journey._id}`,
		priority: 0.7,
		lastmod: journey.updatedAt,
	}));

	const blogRoutesFromDb = blogs
		.filter((blog) => blog.slug)
		.map((blog) => ({
			path: `blogs/${blog.slug}`,
			priority: 0.7,
			lastmod: blog.updatedAt || blog.publishedAt,
		}));

	const blogRoutes = mergeRoutesByPath(
		readBlogsFromDataJson(),
		blogRoutesFromDb,
	);

	return [...journeyRoutes, ...blogRoutes];
}

function formatDate(value) {
	const date = value ? new Date(value) : new Date();
	if (Number.isNaN(date.getTime())) {
		return new Date().toISOString().split("T")[0];
	}
	return date.toISOString().split("T")[0];
}

function writeSitemap(allRoutes) {
	const root = create({ version: "1.0", encoding: "UTF-8" }).ele("urlset", {
		xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
	});

	allRoutes.forEach((route) => {
		root.ele("url")
			.ele("loc")
			.txt(`${baseUrl}${route.path ? `/${route.path}` : ""}`)
			.up()
			.ele("lastmod")
			.txt(formatDate(route.lastmod))
			.up()
			.ele("changefreq")
			.txt(route.path?.startsWith("blogs/") ? "weekly" : "monthly")
			.up()
			.ele("priority")
			.txt(String(route.priority));
	});

	const xml = root.end({ prettyPrint: true });
	fs.writeFileSync(path.join(__dirname, "../../public/sitemap.xml"), xml);
}

const generateSitemap = async () => {
	const dataJsonBlogRoutes = readBlogsFromDataJson();

	try {
		const dynamicRoutes = await fetchDynamicRoutes();
		writeSitemap([...staticRoutes, ...dynamicRoutes]);
		const blogCount = dynamicRoutes.filter((route) =>
			route.path?.startsWith("blogs/"),
		).length;
		console.log(
			`Sitemap generated successfully (${staticRoutes.length} static + ${dynamicRoutes.length} dynamic, ${blogCount} blogs)`,
		);
	} catch (error) {
		console.warn(
			"Could not fetch journeys/blogs for sitemap, falling back:",
			error.message,
		);
		writeSitemap([...staticRoutes, ...dataJsonBlogRoutes]);
		console.log(
			`Sitemap generated with static routes + ${dataJsonBlogRoutes.length} blogs from data.json`,
		);
	}
};

generateSitemap();

module.exports = generateSitemap;
