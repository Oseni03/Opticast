import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signInSchema } from "@/lib/zod";

export async function POST(req) {
	try {
		const body = await req.json();
		const validation = signInSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(
				{ error: validation.error.issues[0].message },
				{ status: 400 }
			);
		}

		const { email, password } = validation.data;

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "User already exists" },
				{ status: 400 }
			);
		}

		const hashedPassword = await hash(password, 12);

		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
			},
		});

		return NextResponse.json({
			user: { id: user.id, email: user.email },
		});
	} catch (error) {
		return NextResponse.json(
			{ error: error.message || "Failed to create user" },
			{ status: 500 }
		);
	}
}
