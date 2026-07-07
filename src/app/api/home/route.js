import { NextResponse } from "next/server";
import { connectDB } from "@/lib/server/db";
import User from "@/lib/server/models/User";

export async function GET() {
	try {
		await connectDB();
		const user = await User.findOne(
			{},
			{ _id: 0, createdAt: 0, updatedAt: 0 },
		).sort({ updatedAt: -1 });
		return NextResponse.json(user);
	} catch (error) {
		console.error(error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
