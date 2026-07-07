const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const DATA_FILE = path.join(__dirname, "../public/data.json");
const API_URL =
	process.env.API_URL ||
	`${(process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "")}/api`;

async function updateData() {
	try {
		const response = await axios.get(`${API_URL}/home`);
		const newData = {
			...response.data,
		};

		fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));
		console.log("Data updated successfully");
	} catch (error) {
		if (fs.existsSync(DATA_FILE)) {
			console.warn(
				"Could not fetch home data from API, keeping existing data.json:",
				error.message,
			);
		} else {
			console.error("Error updating data:", error.message);
			process.exit(1);
		}
	}
}

updateData();
