const DEFAULT_CLIENT_API = "/api";

function getSiteOrigin() {
	if (process.env.NEXT_PUBLIC_SITE_URL) {
		return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
	}

	if (process.env.SITE_URL) {
		return process.env.SITE_URL.replace(/\/$/, "");
	}

	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}

	return "http://localhost:3000";
}

export function getServerApiBase() {
	return `${getSiteOrigin()}${process.env.NEXT_PUBLIC_API_BASE || DEFAULT_CLIENT_API}`;
}

export function getClientApiBase() {
	return process.env.NEXT_PUBLIC_API_BASE || DEFAULT_CLIENT_API;
}

export function apiUrl(path, { server = false } = {}) {
	const base = server ? getServerApiBase() : getClientApiBase();
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	return `${base}${normalizedPath}`;
}

export function getAuthHeaders() {
	return {
		Authorization: process.env.NEXT_PUBLIC_AUTHKEY || "",
	};
}

export function getDiaryAuthHeaders() {
	return {
		Authorization: process.env.NEXT_PUBLIC_DIARY_KEY || "",
	};
}
