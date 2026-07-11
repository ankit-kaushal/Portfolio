import { NextResponse } from "next/server";
import { connectDB } from "@/lib/server/db";
import { requireAuth } from "@/lib/server/auth";
import Project from "@/lib/server/models/Project";

export async function GET(_request, { params }) {
	try {
		await connectDB();
		const { id } = await params;
		const project = await Project.findById(id);
		return NextResponse.json(project);
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
		const project = await Project.findByIdAndUpdate(id, body, { new: true });
		return NextResponse.json(project);
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
		const project = await Project.findByIdAndDelete(id);
		return NextResponse.json(project);
	} catch (error) {
		return NextResponse.json(error, { status: 500 });
	}
}
