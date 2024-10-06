import { Account, Client } from "appwrite";

export const client = new Client();

const key = process.env.APPWRITE_FUNCTION_KEY;

if (!key) {
	throw new Error("APPWRITE_FUNCTION_KEY environment variable not set");
}

client.setEndpoint("https://cloud.appwrite.io/v1").setProject(key);

export const account = new Account(client);
export { ID } from "appwrite";
