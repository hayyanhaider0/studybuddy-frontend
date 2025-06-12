export const formatDate = (timestamp: number): string => {
	const date = new Date(timestamp)
	return date.toLocaleDateString("en-US", {
		year: "2-digit",
		month: "2-digit",
		day: "2-digit",
	})
}

export const timeAgo = (timestamp: number): string => {
	const now = new Date()
	const past = new Date(timestamp)
	const diff = Math.floor((now.getTime() - past.getTime()) / 1000)

	if (diff < 60) return `${diff}s ago`
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
	if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
	return formatDate(timestamp)
}
