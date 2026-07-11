import mongoose from "mongoose";

const diarySchema = new mongoose.Schema(
	{
		date: { type: Date, required: true, default: Date.now },
		content: { type: String, required: true },
		mood: {
			type: String,
			enum: [
				"Happy",
				"Sad",
				"Excited",
				"Tired",
				"Neutral",
				"Exhausted",
				"Worried",
				"Other",
			],
			default: "Neutral",
		},
		tags: [{ type: String, trim: true }],
		images: [{ type: String, default: null }],
	},
	{ timestamps: true },
);

export default mongoose.models.Diary || mongoose.model("Diary", diarySchema);
