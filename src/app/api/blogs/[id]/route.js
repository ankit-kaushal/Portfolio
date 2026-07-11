import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/server/db";
import { requireAuth } from "@/lib/server/auth";
import Blog from "@/lib/server/models/Blog";
import { makeExcerpt, slugify } from "@/lib/server/utils/blog";

async function findBlogByIdOrSlug(id) {
	if (mongoose.isValidObjectId(id)) {
		const byId = await Blog.findById(id);
		if (byId) return byId;
	}

	return Blog.findOne({ slug: id, published: true });
}

async function getUniqueSlug(baseSlug, excludeId) {
	let slug = baseSlug || `blog-${Date.now()}`;
	let counter = 1;

	while (true) {
		const existing = await Blog.findOne({
			slug,
			_id: { $ne: excludeId },
		}).select("_id");
		if (!existing) return slug;
		slug = `${baseSlug}-${counter}`;
		counter += 1;
	}
}

export async function GET(_request, { params }) {
	try {
		await connectDB();
		const { id } = await params;
		const blog = await findBlogByIdOrSlug(id);

		if (!blog) {
			return NextResponse.json({ error: "Blog not found" }, { status: 404 });
		}

		return NextResponse.json(blog);
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function PATCH(request, { params }) {
	const authError = requireAuth(request);
	if (authError) return authError;

	try {
		await connectDB();
		const { id } = await params;
		const body = await request.json();
		const blog = await Blog.findById(id);

		if (!blog) {
			return NextResponse.json({ error: "Blog not found" }, { status: 404 });
		}

		if (body.title !== undefined) blog.title = body.title.trim();
		if (body.content !== undefined) blog.content = body.content;
		if (body.coverImage !== undefined) blog.coverImage = body.coverImage;
		if (body.excerpt !== undefined) {
			blog.excerpt = body.excerpt.trim();
		} else if (body.content !== undefined && !blog.excerpt) {
			blog.excerpt = makeExcerpt(body.content);
		}

		if (Array.isArray(body.tags)) {
			blog.tags = body.tags.map((tag) => tag.trim()).filter(Boolean);
		}

		if (body.slug !== undefined || body.title !== undefined) {
			const baseSlug = slugify(body.slug || blog.title);
			blog.slug = await getUniqueSlug(baseSlug, blog._id);
		}

		if (body.published !== undefined) {
			blog.published = Boolean(body.published);
			if (blog.published && !blog.publishedAt) {
				blog.publishedAt = new Date();
			}
			if (!blog.published) {
				blog.publishedAt = null;
			}
		}

		if (body.publishedAt !== undefined && blog.published) {
			blog.publishedAt = new Date(body.publishedAt);
		}

		await blog.save();
		return NextResponse.json(blog);
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}

export async function DELETE(request, { params }) {
	const authError = requireAuth(request);
	if (authError) return authError;

	try {
		await connectDB();
		const { id } = await params;
		const blog = await Blog.findByIdAndDelete(id);

		if (!blog) {
			return NextResponse.json({ error: "Blog not found" }, { status: 404 });
		}

		return NextResponse.json(blog);
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
