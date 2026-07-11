import "server-only";
import { NextResponse } from "next/server";

export function requireAuth(request) {
	if (request.method === "GET") {
		return null;
	}

	const authHeader = request.headers.get("authorization");

	if (!authHeader || authHeader !== process.env.SECRET_KEY) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	return null;
}

export function requireDiarySecret(request) {
	const authHeader = request.headers.get("authorization");

	if (!authHeader || authHeader !== process.env.DIARY_SECRET) {
		return NextResponse.json(
			{ error: "Please authenticate with correct diary secret." },
			{ status: 401 },
		);
	}

	return null;
}
