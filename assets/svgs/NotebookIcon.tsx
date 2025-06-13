import Svg, { Path } from "react-native-svg"
import Color from "color"

type NotebookIconProps = {
	fill: string
} & React.ComponentProps<typeof Svg>

export default function NotebookIcon({ fill, ...props }: NotebookIconProps) {
	const lighterFill = Color(fill).lighten(0.3).hex()

	return (
		<Svg viewBox='0 0 512 512' {...props}>
			<Path
				d='M42.667 21.333h56.889V64H42.667zM42.667 106.667h56.889v42.667H42.667zM42.667 192h56.889v42.667H42.667zM42.667 277.333h56.889V320H42.667zM42.667 362.667h56.889v42.667H42.667zM42.667 448h56.889v42.667H42.667z'
				fill='#56545a'
			/>
			<Path d='M85.333 0h384v512h-384z' fill={fill} />
			<Path d='M270.222 0h199.111v512H270.222z' fill={lighterFill} />
		</Svg>
	)
}
