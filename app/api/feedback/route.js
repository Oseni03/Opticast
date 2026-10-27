import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { title, description } = await req.json();
		if (!title || !description) {
			return NextResponse.json(
				{ error: "Title and description are required" },
				{ status: 400 }
			);
		}

		const feedback = await prisma.feedback.create({
			data: {
				userId: session.user.id,
				title,
				description,
			},
		});

		return NextResponse.json({ feedback });
	} catch (error) {
		return NextResponse.json(
			{ error: error.message || "Failed to submit feedback" },
			{ status: 500 }
		);
	}
}
