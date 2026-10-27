import { getPlanById } from "@/lib/utils";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { createTransaction } from "@/lib/transactions";
import { prisma } from "@/lib/db";

export async function POST(req) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await req.json().catch(() => null);
	if (!body) {
		return NextResponse.json(
			{ error: "Invalid request body" },
			{ status: 400 }
		);
	}
	const { priceId } = body;

	// Validate inputs
	if (!priceId) {
		return NextResponse.json(
			{ error: "Missing required fields" },
			{ status: 400 }
		);
	}

	const price = getPlanById(priceId);
	if (!price) {
		return NextResponse.json(
			{ error: "Invalid price ID" },
			{ status: 400 }
		);
	}

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: { id: true, email: true },
	});
	if (!user?.email) {
		return NextResponse.json(
			{ error: "User not found" },
			{ status: 404 }
		);
	}

	if (!process.env.NEXTAUTH_URL || !process.env.FLW_SECRET_KEY) {
		return NextResponse.json(
			{ error: "Missing environment variables" },
			{ status: 500 }
		);
	}

	try {
		// Create a pending transaction
		const txn_resp = await createTransaction({
			userId: user.id,
			amount: parseFloat(price.amount),
			credits: price.credits,
			currency: price.currency,
		});
		if (!txn_resp.success) {
			return NextResponse.json(
				{ error: "Failed to create transaction" },
				{ status: 500 }
			);
		}

		const transaction = txn_resp.data;

		// Make Flutterwave API call
		const resp = await fetch("https://api.flutterwave.com/v3/payments", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				tx_ref: transaction.id,
				amount: price.amount,
				currency: price.currency,
				redirect_url: `${process.env.NEXTAUTH_URL}/dashboard/payment`,
				customer: { email: user.email, name: user.id },
				meta: {
					transactionId: transaction.id,
					userId: user.id,
					priceId,
				},
				customizations: {
					title: "Credit payment",
					description: `Credits: ${price.credits}`,
				},
			}),
		});

		// Parsing the JSON response
		if (!resp.ok) {
			throw new Error(`HTTP error! status: ${resp.status}`);
		}

		const response = await resp.json();

		if (!response.data?.link) {
			throw new Error("Invalid provider response");
		}

		// Update transaction with provider reference
		await prisma.transaction.update({
			where: { id: transaction.id },
			data: {
				providerReference: response.data?.tx_ref,
				providerResponse: response.data,
			},
		});

		return NextResponse.json({
			url: response.data.link,
			transactionId: response.data?.tx_ref,
		});
	} catch (error) {
		console.error("Payment process error:", error.message);
		return NextResponse.json(
			{ error: error.message || "Failed to create checkout session" },
			{ status: 500 }
		);
	}
}
