"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const DashboardAuthWrapper = ({ children }) => {
	const router = useRouter();
	const { status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push("/auth/signin");
		},
	});

	if (status !== "authenticated") {
		return null;
	}

	return <>{children}</>;
};
