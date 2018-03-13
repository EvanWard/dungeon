
import Line from './line.js'
import Rect from './rect.js'

const Room = (options) => {
	const { width, height, coordinates } = options

	const snapCoordinates = _ => {
		coordinates.x = Math.floor(coordinates.x)
		coordinates.y = Math.floor(coordinates.y)
	}

	const shift = (x, y) => {
		coordinates.x += x
		coordinates.y += y
		snapCoordinates()
	}

	const getRect = _ => {
		const x = coordinates.x
		const y = coordinates.y
		return Rect({
			left: x,
			right: x + width,
			top: y,
			bottom: y + height
		})
	}

	const getWalls = _ => {
		const rect = getRect()
		return {
			left: Line({ points: [{ x: rect.left, y: rect.top }, { x: rect.left, y: rect.bottom }] }),
			right: Line({ points: [{ x: rect.right, y: rect.top }, { x: rect.right, y: rect.bottom }] }),
			top: Line({ points: [{ x: rect.left, y: rect.top }, { x: rect.right, y: rect.top }] }),
			bottom: Line({ points: [{ x: rect.left, y: rect.bottom }, { x: rect.right, y: rect.bottom }] })
		}
	}

	const isRoom = (room) => {
		const rectA = getRect()
		const rectB = room.getRect()
		if (rectA.left === rectB.left && rectA.top === rectB.top) {
			return true
		}
		return false
	}

	const draw = (ctx, gridSize, offset) => {
		// border
		// ctx.fillStyle = 'black'
		// ctx.fillRect((coordinates.x - 1) * gridSize + offset.x, (coordinates.y - 1) * gridSize + offset.y, (width + 2) * gridSize, (height + 2) * gridSize)

		ctx.fillRect(coordinates.x * gridSize + offset.x, coordinates.y * gridSize + offset.y, width * gridSize, height * gridSize)
	}

	const drawSpacing = (ctx, gridSize, offset) => {

	}

	const drawBorder = (ctx, gridSize, offset) => {
		const rect = getRect()
		const lineAdjust = 0.5
		ctx.strokeStyle = 'black'
		ctx.lineWidth = gridSize
		ctx.beginPath()
		ctx.moveTo((rect.left - lineAdjust) * gridSize + offset.x, (rect.top - lineAdjust) * gridSize + offset.y)
		ctx.lineTo((rect.right + lineAdjust) * gridSize + offset.x, (rect.top - lineAdjust) * gridSize + offset.y)
		ctx.lineTo((rect.right + lineAdjust) * gridSize + offset.x, (rect.bottom + lineAdjust) * gridSize + offset.y)
		ctx.lineTo((rect.left - lineAdjust) * gridSize + offset.x, (rect.bottom + lineAdjust) * gridSize + offset.y)
		ctx.closePath()
		ctx.stroke()
	}

	snapCoordinates()

	return Object.assign(
		{
			coordinates,
			shift,
			getRect,
			getWalls,
			isRoom,

			draw,
			drawSpacing,
			drawBorder
		},
		options
	)
}

Room.areRoomsEqual = (a, b) => {
	return a.isRoom(b)
}

export default Room
