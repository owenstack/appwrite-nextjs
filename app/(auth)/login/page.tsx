"use client";

import { signIn } from "@/actions/auth";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { type SignIn, signInSchema } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Page() {
	const [pending, startTransition] = useTransition();
	const form = useForm<SignIn>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	function onSubmit(values: SignIn) {
		startTransition(async () => {
			try {
				const { error } = await signIn(values);
				if (error) {
					toast("Failed to sign in", { description: error });
				}
				redirect("/dashboard");
			} catch (error) {
				console.error(error);
				toast("Failed to sign in", {
					description: `${error}`,
				});
			}
		});
	}
	return (
		<div className="flex flex-col h-full items-center justify-center">
			<Card className="mx-auto max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
							<FormField
								name="email"
								label="Email"
								control={form.control}
								render={({ field }) => (
									<Input
										type="email"
										placeholder="example@example.com"
										{...field}
									/>
								)}
							/>
							<FormField
								name="password"
								control={form.control}
								render={({ field }) => (
									<>
										<div className="flex items-center">
											<Label htmlFor="password">Password</Label>
											<Link
												href="#"
												className="ml-auto inline-block text-sm underline"
											>
												Forgot your password?
											</Link>
										</div>
										<Input id="password" type="password" {...field} />
									</>
								)}
							/>
							<Button type="submit" className="w-full" disabled={pending}>
								{pending ? (
									<LoaderCircle className="w-4 h-4 animate-spin" />
								) : (
									"Log in"
								)}
							</Button>
						</form>
					</Form>
					<Separator className="my-4" />
					<Button variant="outline" className="w-full">
						Login with Google
					</Button>
					<div className="mt-4 text-center text-sm">
						Don&apos;t have an account?{" "}
						<Link href="/signup" className="underline">
							Sign up
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
