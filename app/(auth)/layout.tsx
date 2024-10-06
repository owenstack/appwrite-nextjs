import { getAuth } from "@/actions/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AuthLayout({
	children,
}: { children: ReactNode }) {
	const auth = await getAuth();

	if (auth?.user || auth?.session) {
		redirect("/dashboard");
	}

	return (
		<div className="flex flex-col items-center justify-center gap-4 h-screen">
			{children}
		</div>
	);
}
