"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { ZodForm } from "./zod-form";
import { FeedbackSchema } from "@/lib/zod";
import { useSession } from "next-auth/react";

export function FeedbackForm() {
	const [error, setError] = useState("");
	const { data: session } = useSession();

	const onSubmit = async ({ title, description }) => {
		if (!session?.user?.id) {
			toast.error("You must be signed in to send feedback.");
			return;
		}

		setError("");
		try {
			const res = await fetch("/api/feedback", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ title, description }),
			});

			if (res.ok) {
				toast.success("Feedback sent successful.");
			} else {
				const data = await res.json();
				setError(data.error || "Failed to send feedback.");
			}
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<>
			<ZodForm
				schema={FeedbackSchema}
				defaultValues={{ title: "", description: "" }}
				fields={[
					{
						name: "title",
						type: "text",
						label: "Title",
						placeholder: "Enter your feedback title",
					},
					{
						name: "description",
						type: "textarea",
						label: "Description",
						placeholder: "Enter description",
					},
				]}
				submitLabel="Submit"
				onSubmit={onSubmit}
				error={error}
			/>
		</>
	);
}
