// not compositable
const Point = (options) => {
	let { x, y } = options

	const shift = (mx, my) => {
		x += mx
		y += my
	}

	return {
		get x() {
			return x
		},
		get y() {
			return y
		},
		shift
	}
}

export default Point
