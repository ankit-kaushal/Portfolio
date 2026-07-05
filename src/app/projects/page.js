import ProjectsView from "@/views/ProjectsView";
import SEO from "@/data/seo";

const seo = SEO.find((item) => item.page === "projects");

export const dynamic = "force-dynamic";

export const metadata = {
	title: "Projects",
	description: seo?.description,
	keywords: seo?.keywords,
};

export default function ProjectsPage() {
	return <ProjectsView />;
}
