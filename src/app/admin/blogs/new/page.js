import AdminAuthGate from "@/views/admin/components/AdminAuthGate";
import BlogFormPage from "@/views/admin/components/BlogsEdit/BlogFormPage";

export const dynamic = "force-dynamic";

export const metadata = {
	title: "New Blog | Admin",
	robots: { index: false, follow: false },
};

export default function NewBlogPage() {
	return (
		<AdminAuthGate>
			<BlogFormPage />
		</AdminAuthGate>
	);
}
