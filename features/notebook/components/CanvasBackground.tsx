import { Rect } from "@shopify/react-native-skia"
import GridBackground from "./GridBackground"
import LinesBackground from "./LinesBackground"
import DotsBackground from "./DotsBackground"

export const canvasPatterns = [
	"solid",
	"lines-sm",
	"lines-md",
	"lines-lg",
	"grid-sm",
	"grid-md",
	"grid-lg",
	"dots-sm",
	"dots-md",
	"dots-lg",
] as const

export type CanvasPattern = (typeof canvasPatterns)[number]

interface CanvasBackgroundProps {
	width: number
	height: number
	backgroundColor: string
	pattern?: CanvasPattern
	patternColor: string
}

export default function CanvasBackground({
	width,
	height,
	backgroundColor,
	pattern = "solid",
	patternColor,
}: CanvasBackgroundProps) {
	const spacing = {
		sm: width / 16,
		md: width / 12,
		lg: width / 8,
	}

	return (
		<>
			<Rect x={0} y={0} width={width} height={height} color={backgroundColor} />
			{pattern === "grid-sm" && (
				<GridBackground width={width} height={height} spacing={spacing.sm} color={patternColor} />
			)}
			{pattern === "grid-md" && (
				<GridBackground width={width} height={height} spacing={spacing.md} color={patternColor} />
			)}
			{pattern === "grid-lg" && (
				<GridBackground width={width} height={height} spacing={spacing.lg} color={patternColor} />
			)}
			{pattern === "lines-sm" && (
				<LinesBackground width={width} height={height} spacing={spacing.sm} color={patternColor} />
			)}
			{pattern === "lines-md" && (
				<LinesBackground width={width} height={height} spacing={spacing.md} color={patternColor} />
			)}
			{pattern === "lines-lg" && (
				<LinesBackground width={width} height={height} spacing={spacing.lg} color={patternColor} />
			)}
			{pattern === "dots-sm" && (
				<DotsBackground width={width} height={height} spacing={spacing.sm} color={patternColor} />
			)}
			{pattern === "dots-md" && (
				<DotsBackground width={width} height={height} spacing={spacing.md} color={patternColor} />
			)}
			{pattern === "dots-lg" && (
				<DotsBackground width={width} height={height} spacing={spacing.lg} color={patternColor} />
			)}
		</>
	)
}
