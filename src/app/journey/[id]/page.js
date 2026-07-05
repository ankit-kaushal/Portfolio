import JourneyDetailView from "@/views/JourneyDetailView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
	const { id } = await params;

	try {
		const response = await fetch(
			`https://www.api.ankitkaushal.in/travel-journeys/${id}`,
			{ next: { revalidate: 3600 } },
		);
		const journey = await response.json();

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
