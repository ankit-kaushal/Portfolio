import "./globals.css";
import "@/lib/fontawesome";

import ReduxProvider from "@/components/providers/ReduxProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import AppInitializer from "@/components/providers/AppInitializer";

export const metadata = {
	metadataBase: new URL("https://www.ankitkaushal.in"),
	title: {
		default: "Ankit Kaushal",
		template: "%s | Ankit Kaushal",
	},
	description:
		"Software engineer passionate about solving complex problems through innovative coding solutions.",
	alternates: {
		canonical: "https://www.ankitkaushal.in",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		google: "9RvH3NU-pxDwBitccJDCYleAFM29mqfFgGqQMhlkNdc",
	},
	openGraph: {
		type: "website",
		locale: "en_IN",
		url: "https://www.ankitkaushal.in",
		siteName: "Ankit Kaushal",
		title: "Ankit Kaushal",
		description:
			"Software engineer passionate about solving complex problems through innovative coding solutions.",
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ReduxProvider>
					<ThemeProvider>
						<AppInitializer>{children}</AppInitializer>
					</ThemeProvider>
				</ReduxProvider>
			</body>
		</html>
	);
}
