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
