
const Rect = (options) => {

	let _left = options.left
	let _top = options.top
	let _right = options.right
	let _bottom = options.bottom

	const width = _right - _left
	const height = _bottom - _top

	const doesIntersectRect = (rect, padding) => {
		padding = padding || 0
		return !(_right + padding <= rect.left ||
				_left - padding >= rect.right ||
				_top - padding >= rect.bottom ||
				_bottom + padding <= rect.top)
	}

	const biggerRect = (amount) => {
		return Rect({
			left: _left - amount,
			right: _right + amount,
			top: _top - amount,
			bottom: _bottom + amount
		})
	}

	const smallerRect = (amount) => {
		return biggerRect(-amount)
	}

	const concat = (rect) => {
		return Rect.fromRects(Rect({_left, _top, _right, _bottom}), rect)
	}

	const shift = (dx, dy) => {
		_left += dx
		_right += dx
		_top += dy
		_bottom += dy

		_left = Math.round(_left)
		_right = Math.round(_right)
		_top = Math.round(_top)
		_bottom = Math.round(_bottom)
	}

	return {
		width,
		height,

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
		get area() {
			return width * height || 0
		},
		get midPoint() {
			return { x: Math.round(_left + width / 2), y: Math.round(_top + height / 2) }
		},
		shift,
		// intersections
		doesIntersectRect,
		// new rects
		concat,
		biggerRect,
		smallerRect
	}
}

Rect.fromLine = (a, b, lineWidth) => {
	let x, y
	let width = b.x - a.x
	let height = b.y - a.y
	if (width < 0) {
		width *= -1
		x = b.x
	} else {
		width = Math.max(width, lineWidth)
		x = a.x
	}
	if (height < 0) {
		height *= -1
		y = b.y
	} else {
		height = Math.max(height, lineWidth)
		y = a.y
	}

	if (a.x !== b.x) {
		width += lineWidth
	}

	const left = x - Math.floor(lineWidth / 2)
	const top = y - Math.floor(lineWidth / 2)

	return Rect({
		left,
		top,
		right: left + width,
		bottom: top + height
	})
}

Rect.fromRects = (rects) => {
	let left, right, top, bottom
	rects.forEach((rect) => {
		left = Math.min(left || Number.MAX_SAFE_INTEGER, rect.left)
		right = Math.max(right || -Number.MAX_SAFE_INTEGER, rect.right)
		top = Math.min(top || Number.MAX_SAFE_INTEGER, rect.top)
		bottom = Math.max(bottom || -Number.MAX_SAFE_INTEGER, rect.bottom)
	})
	return Rect({ left, right, top, bottom })
}

export default Rect
