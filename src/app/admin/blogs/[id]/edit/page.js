import AdminAuthGate from "@/views/admin/components/AdminAuthGate";
import BlogFormPage from "@/views/admin/components/BlogsEdit/BlogFormPage";

export const dynamic = "force-dynamic";

export const metadata = {
	title: "Edit Blog | Admin",
	robots: { index: false, follow: false },
};

export default async function EditBlogPage({ params }) {
	const { id } = await params;

	return (
		<AdminAuthGate>
			<BlogFormPage blogId={id} />
		</AdminAuthGate>
	);
}
