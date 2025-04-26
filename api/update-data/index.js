const fs = require("fs");
const path = require("path");
const axios = require("axios");

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	try {
		const response = await axios.get("https://api.ankitkaushal.in/home");
		const data = response.data;

		const filePath = path.join(process.cwd(), "public", "data.json");
		fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

		return res
			.status(200)
			.json({ message: "data.json updated successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Failed to update data.json" });
	}
}
