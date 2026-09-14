const siteUrl = "https://www.ankitkaushal.in";

export default function robots() {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/admin", "/admin/", "/api/"],
			},
		],
		sitemap: `${siteUrl}/sitemap.xml`,
		host: siteUrl,
	};
}
