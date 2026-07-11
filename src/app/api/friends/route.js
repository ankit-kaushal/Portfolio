import { NextResponse } from "next/server";
import { connectDB } from "@/lib/server/db";
import { requireAuth } from "@/lib/server/auth";
import Friend from "@/lib/server/models/Friend";

export async function GET() {
	try {
		await connectDB();
		const friends = await Friend.find({});
		return NextResponse.json(friends);
	} catch (error) {
		return NextResponse.json({ message: error.message }, { status: 500 });
	}
}

export async function POST(request) {
	const authError = requireAuth(request);
	if (authError) return authError;

	try {
		await connectDB();
		const body = await request.json();
		const friend = await new Friend(body).save();
		return NextResponse.json(friend, { status: 201 });
	} catch (error) {
		return NextResponse.json({ message: error.message }, { status: 400 });
	}
}
