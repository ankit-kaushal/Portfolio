import BlogsView from "@/views/BlogsView";
import SEO from "@/data/seo";

const seo = SEO.find((item) => item.page === "blogs");

export const dynamic = "force-dynamic";

export const metadata = {
	title: "Articles",
	description: seo?.description,
	keywords: seo?.keywords,
};

export default function BlogsPage() {
	return <BlogsView />;
}
