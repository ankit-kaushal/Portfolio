import { NextResponse } from "next/server";
import { connectDB } from "@/lib/server/db";
import { requireAuth } from "@/lib/server/auth";
import TravelJourney from "@/lib/server/models/TravelJourney";

const ALLOWED_UPDATES = [
	"title",
	"description",
	"place",
	"duration",
	"buddies",
	"modeOfTravel",
	"expense",
	"photos",
	"rating",
	"placesVisited",
];

export async function GET(_request, { params }) {
	try {
		await connectDB();
		const { id } = await params;
		const journey = await TravelJourney.findById(id).populate(
			"buddies",
			"name picture profileLink _id",
		);

		if (!journey) {
			return NextResponse.json(
				{ error: "Travel journey not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(journey);
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

		const journey = await TravelJourney.findById(id);
		if (!journey) {
			return NextResponse.json(
				{ error: "Travel journey not found" },
				{ status: 404 },
			);
		}

		updates.forEach((update) => {
			journey[update] = body[update];
		});
		await journey.save();

		return NextResponse.json(journey);
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
		const journey = await TravelJourney.findByIdAndDelete(id);

		if (!journey) {
			return NextResponse.json(
				{ error: "Travel journey not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(journey);
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
