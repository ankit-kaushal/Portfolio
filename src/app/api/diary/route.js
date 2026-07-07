import { NextResponse } from "next/server";
import { connectDB } from "@/lib/server/db";
import { requireAuth, requireDiarySecret } from "@/lib/server/auth";
import Diary from "@/lib/server/models/Diary";

export async function GET(request) {
	const authError = requireDiarySecret(request);
	if (authError) return authError;

	try {
		await connectDB();
		const entries = await Diary.find({}).sort({ date: -1 });
		return NextResponse.json(entries);
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
		const entry = await new Diary(body).save();
		return NextResponse.json(entry, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}
