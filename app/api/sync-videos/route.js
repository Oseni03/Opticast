import { NextResponse } from "next/server";
import { syncUserChannelVideos } from "@/lib/youtube";
import { formatVideo } from "@/lib/utils";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const results = await syncUserChannelVideos(session.user.id);
		const resultList = Array.isArray(results) ? results : [results];
		const syncedVideos = resultList.flatMap(
			(result) => result?.videos || []
		);

		const failure = resultList.find(
			(result) => result && result.success === false
		);
		if (failure && syncedVideos.length === 0) {
			return NextResponse.json(
				{ error: failure.message || "Failed to sync videos" },
				{ status: 400 }
			);
		}

		const videoIds = [...new Set(syncedVideos.map((video) => video.id))];
		const savedVideos = videoIds.length
			? await prisma.video.findMany({
					where: { id: { in: videoIds } },
					include: { channel: true },
			  })
			: [];

		return NextResponse.json(savedVideos.map(formatVideo));
	} catch (error) {
		return NextResponse.json(
			{ error: error.message || "Failed to sync videos" },
			{ status: 500 }
		);
	}
}
