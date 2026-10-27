import { NextResponse } from "next/server";
import { updateTransactionStatus } from "@/lib/transactions";

export async function POST(req) {
	const body = await req.json();
	const signature = req.headers.get("verif-hash");

	// Check for the signature
	const secretHash = process.env.FLW_SECRET_HASH;
	if (!signature || signature !== secretHash) {
		// This response is not from Flutterwave; discard
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	if (!body?.data?.tx_ref) {
		return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
	}

	try {
		const { tx_ref, status } = body.data;

		// Determine transaction status
		let transactionStatus;
		switch (status) {
			case "successful":
				transactionStatus = "SUCCESS";
				break;
			case "failed":
				transactionStatus = "FAILED";
				break;
			case "cancelled":
				transactionStatus = "CANCELLED";
				break;
			default:
				return NextResponse.json(
					{ error: "Unsupported transaction status" },
					{ status: 400 }
				);
		}

		// Update transaction status
		const result = await updateTransactionStatus(
			tx_ref,
			transactionStatus,
			body.data
		);
		if (!result.success) {
			return NextResponse.json(
				{ error: "Processing failed" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error("Webhook processing error:", error);
		return NextResponse.json(
			{ error: "Processing failed" },
			{ status: 500 }
		);
	}
}
