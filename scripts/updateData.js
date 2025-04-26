const axios = require("axios");
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../public/data.json");

async function updateData() {
	try {
		const response = await axios.get("https://api.ankitkaushal.in/home");
		const newData = {
			...response.data,
			lastUpdated: new Date().toISOString(),
		};

		fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));
		console.log("Data updated successfully");
	} catch (error) {
		console.error("Error updating data:", error);
	}
}

updateData();
