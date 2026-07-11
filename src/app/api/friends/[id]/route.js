import { NextResponse } from "next/server";
import { connectDB } from "@/lib/server/db";
import { requireAuth } from "@/lib/server/auth";
import Friend from "@/lib/server/models/Friend";

export async function GET(_request, { params }) {
	try {
		await connectDB();
		const { id } = await params;
		const friend = await Friend.findById(id);

		if (!friend) {
			return NextResponse.json({ message: "Friend not found" }, { status: 404 });
		}

		return NextResponse.json(friend);
	} catch (error) {
		return NextResponse.json({ message: error.message }, { status: 500 });
	}
}

export async function PATCH(request, { params }) {
	const authError = requireAuth(request);
	if (authError) return authError;

	try {
		await connectDB();
		const { id } = await params;
		const body = await request.json();
		const friend = await Friend.findById(id);

		if (!friend) {
			return NextResponse.json({ message: "Friend not found" }, { status: 404 });
		}

		if (body.name) friend.name = body.name;
		if (body.picture) friend.picture = body.picture;
		if (body.profileLink) friend.profileLink = body.profileLink;
		if (body.about) friend.about = body.about;
		if (body.relation) friend.relation = body.relation;

		const updatedFriend = await friend.save();
		return NextResponse.json(updatedFriend);
	} catch (error) {
		return NextResponse.json({ message: error.message }, { status: 400 });
	}
}

export async function DELETE(request, { params }) {
	const authError = requireAuth(request);
	if (authError) return authError;

	try {
		await connectDB();
		const { id } = await params;
		const friend = await Friend.findById(id);

		if (!friend) {
			return NextResponse.json({ message: "Friend not found" }, { status: 404 });
		}

		await friend.deleteOne();
		return NextResponse.json({ message: "Friend deleted" });
	} catch (error) {
		return NextResponse.json({ message: error.message }, { status: 500 });
	}
}
