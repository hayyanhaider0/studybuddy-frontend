import client from "../client"

export async function createNotebook() {
	const res = await client.post("/notebooks")
	return res.data
}

export async function getNotebooks() {
	const res = await client.get("/notebooks")
	return res.data
}
