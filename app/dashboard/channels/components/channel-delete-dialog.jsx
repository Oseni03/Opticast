import { toast } from "react-toastify";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const ChannelDeleteDialog = ({ channelId, setter }) => {
	const handleDeleteChannel = async (channelId) => {
		try {
			const response = await fetch(`/api/channels/${channelId}`, {
				method: "DELETE",
			});
			if (response.ok) {
				setter((prevChannels) =>
					prevChannels.filter((channel) => channel.id !== channelId)
				);
				toast.success("Channel unsubscribed successfully!");
			} else {
				toast.error("Failed to unsubscribe from channel.");
			}
		} catch (error) {
			toast.error("Error deleting channel.");
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline" size="sm" className="border-red-500">
					Unsubscribe
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you absolutely sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. You will stop syncing
						videos from this channel.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className="bg-red-500"
						onClick={() => handleDeleteChannel(channelId)}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default ChannelDeleteDialog;
