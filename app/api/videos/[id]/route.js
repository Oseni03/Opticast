import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(request, { params }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;

		if (!id) {
			return Response.json(
				{ error: "Video ID is required" },
				{ status: 400 }
			);
		}

		const video = await prisma.video.findFirst({
			where: {
				id,
				users: { some: { id: session.user.id } },
			},
			include: {
				users: { select: { id: true } },
			},
		});

		if (!video) {
			return Response.json({ error: "Video not found" }, { status: 404 });
		}

		await prisma.video.update({
			where: { id },
			data: {
				users: { disconnect: { id: session.user.id } },
			},
		});

		if (video.users.length === 1) {
			await prisma.video.delete({ where: { id } });
		}

		return Response.json({ success: true });
	} catch (error) {
		console.error("Error deleting video:", error);

		if (error.code === "P2025") {
			return Response.json({ error: "Video not found" }, { status: 404 });
		}

		return Response.json(
			{ error: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
