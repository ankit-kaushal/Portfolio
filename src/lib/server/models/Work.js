import mongoose from "mongoose";

const workSchema = new mongoose.Schema({
	companyName: { type: String, required: true, trim: true },
	companyLogo: String,
	designation: { type: String, required: true, trim: true },
	workLocation: String,
	workDuration: { start: String, end: String },
});

export default mongoose.models.Work || mongoose.model("Work", workSchema);
