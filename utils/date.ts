/**
 * date Util
 *
 * Contains helper functions for converting date timestamp to readable strings.
 */

/**
 * Formats the date to a readable MM/DD/YY format.
 *
 * @param timestamp - JS timestamp from Date.
 * @returns MM/DD/YY formatted string.
 */
export const formatDate = (timestamp: number): string => {
	const date = new Date(timestamp)
	return date.toLocaleDateString("en-US", {
		year: "2-digit",
		month: "2-digit",
		day: "2-digit",
	})
}

/**
 * Shows how long ago the timestamp was in a readable string.
 *
 * @param timestamp - JS time stamp from Date.
 * @returns x s ago string if time is < 60seconds ago.
 * x m ago if time is < 60mins ago.
 * x h ago if time is < 24hours ago.
 * MM/DD/YY date from formatDate if none of the above.
 */
export const timeAgo = (timestamp: number): string => {
	const now = new Date()
	const past = new Date(timestamp)
	const diff = Math.floor((now.getTime() - past.getTime()) / 1000)

	if (diff < 60) return `${diff}s ago`
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
	if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
	return formatDate(timestamp)
}

/**
 * Converts milliseconds to a MM:SS format.
 *
 * @param ms - Milliseconds to convert.
 * @returns A formatted MM:SS string.
 */
export const msToMinutesSeconds = (ms: number): string => {
	const minutes = Math.floor(ms / 60000)
	const seconds = Math.floor((ms % 60000) / 1000)

	const paddedMinutes = String(minutes).padStart(2, "0")
	const paddedSeconds = String(seconds).padStart(2, "0")

	return `${paddedMinutes}:${paddedSeconds}`
}
