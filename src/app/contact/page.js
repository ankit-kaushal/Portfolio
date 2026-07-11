import ContactView from "@/views/ContactView";
import SEO from "@/data/seo";

const seo = SEO.find((item) => item.page === "contact");

export const dynamic = "force-dynamic";

export const metadata = {
	title: "Contact",
	description: seo?.description,
	keywords: seo?.keywords,
};

export default function ContactPage() {
	return <ContactView />;
}
