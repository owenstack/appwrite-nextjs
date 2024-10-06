"use client";

import { signUp } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type SignUp, signUpSchema } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-separator";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Page() {
	const [pending, startTransition] = useTransition();
	const form = useForm<SignUp>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	function submit(values: SignUp) {
		startTransition(async () => {
			try {
				const { error } = await signUp(values);
				if (error) {
					toast("Failed to sign up", { description: error });
				}
				redirect("/dashboard");
			} catch (error) {
				console.error(error);
				toast("Failed to sign up", {
					description: `${error}`,
				});
			}
		});
	}
	return (
		<Card className="mx-auto max-w-sm">
			<CardHeader>
				<CardTitle className="text-xl">Sign Up</CardTitle>
				<CardDescription>
					Enter your information to create an account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(submit)} className="grid gap-4">
						<FormField
							name="name"
							control={form.control}
							label="Full name"
							render={({ field }) => <Input autoComplete="name" {...field} />}
						/>
						<FormField
							name="email"
							control={form.control}
							label="Email"
							render={({ field }) => (
								<Input autoComplete="email" type="email" {...field} />
							)}
						/>
						<FormField
							name="password"
							control={form.control}
							label="Password"
							render={({ field }) => <Input type="password" {...field} />}
						/>

						<Button type="submit" className="w-full">
							{pending ? (
								<LoaderCircle className="w-4 h-4 animate-spin" />
							) : (
								"Create an account"
							)}
						</Button>
					</form>
				</Form>
				<Separator className="my-4" />
				<Button variant="outline" className="w-full">
					Sign up with Google
				</Button>
				<div className="mt-4 text-center text-sm">
					Already have an account?{" "}
					<Link href="/login" className="underline">
						Sign in
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
