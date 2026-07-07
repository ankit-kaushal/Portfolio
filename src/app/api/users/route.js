import { NextResponse } from "next/server";
import { connectDB } from "@/lib/server/db";
import { requireAuth } from "@/lib/server/auth";
import User from "@/lib/server/models/User";

export async function GET() {
	try {
		await connectDB();
		const users = await User.find({});
		return NextResponse.json(users);
	} catch (error) {
		return NextResponse.json(error, { status: 400 });
	}
}

export async function POST(request) {
	const authError = requireAuth(request);
	if (authError) return authError;

	try {
		await connectDB();
		const body = await request.json();
		const user = await new User(body).save();
		return NextResponse.json(user);
	} catch (error) {
		return NextResponse.json(error, { status: 400 });
	}
}
