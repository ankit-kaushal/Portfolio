import JourneyDetailView from "@/views/JourneyDetailView";
import { getTravelJourneyById } from "@/lib/server/services/travelJourney";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
	const { id } = await params;

	try {
		const journey = await getTravelJourneyById(id);

		if (!journey) {
			return { title: "Travel Journey" };
		}

		return {
			title: journey.title,
			description: journey.description?.replace(/<[^>]*>/g, "").slice(0, 160),
			openGraph: {
				title: journey.title,
				description: journey.description?.replace(/<[^>]*>/g, "").slice(0, 160),
				images: journey.photos?.[0]?.url ? [journey.photos[0].url] : [],
				type: "article",
			},
		};
	} catch {
		return { title: "Travel Journey" };
	}
}

export default async function JourneyDetailPage({ params }) {
	const { id } = await params;
	return <JourneyDetailView id={id} />;
}
