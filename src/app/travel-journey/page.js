import TravelJourneyView from "@/views/TravelJourneyView";

export const dynamic = "force-dynamic";

export const metadata = {
	title: "Travel Journeys",
	description: "Documenting my adventures around the world",
};

export default function TravelJourneyPage() {
	return <TravelJourneyView />;
}
