import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		logoUrl: String,
		description: String,
		aboutDescription: String,
		aboutTitle: String,
		currentLocation: String,
		resumeUrl: String,
		pictureUrl: { home: String, about: String },
		social: [{ name: String, url: String }],
	},
	{ timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", userSchema);
