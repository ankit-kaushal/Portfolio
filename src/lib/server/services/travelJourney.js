import "server-only";
import { connectDB } from "@/lib/server/db";
import TravelJourney from "@/lib/server/models/TravelJourney";

export async function getTravelJourneyById(id) {
	await connectDB();
	return TravelJourney.findById(id).populate(
		"buddies",
		"name picture profileLink _id",
	);
}
