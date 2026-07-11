import { NextResponse } from "next/server";
import { connectDB } from "@/lib/server/db";
import User from "@/lib/server/models/User";
import Project from "@/lib/server/models/Project";
import Work from "@/lib/server/models/Work";
import Blog from "@/lib/server/models/Blog";
import { sortWorksByDate } from "@/lib/server/utils/sortWorks";
import {
	fetchMediumBlogs,
	mergeBlogs,
	normalizePortfolioBlogs,
} from "@/lib/server/utils/mediumBlogs";

export async function GET() {
	try {
		await connectDB();

		const [user, projects, works, portfolioBlogs, mediumBlogs] =
			await Promise.all([
				User.findOne({}, { createdAt: 0, updatedAt: 0 }).sort({
					updatedAt: -1,
				}),
				Project.find().sort({ projectPublishDate: -1 }),
				Work.find(),
				Blog.find({ published: true }).sort({ publishedAt: -1 }),
				fetchMediumBlogs(),
			]);

		const blogs = mergeBlogs(
			normalizePortfolioBlogs(portfolioBlogs),
			mediumBlogs,
		);

		return NextResponse.json({
			user,
			projects,
			works: sortWorksByDate(works),
			blogs,
			portfolioBlogs,
			mediumBlogs,
		});
	} catch (error) {
		console.error(error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
