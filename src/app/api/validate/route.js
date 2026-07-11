import speakeasy from "speakeasy";
import { NextResponse } from "next/server";

export async function POST(request) {
	try {
		const { token } = await request.json();

		const validated = speakeasy.totp.verify({
			secret: process.env.ADMIN_SECRET,
			encoding: "base32",
			token,
		});

		if (validated) {
			return NextResponse.json({
				success: true,
				message: "Access granted",
			});
		}

		return NextResponse.json(
			{ success: false, message: "Invalid token" },
			{ status: 401 },
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to validate token" },
			{ status: 500 },
		);
	}
}
