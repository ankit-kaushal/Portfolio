import { NextResponse } from "next/server";
import { connectDB } from "@/lib/server/db";
import { requireAuth } from "@/lib/server/auth";
import Project from "@/lib/server/models/Project";

export async function GET() {
	try {
		await connectDB();
		const projects = await Project.find({});
		return NextResponse.json(projects);
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
		const project = await new Project(body).save();
		return NextResponse.json(project);
	} catch (error) {
		return NextResponse.json(error, { status: 400 });
	}
}
