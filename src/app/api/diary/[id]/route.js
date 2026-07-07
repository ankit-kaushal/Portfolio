import { NextResponse } from "next/server";
import { connectDB } from "@/lib/server/db";
import { requireAuth, requireDiarySecret } from "@/lib/server/auth";
import Diary from "@/lib/server/models/Diary";

const ALLOWED_UPDATES = ["content", "mood", "tags", "images"];

export async function GET(request, { params }) {
	const authError = requireDiarySecret(request);
	if (authError) return authError;

	try {
		await connectDB();
		const { id } = await params;
		const entry = await Diary.findById(id);

		if (!entry) {
			return NextResponse.json(
				{ error: "Diary entry not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(entry);
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
		const updates = Object.keys(body);
		const isValidOperation = updates.every((update) =>
			ALLOWED_UPDATES.includes(update),
		);

		if (!isValidOperation) {
			return NextResponse.json({ error: "Invalid updates!" }, { status: 400 });
		}

		const entry = await Diary.findById(id);
		if (!entry) {
			return NextResponse.json(
				{ error: "Diary entry not found" },
				{ status: 404 },
			);
		}

		updates.forEach((update) => {
			entry[update] = body[update];
		});
		await entry.save();

		return NextResponse.json(entry);
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
		const entry = await Diary.findByIdAndDelete(id);

		if (!entry) {
			return NextResponse.json(
				{ error: "Diary entry not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(entry);
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
