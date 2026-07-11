import { Suspense } from "react";
import AdminView from "@/views/admin";

export const dynamic = "force-dynamic";

export const metadata = {
	title: "Admin",
	robots: { index: false, follow: false },
};

export default function AdminPage() {
	return (
		<Suspense fallback={null}>
			<AdminView />
		</Suspense>
	);
}
