"use client";

import { useEffect, useState } from "react";

export const ADMIN_SESSION_KEY = "admin_session_expires_at";
export const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 4;

export function useAdminSession() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isSessionChecked, setIsSessionChecked] = useState(false);

	useEffect(() => {
		const expiresAt = Number(
			window.localStorage.getItem(ADMIN_SESSION_KEY) || 0,
		);
		setIsAuthenticated(expiresAt > Date.now());
		setIsSessionChecked(true);
	}, []);

	const login = () => {
		window.localStorage.setItem(
			ADMIN_SESSION_KEY,
			String(Date.now() + ADMIN_SESSION_TTL_MS),
		);
		setIsAuthenticated(true);
	};

	const logout = () => {
		window.localStorage.removeItem(ADMIN_SESSION_KEY);
		window.localStorage.removeItem("admin_session_token");
		window.localStorage.removeItem("admin_session_user");
		setIsAuthenticated(false);
	};

	return {
		isAuthenticated,
		isSessionChecked,
		login,
		logout,
	};
}
