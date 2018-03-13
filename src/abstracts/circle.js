
const Circle = (options) => {
	const { radius } = options
	const _coordinates = options.coordinates

	let _left = _coordinates.x - radius
	let _right = _coordinates.x + radius
	let _top = _coordinates.y - radius
	let _bottom = _coordinates.y + radius

	const shift = (dx, dy) => {
		_coordinates.x = Math.round(_coordinates.x + dx)
		_coordinates.y = Math.round(_coordinates.y + dy)

		_left = Math.round(_coordinates.x - radius)
		_right = Math.round(_coordinates.x + radius)
		_top = Math.round(_coordinates.y - radius)
		_bottom = Math.round(_coordinates.y + radius)
	}

	const isPointInCircle = (px, py) => {
		const dx = _coordinates.x - px
		const dy = _coordinates.y - py
		if (dx * dx + dy * dy <= radius * radius) {
			return true
		}
		return false
	}

	return {
		get left() {
			return _left
		},
		get right() {
			return _right
		},
		get top() {
			return _top
		},
		get bottom() {
			return _bottom
		},
		bounds() {
			return { left: _left, right: _right, top: _top, bottom: _bottom }
		},
		get coordinates() {
			return _coordinates
		},
		radius,
		shift,
		isPointInCircle
	}
}

export default Circle
