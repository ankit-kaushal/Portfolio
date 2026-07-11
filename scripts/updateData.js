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
	const failOnError = process.env.CI === "true";

	try {
		console.log(`Fetching portfolio data from ${profileUrl}`);
		const response = await axios.get(profileUrl, {
			timeout: 30000,
			headers: {
				Accept: "application/json",
			},
			validateStatus: () => true,
		});

		if (response.status < 200 || response.status >= 300) {
			throw new Error(
				`Profile API returned HTTP ${response.status}: ${JSON.stringify(response.data)?.slice(0, 200)}`,
			);
		}

		const newData = response.data;

		if (!newData || typeof newData !== "object" || !newData.user) {
			throw new Error("Profile API returned unexpected payload");
		}

		fs.writeFileSync(DATA_FILE, `${JSON.stringify(newData, null, "\t")}\n`);
		console.log(`Data updated successfully from ${profileUrl}`);
	} catch (error) {
		console.error("Error updating data:", error.message);

		if (failOnError) {
			process.exit(1);
		}

		if (fs.existsSync(DATA_FILE)) {
			console.warn("Keeping existing data.json");
		} else {
			process.exit(1);
		}
	}
}

updateData();
