import mongoose from "mongoose";
import "@/lib/server/models/Friend";

const travelJourneySchema = new mongoose.Schema({
	title: { type: String, required: true, trim: true },
	description: { type: String, trim: true },
	place: { type: String, required: true, trim: true },
	duration: {
		startDate: { type: Date },
		endDate: { type: Date, default: null },
	},
	buddies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Friend" }],
	modeOfTravel: [
		{
			type: String,
			enum: [
				"flight",
				"train",
				"bus",
				"car",
				"auto",
				"bike",
				"scooty",
				"metro",
				"walk",
				"other",
			],
		},
	],
	placesVisited: { type: [String], default: null },
	expense: {
		amount: { type: Number, default: null },
		currency: { type: String, default: null },
	},
	photos: [
		{
			url: { type: String },
			caption: { type: String, default: "" },
		},
	],
	rating: { type: Number, min: 1, max: 5, default: null },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

travelJourneySchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

export default mongoose.models.TravelJourney ||
	mongoose.model("TravelJourney", travelJourneySchema);
