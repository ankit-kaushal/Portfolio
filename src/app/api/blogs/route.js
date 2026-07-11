import { NextResponse } from "next/server";
import { connectDB } from "@/lib/server/db";
import { requireAuth } from "@/lib/server/auth";
import Blog from "@/lib/server/models/Blog";
import { makeExcerpt, slugify } from "@/lib/server/utils/blog";

async function getUniqueSlug(baseSlug, excludeId = null) {
	let slug = baseSlug || `blog-${Date.now()}`;
	let counter = 1;

	while (true) {
		const query = { slug };
		if (excludeId) query._id = { $ne: excludeId };
		const existing = await Blog.findOne(query).select("_id");
		if (!existing) return slug;
		slug = `${baseSlug}-${counter}`;
		counter += 1;
	}
}

export async function GET(request) {
	try {
		await connectDB();
		const { searchParams } = new URL(request.url);
		const includeDrafts = searchParams.get("all") === "true";

		const filter = includeDrafts ? {} : { published: true };
		const blogs = await Blog.find(filter).sort({ publishedAt: -1 });
		return NextResponse.json(blogs);
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function POST(request) {
	const authError = requireAuth(request);
	if (authError) return authError;

	try {
		await connectDB();
		const body = await request.json();
		const title = (body.title || "").trim();
		const content = body.content || "";

		if (!title || !content.trim()) {
			return NextResponse.json(
				{ error: "Title and content are required" },
				{ status: 400 },
			);
		}

		const baseSlug = slugify(body.slug || title);
		const slug = await getUniqueSlug(baseSlug);
		const published = body.published !== false;

		const blog = await new Blog({
			title,
			slug,
			content,
			excerpt: body.excerpt?.trim() || makeExcerpt(content),
			coverImage: body.coverImage || "",
			tags: Array.isArray(body.tags)
				? body.tags.map((tag) => tag.trim()).filter(Boolean)
				: [],
			published,
			publishedAt: published
				? body.publishedAt
					? new Date(body.publishedAt)
					: new Date()
				: null,
		}).save();

		return NextResponse.json(blog, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}
