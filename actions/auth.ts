"use server";

import { unstable_cache as cache } from "next/cache";
import { cookies } from "next/headers";
import { ID, account } from "../lib/appwrite";
import {
	type SignIn,
	type SignUp,
	signInSchema,
	signUpSchema,
} from "../lib/constants";
import type { Models } from "appwrite";

export const signUp = async (values: SignUp) => {
	try {
		const { data, error } = await signUpSchema.safeParseAsync(values);
		if (error) {
			return { error: "Invalid sign up values" };
		}
		const { name, email, password } = data;

		await account.create(ID.unique(), email, password, name);
		return signIn({ email, password });
	} catch (error) {
		console.error("Sign up error:", error);
		return { error: "Failed to sign up. Please try again." };
	}
};

export const signIn = async (values: SignIn) => {
	try {
		const { data, error } = await signInSchema.safeParseAsync(values);
		if (error) {
			return { error: "Invalid email or password" };
		}
		const { email, password } = data;
		const session = await account.createEmailPasswordSession(email, password);
		if (!session) {
			return { error: "Invalid email or password" };
		}
		cookies().set("session", JSON.stringify(session), {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60, // 1 week
		});
		return { success: true };
	} catch (error) {
		console.error("Sign in error:", error);
		return { error: "Invalid email or password" };
	}
};

export const signOut = async () => {
	try {
		await account.deleteSession("current");
		cookies().delete("session");
		return { success: true };
	} catch (error) {
		console.error("Sign out error:", error);
		return { error: "Failed to sign out. Please try again." };
	}
};

export const getAuth = async () => {
	const sessionCookie = cookies().get("session");
	if (!sessionCookie) {
		return null;
	}
	const session: Models.Session = JSON.parse(sessionCookie.value);

	return cache(
		async () => {
			try {
				const user = await account.get();
				return { session, user };
			} catch (error) {
				console.error("Get auth error:", error);
				cookies().delete("session");
				return null;
			}
		},
		["auth", session.userId],
		{ revalidate: 3600 },
	)();
};
