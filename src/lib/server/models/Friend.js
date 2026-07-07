import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	picture: { type: String, default: null },
	profileLink: { type: String, default: null },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	about: { type: String, default: null },
	relation: {
		type: String,
		enum: ["Friend", "Family", "Colleague", "Acquaintance", "Other"],
		default: "Other",
	},
});

friendSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

export default mongoose.models.Friend || mongoose.model("Friend", friendSchema);
