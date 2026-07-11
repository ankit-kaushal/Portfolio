import AboutView from "@/views/AboutView";
import SEO from "@/data/seo";

const seo = SEO.find((item) => item.page === "about");

export const dynamic = "force-dynamic";

export const metadata = {
	title: "About",
	description: seo?.description,
	keywords: seo?.keywords,
};

export default function AboutPage() {
	return <AboutView />;
}
