import HomepageView from "@/views/HomepageView";
import SEO from "@/data/seo";

const seo = SEO.find((item) => item.page === "home");
const siteUrl = "https://www.ankitkaushal.in";

export const dynamic = "force-dynamic";

export const metadata = {
	title: {
		absolute: "Ankit Kaushal",
	},
	description: seo?.description,
	keywords: seo?.keywords,
	alternates: {
		canonical: siteUrl,
	},
	openGraph: {
		title: "Ankit Kaushal",
		description: seo?.description,
		url: siteUrl,
		siteName: "Ankit Kaushal",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Ankit Kaushal",
		description: seo?.description,
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function HomePage() {
	return <HomepageView />;
}
