import Room from './room.js'
import PointConnector from './pointConnector.js'


const Floor = (options) => {
	const { numberOfRooms, roomsToDrop, spawnWidth, spawnHeight, minRoomSize = 10, maxRoomSize = 10, roomSpacing, widthRange, heightRange } = options

	const pointInEllipse = (width, height) => {
		const randomRadian = 2 * Math.PI * Math.random()
		const seed = Math.random() * Math.random()
		let randomizer = null
		if ( seed > 1) {
			randomizer = 2 - seed
		} else {
			randomizer = seed
		}
		return {
			x: Math.round(width * randomizer * Math.cos(randomRadian) / 2),
			y: Math.round(height * randomizer * Math.sin(randomRadian) / 2)
		}
	}

	const random = (min, max) => {
		return min + Math.random() * (max - min)
	}

	let rooms = Array.from({length: numberOfRooms}, _ => {
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

	let haveRoomsBeenDropped = false
	const dropRooms = (amount) => {
		if (haveRoomsBeenDropped) {
			return
		}
		haveRoomsBeenDropped = true

		let dropped = 0
		const percentPerRoom = 1 / rooms.length

		while (dropped < amount) {
			rooms = rooms.filter((room) => {
				if (Math.random() >= 0.7 && dropped < amount) {
					dropped += percentPerRoom
					return false
				}
				return true
			})
		}
	}

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
			if (roomsToDrop !== undefined) {
				dropRooms(roomsToDrop)
			}
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

	const drawNeighborhood = (ctx, gridSize, offset) => {
		const lines = PointConnector().getNeighborhood(rooms.map((room) => { return room.getRect().midPoint }))

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

	const drawHallways = (ctx, gridSize, offset) => {
		const lines = PointConnector().getNeighborhood(rooms.map((room) => { return room.getRect().midPoint }))
		const hallways = lines.map((line) => {
			const bendUp = Math.random() > 0.5 ? true : false
			const startPoint = line.p1
			const endPoint = line.p2
			const midPoint = { x: bendUp ? endPoint.x : startPoint.x, y: bendUp ? startPoint.y : endPoint.y }
			return { p1: startPoint, p2: midPoint, p3: endPoint}
		})
		hallways.forEach((hallway) => {
			ctx.strokeStyle = 'red'
			ctx.lineWidth = 2 * gridSize
			ctx.beginPath()
			ctx.moveTo(hallway.p1.x * gridSize + offset.x, hallway.p1.y * gridSize + offset.y)
			ctx.lineTo(hallway.p2.x * gridSize + offset.x, hallway.p2.y * gridSize + offset.y)
			ctx.lineTo(hallway.p3.x * gridSize + offset.x, hallway.p3.y * gridSize + offset.y)
			ctx.stroke()
			ctx.closePath()
		})
	}

	return Object.assign(
		{
			dropRooms,
			separateRooms,
			separateRoomsEntirely,
			tightenRooms,
			centerRooms,
			rooms,

			draw,
			drawNeighborhood,
			drawHallways
		},
		options
	)
}

export default Floor
