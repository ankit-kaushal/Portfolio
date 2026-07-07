import axios from "axios";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/server/db";
import User from "@/lib/server/models/User";
import Project from "@/lib/server/models/Project";
import Work from "@/lib/server/models/Work";
import { sortWorksByDate } from "@/lib/server/utils/sortWorks";

const RSS_FEED_URL =
	"https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@ankit-kaushal";

export async function GET() {
	try {
		await connectDB();

		const [user, projects, works, blogsResponse] = await Promise.all([
			User.findOne({}, { createdAt: 0, updatedAt: 0 }).sort({
				updatedAt: -1,
			}),
			Project.find().sort({ projectPublishDate: -1 }),
			Work.find(),
			axios.get(RSS_FEED_URL),
		]);

		return NextResponse.json({
			user,
			projects,
			works: sortWorksByDate(works),
			blogs: blogsResponse.data.items,
		});
	} catch (error) {
		console.error(error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
