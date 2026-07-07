import { NextResponse } from "next/server";
import { connectDB } from "@/lib/server/db";
import { requireAuth } from "@/lib/server/auth";
import TravelJourney from "@/lib/server/models/TravelJourney";

export async function GET() {
	try {
		await connectDB();
		const journeys = await TravelJourney.find({})
			.populate("buddies", "name picture profileLink _id")
			.sort({ "duration.startDate": -1 });
		return NextResponse.json(journeys);
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
		const journey = await new TravelJourney(body).save();
		return NextResponse.json(journey, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}
