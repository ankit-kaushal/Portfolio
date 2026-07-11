const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const DATA_FILE = path.join(__dirname, "../public/data.json");

function getProfileApiUrl() {
	if (process.env.PROFILE_API_URL?.trim()) {
		return process.env.PROFILE_API_URL.trim();
	}

	const siteUrl = (
		process.env.SITE_URL || "https://www.ankitkaushal.in"
	).replace(/\/$/, "");

	// Prefer production profile when local SITE_URL is used
	if (/localhost|127\.0\.0\.1/.test(siteUrl)) {
		return "https://www.ankitkaushal.in/api/profile";
	}

	return `${siteUrl}/api/profile`;
}

async function updateData() {
	const profileUrl = getProfileApiUrl();

	try {
		const response = await axios.get(profileUrl, {
			timeout: 30000,
			headers: {
				Accept: "application/json",
			},
		});

		const newData = response.data;

		if (!newData || typeof newData !== "object" || !newData.user) {
			throw new Error("Profile API returned unexpected payload");
		}

		fs.writeFileSync(DATA_FILE, `${JSON.stringify(newData, null, "\t")}\n`);
		console.log(`Data updated successfully from ${profileUrl}`);
	} catch (error) {
		if (fs.existsSync(DATA_FILE)) {
			console.warn(
				"Could not fetch profile data from API, keeping existing data.json:",
				error.message,
			);
		} else {
			console.error("Error updating data:", error.message);
			process.exit(1);
		}
	}
}

updateData();
