const { create } = require("xmlbuilder2");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const http = require("http");
const https = require("https");

const baseUrl = process.env.SITE_URL || "https://www.ankitkaushal.in";
const API_URL =
	process.env.API_URL ||
	`${(process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "")}/api`;

const routes = [
	{ path: "", priority: 1.0 },
	{ path: "about", priority: 0.8 },
	{ path: "projects", priority: 0.8 },
	{ path: "blogs", priority: 0.8 },
	{ path: "contact", priority: 0.8 },
	{ path: "travel-journey", priority: 0.8 },
];

const fetchJourneyIds = () => {
	return new Promise((resolve, reject) => {
		const url = `${API_URL}/travel-journeys`;
		const client = url.startsWith("https") ? https : http;

		client
			.get(url, (res) => {
				let data = "";
				res.on("data", (chunk) => {
					data += chunk;
				});
				res.on("end", () => {
					try {
						const journeys = JSON.parse(data);
						resolve(
							journeys.map((journey) => ({
								path: `journey/${journey._id}`,
								priority: 0.7,
							})),
						);
					} catch (error) {
						reject(error);
					}
				});
			})
			.on("error", reject);
	});
};

const generateSitemap = async () => {
	try {
		const journeyRoutes = await fetchJourneyIds();
		const allRoutes = [...routes, ...journeyRoutes];

		const root = create({ version: "1.0", encoding: "UTF-8" }).ele(
			"urlset",
			{
				xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
			},
		);

		allRoutes.forEach((route) => {
			root.ele("url")
				.ele("loc")
				.txt(`${baseUrl}${route.path ? `/${route.path}` : ""}`)
				.up()
				.ele("lastmod")
				.txt(new Date().toISOString().split("T")[0])
				.up()
				.ele("changefreq")
				.txt("monthly")
				.up()
				.ele("priority")
				.txt(route.priority.toString());
		});

		const xml = root.end({ prettyPrint: true });
		fs.writeFileSync(path.join(__dirname, "../../public/sitemap.xml"), xml);
		console.log("Sitemap generated successfully");
	} catch (error) {
		console.warn(
			"Could not fetch journeys for sitemap, using static routes only:",
			error.message,
		);
		const allRoutes = routes;

		const root = create({ version: "1.0", encoding: "UTF-8" }).ele(
			"urlset",
			{
				xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
			},
		);

		allRoutes.forEach((route) => {
			root.ele("url")
				.ele("loc")
				.txt(`${baseUrl}${route.path ? `/${route.path}` : ""}`)
				.up()
				.ele("lastmod")
				.txt(new Date().toISOString().split("T")[0])
				.up()
				.ele("changefreq")
				.txt("monthly")
				.up()
				.ele("priority")
				.txt(route.priority.toString());
		});

		const xml = root.end({ prettyPrint: true });
		fs.writeFileSync(path.join(__dirname, "../../public/sitemap.xml"), xml);
		console.log("Sitemap generated with static routes only");
	}
};

generateSitemap();

module.exports = generateSitemap;
