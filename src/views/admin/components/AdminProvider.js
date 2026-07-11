"use client";

import { ThemeProvider, ToastContainerGlobal, ThemeScript } from "uiplex";
import "uiplex/styles.css";

export default function AdminProvider({ children }) {
	return (
		<>
			<ThemeScript storageKey="theme" defaultTheme="system" />
			<ThemeProvider defaultTheme="system" storageKey="theme">
				{children}
				<ToastContainerGlobal />
			</ThemeProvider>
		</>
	);
}
