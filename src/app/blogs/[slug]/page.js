import BlogDetailView from "@/views/BlogDetailView";
import { connectDB } from "@/lib/server/db";
import Blog from "@/lib/server/models/Blog";
import { makeExcerpt } from "@/lib/server/utils/blog";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
	const { slug } = await params;

	try {
		await connectDB();
		const blog = await Blog.findOne({ slug, published: true });
		if (!blog) {
			return { title: "Blog" };
		}

		return {
			title: blog.title,
			description: blog.excerpt || makeExcerpt(blog.content),
			openGraph: {
				title: blog.title,
				description: blog.excerpt || makeExcerpt(blog.content),
				images: blog.coverImage ? [blog.coverImage] : [],
				type: "article",
			},
		};
	} catch {
		return { title: "Blog" };
	}
}

export default async function BlogDetailPage({ params }) {
	const { slug } = await params;
	return <BlogDetailView slug={slug} />;
}
