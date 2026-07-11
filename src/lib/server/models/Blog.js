import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		slug: { type: String, required: true, unique: true, trim: true },
		excerpt: { type: String, default: "" },
		content: { type: String, required: true },
		coverImage: { type: String, default: "" },
		tags: [{ type: String, trim: true }],
		published: { type: Boolean, default: true },
		publishedAt: { type: Date, default: Date.now },
	},
	{ timestamps: true },
);

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
