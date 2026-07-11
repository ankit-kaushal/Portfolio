import { NextResponse } from "next/server";
import { connectDB } from "@/lib/server/db";
import { requireAuth } from "@/lib/server/auth";
import User from "@/lib/server/models/User";

export async function GET(_request, { params }) {
	try {
		await connectDB();
		const { id } = await params;
		const user = await User.findById(id);
		return NextResponse.json(user);
	} catch (error) {
		return NextResponse.json(error, { status: 400 });
	}
}

export async function PATCH(request, { params }) {
	const authError = requireAuth(request);
	if (authError) return authError;

	try {
		await connectDB();
		const { id } = await params;
		const body = await request.json();
		const user = await User.findByIdAndUpdate(id, body, { new: true });
		return NextResponse.json(user);
	} catch (error) {
		return NextResponse.json(error, { status: 500 });
	}
}

export async function DELETE(request, { params }) {
	const authError = requireAuth(request);
	if (authError) return authError;

	try {
		await connectDB();
		const { id } = await params;
		const user = await User.findByIdAndDelete(id);
		return NextResponse.json(user);
	} catch (error) {
		return NextResponse.json(error, { status: 500 });
	}
}
