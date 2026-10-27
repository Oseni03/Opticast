"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import ChannelTable from "./channels/components/channel-table";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import AudioTable from "./components/audio-table";
import EmptyPlaceholder from "@/components/EmptyPlaceholder";

function Page() {
	const [channels, setChannels] = useState([]);
	const [audios, setAudios] = useState([]);

	// Fetch subscribed channels
	useEffect(() => {
		async function fetchSubscribedChannels() {
			try {
				const response = await fetch(`/api/channels?limit=5`);
				const data = await response.json();
				if (response.ok) {
					setChannels(data.channels || []);
				} else {
					toast.error(data.error || "Failed to load channels.");
				}
			} catch (error) {
				toast.error("Failed to load channels.");
			}
		}

		const fetchAudios = async () => {
			try {
				const response = await fetch(`/api/videos?limit=5`, {
					method: "GET",
				});

				const data = await response.json();
				if (response.ok) {
					setAudios(data?.videos || []);
				} else {
					toast.error(data.error || "Failed to load audios.");
				}
			} catch (error) {
				toast.error("Failed to load audios");
			}
		};
		Promise.all([fetchSubscribedChannels(), fetchAudios()]);
	}, []);

	return (
		<div className="grid space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Audio Library</CardTitle>
				</CardHeader>
				<CardContent>
					{audios.length > 0 ? (
						<>
							<AudioTable audios={audios} />
							<Button asChild size="sm" className="ml-auto">
								<Link href="/dashboard/library">View all</Link>
							</Button>
						</>
					) : (
						<EmptyPlaceholder
							title={"No audio"}
							description={"Visit the library tab to add"}
						/>
					)}
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Channels</CardTitle>
				</CardHeader>
				<CardContent>
					{channels.length > 0 ? (
						<>
							<ChannelTable
								channels={channels}
								setChannels={setChannels}
							/>
							<Button asChild size="sm" className="ml-auto">
								<Link href="/dashboard/channels">View all</Link>
							</Button>
						</>
					) : (
						<EmptyPlaceholder
							title={"No subscribed channel"}
							description={"Visit the channel tab to add"}
						/>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export default Page;
