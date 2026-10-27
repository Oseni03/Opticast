import {
	getVideoData,
	YouTubeError,
	getVideoId,
	getAudioData,
} from "@/lib/youtube";
import { formatDate, formatVideo } from "@/lib/utils";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(request) {
	try {
		// Check user session
		const session = await getServerSession(authOptions);
		const user = session?.user;

		if (!user?.id) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Validate request and URL
		const { url } = await request.json();
		if (!url)
			return NextResponse.json(
				{ error: "URL is required" },
				{ status: 400 }
			);
		if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url)) {
			return NextResponse.json(
				{ error: "Invalid YouTube URL" },
				{ status: 400 }
			);
		}

		// Check if video already exists for the user
		const videoId = getVideoId(url);
		if (!videoId) {
			return NextResponse.json(
				{ error: "Invalid YouTube video URL" },
				{ status: 400 }
			);
		}

		let videoData = await prisma.video.findFirst({
			where: {
				id: videoId,
				users: { some: { id: user.id } },
			},
			include: { channel: true },
		});

		if (videoData) {
			console.log("Data found in the database");
			// Map existing video to expected structure
			videoData = formatVideo(videoData);
		} else {
			const dbUser = await prisma.user.findUnique({
				where: { id: user.id },
				select: { credits: true },
			});
			if (!dbUser?.credits || dbUser.credits < 1) {
				return NextResponse.json(
					{
						error: "You need more credits to perform this action. Add credit!",
					},
					{ status: 400 }
				);
			}

			// Fetch video data and audio URL
			const [videos, audioData] = await Promise.all([
				getVideoData([videoId]),
				getAudioData(videoId),
			]);

			// Save video and audio details to the database for authenticated users
			videoData = videos[0];
			if (!videoData) {
				return NextResponse.json(
					{ error: "Video not found" },
					{ status: 404 }
				);
			}

			await prisma.channel.upsert({
				where: { id: videoData.channelId },
				update: {},
				create: {
					id: videoData.channelId,
					title: videoData.channelTitle,
				},
			});

			const audioUrl = audioData?.link || audioData?.url || null;

			await prisma.$transaction(async (tx) => {
				const debited = await tx.user.updateMany({
					where: { id: user.id, credits: { gte: 1 } },
					data: { credits: { decrement: 1 } },
				});

				if (debited.count === 0) {
					throw new YouTubeError(
						"You need more credits to perform this action. Add credit!",
						"INSUFFICIENT_CREDITS"
					);
				}

				await tx.video.upsert({
					where: { id: videoData.id },
					update: {
						users: { connect: { id: user.id } },
					},
					create: {
						id: videoData.id,
						channelId: videoData.channelId,
						title: videoData.title,
						description: videoData.description,
						thumbnailUrl:
							videoData.thumbnail || audioData?.thumbnail,
						duration:
							videoData.duration?.toString() ||
							audioData?.duration?.toString(),
						publishedAt: new Date(
							formatDate(videoData.upload_date)
						),
						audioUrl,
						users: { connect: { id: user.id } },
					},
				});
			});

			console.log("Data saved");
			videoData.audioUrl = audioUrl;
		}
		// Return success response
		return NextResponse.json(videoData);
	} catch (error) {
		const errorMessage =
			error instanceof YouTubeError
				? { error: error.message, code: error.code }
				: { error: "Internal server error", code: "INTERNAL_ERROR" };
		return NextResponse.json(errorMessage, {
			status: error instanceof YouTubeError ? 400 : 500,
		});
	}
}

export async function GET(request) {
	try {
		// Get the current session to identify the user
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get pagination parameters from the URL
		const { searchParams } = new URL(request.url);
		const page = Math.max(parseInt(searchParams.get("page")) || 1, 1);
		const limit = Math.min(
			Math.max(parseInt(searchParams.get("limit")) || 10, 1),
			100
		);
		const query = searchParams.get("query")?.trim() || "";

		const where = {
			users: {
				some: {
					id: session.user.id,
				},
			},
		};

		if (query) {
			where.title = {
				contains: query,
				mode: "insensitive",
			};
		}

		const [videos, totalVideos] = await Promise.all([
			prisma.video.findMany({
				where,
				include: {
					channel: {
						select: {
							id: true,
							title: true,
							thumbnailUrl: true,
						},
					},
				},
				take: limit,
				skip: (page - 1) * limit,
				orderBy: {
					publishedAt: "desc",
				},
			}),
			prisma.video.count({ where }),
		]);

		// Format the videos
		const formattedVideos = videos
			.map((video) => {
				try {
					return formatVideo(video);
				} catch (error) {
					console.log(`Error formatting video ${video.id}:`, error);
					return null;
				}
			})
			.filter(Boolean); // Remove any null values from failed formatting

		return Response.json({
			videos: formattedVideos,
			page,
			pageSize: limit,
			totalVideos,
			totalPages: Math.ceil(totalVideos / limit),
		});
	} catch (error) {
		return Response.json(
			{ error: error.message || "Internal Server Error" },
			{ status: 500 }
		);
	}
}
