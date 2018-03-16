
import util from './util.js'
import PointConnector from './pointConnector.js'

import Rect from './rect.js'
import Circle from './circle.js'
import WalkableMap from './walkableMap.js'
import WalkableRenderer from './walkableRenderer.js'

const CaveGrid = (options) => {
	const { width, height, minRoomSize, maxRoomSize, numberOfRooms, roomPadding = 0, roomSpacing = 0 } = options

	const dungeonRect = Rect({ left: 0, top: 0, right: width, bottom: height })

	let allRooms
	const generateRooms = _ => {
		let roomWidth, roomHeight, point, left, top
		allRooms = Array.from({ length: numberOfRooms }, _ => {
			roomWidth = util.randomInt(minRoomSize, maxRoomSize)
			roomHeight = util.randomInt(minRoomSize, maxRoomSize)

			point = util.pointInEllipse(width / 2, height / 2)

			left = Math.round(point.x + width / 2) - roomPadding
			top = Math.round(point.y + height / 2) - roomPadding

			return Circle({
				radius: Math.round(util.random(minRoomSize, maxRoomSize) / 2),
				coordinates: { x: left, y: top }
			})
		})
	}

	const separateRooms = _ => {
		let circleA, circleB
		let rectA, rectB, deltaX, deltaY
		let touching

		do {
			touching = false
			for (let i = 0; i < allRooms.length; i++) {
				circleA = allRooms[i]
				rectA = Rect({...circleA.bounds()})
				for (let j = i + 1; j < allRooms.length; j++) {
					circleB = allRooms[j]
					rectB = Rect({...circleB.bounds()})

					if (rectA.doesIntersectRect(rectB, roomSpacing)) {
						touching = true
						deltaX = Math.max(Math.min(
							Math.abs(rectA.right - rectB.left),
							Math.abs(rectA.left - rectB.right)
						), 1)

						deltaY = Math.max(Math.min(
							Math.abs(rectA.bottom - rectB.top),
							Math.abs(rectA.top - rectB.bottom)
						), 1)

						if (Math.random() > 0.5) {
							if (deltaX < deltaY) {
								deltaY = 0
							} else {
								deltaX = 0
							}
						} else {
							if (deltaY < deltaX) {
								deltaX = 0
							} else {
								deltaY = 0
							}
						}

						circleA.shift(-deltaX / 2, -deltaY / 2)
						circleB.shift(deltaX / 2, deltaY / 2)

						rectA = Rect({...circleA.bounds()})
					}
				}
			}
		} while (touching)
	}

	const centerRooms = _ => {
		let left, right, top, bottom
		allRooms.forEach((circle) => {
			if (!left || circle.left < left) {
				left = circle.left
			}
			if (!right || circle.right > right) {
				right = circle.right
			}
			if (!top || circle.top < top) {
				top = circle.top
			}
			if (!bottom || circle.bottom > bottom) {
				bottom = circle.bottom
			}
		})

		const dungeonCenter = { x: Math.round(width / 2), y: Math.round(height / 2) }
		const roomCenter = { x: Math.round(left + (right - left) / 2), y: Math.round(top + (bottom - top) / 2) }

		allRooms.forEach((circle) => {
			circle.shift(dungeonCenter.x - roomCenter.x, dungeonCenter.y - roomCenter.y)
		})
	}

	const draw = (ctx, gridSize, offset) => {

		const ox = offset.x - (width * gridSize) / 2
		const oy = offset.y - (height * gridSize) / 2

		const drawRectGrid = (rect) => {
			let x, y
			for (y = rect.top + 1; y < rect.bottom; y++) {
				ctx.beginPath()
				ctx.moveTo(rect.left * gridSize + ox, y * gridSize + oy)
				ctx.lineTo(rect.right * gridSize + ox, y * gridSize + oy)
				ctx.stroke()
				ctx.closePath()
			}
			for (x = rect.left + 1; x < rect.right; x++) {
				ctx.beginPath()
				ctx.moveTo(x * gridSize + ox, rect.top * gridSize + oy)
				ctx.lineTo(x * gridSize + ox, rect.bottom * gridSize + oy)
				ctx.stroke()
				ctx.closePath()
			}
		}

		const drawRectBorder = (rect) => {
			ctx.beginPath()
			ctx.rect(rect.left * gridSize + ox, rect.top * gridSize + oy, rect.width * gridSize, rect.height * gridSize)
			ctx.stroke()
			ctx.closePath()
		}

		const drawCircle = (circle) => {
			let x, y
			for (y = circle.top; y < circle.bottom; y++) {
				for (x = circle.left; x < circle.right; x++) {
					if (circle.isPointInCircle(x, y)) {
						ctx.beginPath()
						ctx.rect(x * gridSize + ox, y * gridSize + oy, gridSize, gridSize)
						ctx.stroke()
						ctx.closePath()
					}
				}
			}
		}

		// generation
		generateRooms()
		separateRooms()
		centerRooms()

		// drawing
		// ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
		// drawRectGrid(dungeonRect)
		// ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
		// drawRectBorder(dungeonRect)

		const caveRect = Rect.fromRects(allRooms.map((circle) => { return circle.bounds() }))
		const hallWalkable = WalkableMap.emptyFromRect(caveRect)
		const mainWalkable = WalkableMap.emptyFromRect(caveRect)

		allRooms.forEach((circle) => {
			mainWalkable.addFromMap(WalkableMap.FromCircle(circle))
		})

		let p1, p2, dx, dy, distance, d, circleWalkable, angle, radius
		const tunnels = PointConnector().getCircleNeighborhood(allRooms)

		const connections = []
		const addConnection = (circles, denyThreshold = 0) => {
			let connection1, connection2, index1, index2
			connections.forEach((connection) => {
				index1 = connection.indexOf(circles[0]) > -1 ? connection.indexOf(circles[0]) : undefined
				index2 = connection.indexOf(circles[1]) > -1 ? connection.indexOf(circles[1]) : undefined
				connection1 = index1 < 0 ? undefined : connection
				connection2 = index2 < 0 ? undefined : connection
			})
			// if connections doesn't have either circle create new connection
			if (!connection1 && !connection2) {
				connections.push(circles)
			}
			// if connection has one circle, but other circle is not connected add unconnected circle to connected circle
			else if (!!connection1 !== !!connection2) {
				if (connection1) connection1.push(circles[1])
				else if (connection2) connection2.push(circles[0])
			}
			// if both circles are in different connections, merge connections
			else if (index1 !== index2) {
				connections.splice(index1, 1)
				connections.splice(index2, 1)
				connections.push(connection1.concat(connection2))
			}
			// if circles are in same connection do nothing
		}

		tunnels.forEach((circles) => {
			addConnection(circles)
			p1 = circles[0].coordinates
			p2 = circles[1].coordinates
			dx = p2.x - p1.x
			dy = p2.y - p1.y
			distance = Math.sqrt(dx * dx + dy * dy)
			angle = Math.atan2(dy, dx)
			for (d = 0; d < distance; ) {
				radius = util.randomInt(2, 4)
				circleWalkable = WalkableMap.FromCircle(Circle({
					coordinates: { x: Math.round(p1.x + Math.cos(angle) * d), y: Math.round(p1.y + Math.sin(angle) * d) },
					radius
				}))
				hallWalkable.addFromMap(circleWalkable)
				d += radius
			}
		})

		ctx.fillStyle = 'white'
		const renderer = WalkableRenderer()
		renderer.fill(hallWalkable, ctx, gridSize, { x: ox, y: oy })
		// ctx.fillStyle = 'dodgerblue'
		renderer.fill(mainWalkable, ctx, gridSize, { x: ox, y: oy })

	}

	return {
		draw
	}
}

export default CaveGrid
