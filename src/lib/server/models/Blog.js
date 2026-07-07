import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
	{
		blogTitle: { type: String, required: true, trim: true },
		blogDescription: String,
		blogUrl: String,
		blogPublishDate: String,
	},
	{ timestamps: true },
);

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
