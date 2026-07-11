import axios from "axios";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/server/auth";

export async function POST(request) {
	const authError = requireAuth(request);
	if (authError) return authError;

	try {
		const formData = await request.formData();
		const file = formData.get("file");

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		const bytes = await file.arrayBuffer();
		const blob = new Blob([bytes], { type: file.type });
		const cloudinaryFormData = new FormData();

		cloudinaryFormData.append("file", blob, file.name);
		cloudinaryFormData.append(
			"upload_preset",
			process.env.CLOUDINARY_UPLOAD_PRESET,
		);

		const response = await axios.post(
			`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
			cloudinaryFormData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			},
		);

		return NextResponse.json(response.data);
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json(
			{
				error: error.response?.data?.error || error.message,
			},
			{ status: error.response?.status || 500 },
		);
	}
}
