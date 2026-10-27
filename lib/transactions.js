import { prisma } from "./db";

export async function createTransaction(data) {
	try {
		const transaction = await prisma.transaction.create({
			data: {
				userId: data.userId,
				amount: data.amount,
				credits: data.credits,
				currency: data.currency,
				status: "PENDING",
			},
		});
		return {
			success: true,
			data: transaction,
		};
	} catch (error) {
		console.log(error);
		return { success: false, error };
	}
}

export async function updateTransactionStatus(
	providerReference,
	status,
	providerResponse
) {
	try {
		return await prisma.$transaction(async (tx) => {
			const existingTransaction = await tx.transaction.findUnique({
				where: { id: providerReference },
			});
			if (!existingTransaction) {
				return { success: false, error: "Transaction not found" };
			}

			if (existingTransaction.status === "SUCCESS") {
				return { success: true, data: existingTransaction };
			}

			const updated = await tx.transaction.updateMany({
				where: {
					id: providerReference,
					status: { not: "SUCCESS" },
				},
				data: {
					status,
					providerResponse,
					updatedAt: new Date(),
				},
			});

			if (updated.count === 0) {
				const currentTransaction = await tx.transaction.findUnique({
					where: { id: providerReference },
				});
				return { success: true, data: currentTransaction };
			}

			if (status === "SUCCESS") {
				await tx.user.update({
					where: { id: existingTransaction.userId },
					data: {
						credits: {
							increment: existingTransaction.credits || 0,
						},
					},
				});
			}

			const transaction = await tx.transaction.findUnique({
				where: { id: providerReference },
			});

			return { success: true, data: transaction };
		});
	} catch (error) {
		console.error("Update transaction error:", error.message);
		return { success: false, error: error.message };
	}
}
