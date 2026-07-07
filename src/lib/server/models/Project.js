import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
	{
		projectName: { type: String, required: true, trim: true },
		projectDescription: String,
		projectLink: String,
		projectGitHub: String,
		projectType: String,
		mainStack: String,
		projectPicture: { type: String, default: null },
		projectPublishDate: { type: Date, default: null },
	},
	{ timestamps: true },
);

export default mongoose.models.Project ||
	mongoose.model("Project", projectSchema);
