
const Room = (options) => {
	const { width, height, coordinates } = options

	const shift = (x, y) => {
		coordinates.x = Math.floor(coordinates.x + x)
		coordinates.y = Math.floor(coordinates.y + y)
	}

	const getRect = _ => {
		const x = coordinates.x
		const y = coordinates.y
		return {
			left: x,
			right: x + width,
			top: y,
			bottom: y + height,
			midPoint: { x: x + width / 2, y: y + height / 2},
			area: width * height
		}
	}

	const doesIntersectRoom = (room, padding) => {
		padding = padding || 0
		const selfRect = getRect()
		const roomRect = room.getRect()
		return !(selfRect.right + padding <= roomRect.left || selfRect.left - padding >= roomRect.right || selfRect.top - padding >= roomRect.bottom || selfRect.bottom + padding <= roomRect.top)
	}

	const willIntersectRoom = (room, mx, my) => {
		shift(mx, my)
		const will = doesIntersectRoom(room)
		shift(-mx, -my)
		return will
	}

	const draw = (ctx, gridSize, offset) => {
		// border
		// ctx.fillStyle = 'black'
		// ctx.fillRect((coordinates.x - 1) * gridSize + offset.x, (coordinates.y - 1) * gridSize + offset.y, (width + 2) * gridSize, (height + 2) * gridSize)
		ctx.fillStyle = 'dodgerblue'
		ctx.fillRect(coordinates.x * gridSize + offset.x, coordinates.y * gridSize + offset.y, width * gridSize, height * gridSize)
	}

	return Object.assign(
		{
			coordinates,
			shift,
			getRect,
			doesIntersectRoom,
			willIntersectRoom,

			draw
		},
		options
	)
}

export default Room
