"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "./db";

export async function addNewsletterSubscriber(email) {
	try {
		// Validate the email
		if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
			return { success: false, message: "Invalid email address" };
		}

		// Check if email already exists
		const existingSubscriber = await prisma.newsletter.findUnique({
			where: { email },
		});

		if (existingSubscriber) {
			return {
				success: false,
				message: "This email is already subscribed.",
			};
		}

		// Save to the database
		const newSubscriber = await prisma.newsletter.create({
			data: {
				email,
			},
		});
		return {
			success: true,
			message: "Subscription successful!",
			data: newSubscriber,
		};
	} catch (error) {
		return {
			success: false,
			message: error.message || "An error occurred while subscribing",
		};
	}
}

export async function saveContact({ email, full_name, message }) {
	if (!email || !full_name || !message) {
		throw new Error("All fields are required.");
	}

	try {
		const contact = await prisma.contact.create({
			data: {
				email,
				full_name,
				message,
			},
		});
		return {
			success: true,
			message: "Will get back to you soon.",
			contact,
		};
	} catch (error) {
		return { success: false, error: error.message };
	}
}

export async function updateUserProfile(first_name, last_name) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return {
				status: "error",
				message: "Unauthorized",
				error: "You must be signed in to update your profile.",
			};
		}

		// Update the user profile in the database
		const updatedUser = await prisma.user.update({
			where: { id: session.user.id },
			data: {
				first_name,
				last_name,
			},
		});

		// Return the updated user profile
		return {
			status: "success",
			message: "User profile updated successfully",
			user: updatedUser,
		};
	} catch (error) {
		// Handle the error
		return {
			status: "error",
			message: "Failed to update user profile",
			error: error.message,
		};
	}
}

export async function getUser() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		return { success: false, user: {} };
	}

	try {
		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				email: true,
				first_name: true,
				last_name: true,
				credits: true,
				image: true,
			},
		});
		return { success: true, user };
	} catch (error) {
		return { success: false, user: {}, error: error.message };
	}
}
