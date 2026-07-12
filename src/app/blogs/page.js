import BlogsView from "@/views/BlogsView";
import SEO from "@/data/seo";

const seo = SEO.find((item) => item.page === "blogs");
const siteUrl = "https://www.ankitkaushal.in";

export const dynamic = "force-dynamic";

export const metadata = {
	title: "Blogs",
	description:
		seo?.description ||
		"Stories, lessons, and experiences from Ankit Kaushal — code, curiosity, and life along the way.",
	keywords: seo?.keywords,
	alternates: {
		canonical: `${siteUrl}/blogs`,
	},
	openGraph: {
		title: "Blogs | Ankit Kaushal",
		description:
			seo?.description ||
			"Stories, lessons, and experiences from Ankit Kaushal.",
		url: `${siteUrl}/blogs`,
		siteName: "Ankit Kaushal",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Blogs | Ankit Kaushal",
		description:
			seo?.description ||
			"Stories, lessons, and experiences from Ankit Kaushal.",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function BlogsPage() {
	return <BlogsView />;
}
