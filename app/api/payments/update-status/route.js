import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { updateTransactionStatus } from "@/lib/transactions";
import { prisma } from "@/lib/db";

export async function POST(req) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { tx_ref } = await req.json();
		if (!tx_ref) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const transaction = await prisma.transaction.findUnique({
			where: { id: tx_ref },
		});
		if (!transaction || transaction.userId !== session.user.id) {
			return NextResponse.json(
				{ error: "Transaction not found" },
				{ status: 404 }
			);
		}

		const response = await fetch(
			`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(
				tx_ref
			)}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
				},
			}
		);

		if (!response.ok) {
			return NextResponse.json(
				{ error: "Failed to verify transaction" },
				{ status: 502 }
			);
		}

		const verification = await response.json();
		const verifiedData = verification?.data;

		if (!verifiedData || verifiedData.tx_ref !== tx_ref) {
			return NextResponse.json(
				{ error: "Invalid payment verification response" },
				{ status: 400 }
			);
		}

		if (
			Number(verifiedData.amount) < Number(transaction.amount) ||
			verifiedData.currency !== transaction.currency
		) {
			return NextResponse.json(
				{ error: "Payment amount does not match transaction" },
				{ status: 400 }
			);
		}

		const providerStatus = verifiedData.status;

		let transactionStatus;
		switch (providerStatus) {
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
					{ error: "Payment not completed" },
					{ status: 400 }
				);
		}

		const result = await updateTransactionStatus(
			tx_ref,
			transactionStatus,
			verifiedData
		);
		if (!result.success) {
			return NextResponse.json(
				{ error: result.error || "Processing failed" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error updating transaction:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
