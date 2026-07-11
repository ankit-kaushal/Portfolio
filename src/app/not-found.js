import NotFoundView from "@/views/NotFoundView";

export const dynamic = "force-dynamic";

export const metadata = {
	title: "404",
};

export default function NotFound() {
	return <NotFoundView />;
}
