import Room from './room.js'


const Floor = (options) => {
	const { numberOfRooms, spawnWidth, spawnHeight, minRoomSize = 10, maxRoomSize = 10, roomSpacing, widthRange, heightRange } = options

	const pointInEllipse = (width, height) => {
		const t = 2 * Math.PI * Math.random()
		const u = Math.random() * Math.random()
		let r = null
		if ( u > 1) {
			r = 2 - u
		} else {
			r = u
		}
		return {
			x: Math.round(width * r * Math.cos(t) / 2),
			y: Math.round(height * r * Math.sin(t) / 2)
		}
	}

	const random = (min, max) => {
		return min + Math.random() * (max - min)
	}

	const rooms = Array.from({length: numberOfRooms}, _ => { 
		const point = pointInEllipse(spawnWidth, spawnHeight)
		const width = widthRange ? random(widthRange[0], widthRange[1]) : random(minRoomSize, maxRoomSize)
		const height = heightRange ? random(heightRange[0], heightRange[1]) : random(minRoomSize, maxRoomSize)
		return Room({
			width,
			height,
			coordinates: {
				x: point.x,
				y: point.y
			}
		}) 
	})

	const separateRooms = _ => {
		let roomA, roomB, rectA, rectB, deltaX, deltaY
		let touching = false

		for (let i = 0; i < rooms.length; i++) {
			roomA = rooms[i]
			for (let j = i + 1; j < rooms.length; j++) {
				roomB = rooms[j]

				if (roomA.doesIntersectRoom(roomB, roomSpacing || 1)) {
					touching = true
					rectA = roomA.getRect()
					rectB = roomB.getRect()
					deltaX = Math.max(Math.min(
						Math.abs(rectA.right - rectB.left),
						Math.abs(rectA.left - rectB.right)
					), 1)
					deltaY = Math.max(Math.min(
						Math.abs(rectA.bottom - rectB.top),
						Math.abs(rectA.top - rectB.bottom)
					), 1)

					if (deltaX < deltaY) {
						deltaY = 0
					} else {
						deltaX = 0
					}

					roomA.shift(-deltaX / 2, -deltaY / 2)
					roomB.shift(deltaX / 2, deltaY / 2)
				}
			}
		}

		return touching
	}
	const separateRoomsEntirely = (delay, callbacks) => {
		delay = delay || 500
		if (separateRooms()) {
			setTimeout(_ => {
				separateRoomsEntirely(delay, callbacks)
			}, delay)
			if (typeof callbacks.onIteration === 'function') {
				callbacks.onIteration()
			}
		} else {
			if (typeof callbacks.onCompletion === 'function') {
				callbacks.onCompletion()
			}
		}
	}

	const getFloorCenter = _ => {
		let left, right, top, bottom, rect
		rooms.forEach((room) => {
			rect = room.getRect()
			if (!left || rect.left < left) {
				left = rect.left
			}
			if (!right || rect.right > right) {
				right = rect.right
			}
			if (!top || rect.top < top) {
				top = rect.top
			}
			if (!bottom || rect.bottom > bottom) {
				bottom = rect.bottom
			}
		})
		return { x: left + (right - left) / 2, y: top + (bottom - top) / 2 }
	}

	const tightenRooms = _ => {
		const center = getFloorCenter()
		let roomA, roomB, rectA, deltaX, deltaY, mx, my

		for (let i = 0; i < rooms.length; i++) {
			roomA = rooms[i]
			rectA = roomA.getRect()
			deltaX = rectA.midPoint.x - center.x
			deltaY = rectA.midPoint.y - center.y
			mx = deltaX > 0 ? 1 : deltaX < 0 ? -1 : 0
			my = deltaY > 0 ? 1 : deltaY < 0 ? -1 : 0
			let willIntersect
			for (let j = i + 1; j < rooms.length; j++) {
				roomB = rooms[j]
				if (roomA.willIntersectRoom(roomB, mx, my)) {
					if (!roomA.willIntersectRoom(roomB, mx, 0)) {
						my = 0
						willIntersect = false
						break
					} else if (!roomA.willIntersectRoom(roomB, 0, my)) {
						mx = 0
						willIntersect = false
						break
					} else {
						// will intersect no matter what
						willIntersect = true
						break
					}
				} else {
					willIntersect = false
					break
				}
			}
			if (willIntersect === false) {
				roomA.shift(mx, my)
			}
		}
	}

	const centerRooms = _ => {
		let left, right, top, bottom, rect
		rooms.forEach((room) => {
			rect = room.getRect()
			if (!left || rect.left < left) {
				left = rect.left
			}
			if (!right || rect.right > right) {
				right = rect.right
			}
			if (!top || rect.top < top) {
				top = rect.top
			}
			if (!bottom || rect.bottom > bottom) {
				bottom = rect.bottom
			}
		})

		const width = right - left
		const height = bottom - top

		const deltaX = width / 2 - right
		const deltaY = height / 2 - bottom

		rooms.forEach((room) => {
			room.shift(deltaX, deltaY)
		})
	}

		

	const draw = (ctx, gridSize, offset) => {
		rooms.forEach((room) => {
			room.draw(ctx, gridSize, offset)
		})
	}

	const getNeighborhood = _ => {
		const distanceSquared = (a, b) => {
			const dx = a.x - b.x
			const dy = a.y - b.y
			return dx * dx + dy * dy
		}

		let roomA, roomB, roomC,
			abDist, acDist, bcDist,
			skip

		let lines = []

		for (let i = 0; i < rooms.length; i++) {
			roomA = rooms[i]
			for (let j = i + 1; j < rooms.length; j++) {
				skip = false
				roomB = rooms[j]
				abDist = distanceSquared(roomA.getRect().midPoint, roomB.getRect().midPoint)
				for (let k = 0; k < rooms.length; k++) {
					if (k === i || k === j) {
						continue
					}
					roomC = rooms[k]
					acDist = distanceSquared(roomA.getRect().midPoint, roomC.getRect().midPoint)
					bcDist = distanceSquared(roomB.getRect().midPoint, roomC.getRect().midPoint)

					if (acDist < abDist && bcDist < abDist) {
						skip = true
					}
					if (skip) {
						break
					}
				}
				if (!skip) {
					lines.push({ p1: roomA.getRect().midPoint, p2: roomB.getRect().midPoint })
				}
			}
		}

		return lines
	}

	const drawNeighborhood = (ctx, gridSize, offset) => {
		const lines = getNeighborhood()

		ctx.strokeStyle = 'white'
	    ctx.lineWidth = 1 * gridSize

		lines.forEach((line) => {
			ctx.beginPath()
			ctx.moveTo(line.p1.x * gridSize + offset.x, line.p1.y * gridSize + offset.y)
			ctx.lineTo(line.p2.x * gridSize + offset.x, line.p2.y * gridSize + offset.y)
			ctx.stroke()
			ctx.closePath()
		})
	}

	return Object.assign(
		{
			separateRooms,
			separateRoomsEntirely,
			tightenRooms,
			centerRooms,
			rooms,

			draw,
			drawNeighborhood
		}, 
		options
	)
}

export default Floor
