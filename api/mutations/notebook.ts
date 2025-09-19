import client from "../client"

// Notebooks
export async function createNotebook() {
	const res = await client.post("/notebooks")
	return res.data
}

export async function getNotebooks() {
	const res = await client.get("/notebooks")
	return res.data
}

// Chapters
export async function createChapter() {
	const res = await client.post("/chapters")
	return res.data
}

export async function getChapters() {
	const res = await client.get("/chapters")
	return res.data
}
