const { create } = require("xmlbuilder2");
const fs = require("fs");
const path = require("path");

const baseUrl = "https://www.ankitkaushal.in";

const routes = [
	{ path: "", priority: 1.0 },
	{ path: "about", priority: 0.8 },
	{ path: "projects", priority: 0.8 },
	{ path: "blogs", priority: 0.8 },
	{ path: "contact", priority: 0.8 },
	{ path: "travel-journey", priority: 0.8 },
];

const generateSitemap = () => {
	const root = create({ version: "1.0", encoding: "UTF-8" }).ele("urlset", {
		xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
	});

	routes.forEach((route) => {
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
};

generateSitemap();

module.exports = generateSitemap;
