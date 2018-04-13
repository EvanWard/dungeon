import util from './util.js'

const PerlinTransform = (options = {}) => {
	const { width, height, type } = options
	const transform = util.MultiArray(width, height, 1)

	const hardCurve = (x, y) => { return (-Math.pow(2 * x - 1, 4) + 1) + (-Math.pow(2 * y - 1, 4) + 1) - 1 }

	switch (type) {
		case 'square':
			transform.forEach((col, y) => {
				col.forEach((row, x) => {
					transform[y][x] = hardCurve(x / width, y / height)
				})
			})
			break
		default:
			break
	}

	return transform
}

export default PerlinTransform
