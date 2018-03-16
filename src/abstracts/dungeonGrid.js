
import util from './util.js'
import PointConnector from './pointConnector.js'

import Rect from './rect.js'
import WalkableMap from './walkableMap.js'
import WalkableRenderer from './walkableRenderer.js'

const DungeonGrid = (options) => {
	const { width, height, minRoomSize, maxRoomSize, numberOfRooms, roomPadding = 0, roomSpacing = 1 } = options

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

			return Rect({
				left,
				right: left + roomWidth + roomPadding,
				top,
				bottom: top + roomHeight + roomPadding
			})
		})
	}

	const getMainRooms = (fromRooms) => {
		const meanArea = getMeanRoomArea(fromRooms)
		const threshold = 1.25

		return fromRooms.filter((rect) => {
			return rect.area > meanArea * threshold
		})
	}

	const getNormalRooms = (fromRooms) => {
		const meanArea = getMeanRoomArea(fromRooms)
		const threshold = 1.25

		return fromRooms.filter((rect) => {
			return rect.area <= meanArea * threshold
		})
	}

	const getMeanRoomArea = (fromRooms) => {
		return fromRooms.reduce((total, rect) => {
			return total + rect.area
		}, 0) / fromRooms.length
	}

	const separateRooms = _ => {
		let rectA, rectB, deltaX, deltaY
		let touching

		do {
			touching = false
			for (let i = 0; i < allRooms.length; i++) {
				rectA = allRooms[i]
				for (let j = i + 1; j < allRooms.length; j++) {
					rectB = allRooms[j]
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

						rectA.shift(-deltaX / 2, -deltaY / 2)
						rectB.shift(deltaX / 2, deltaY / 2)
					}
				}
			}
		} while (touching)
	}

	const centerRooms = _ => {
		let left, right, top, bottom
		allRooms.forEach((rect) => {
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

		const dungeonCenter = { x: Math.round(width / 2), y: Math.round(height / 2) }
		const roomCenter = { x: Math.round(left + (right - left) / 2), y: Math.round(top + (bottom - top) / 2) }

		allRooms.forEach((rect) => {
			rect.shift(dungeonCenter.x - roomCenter.x, dungeonCenter.y - roomCenter.y)
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

		const getWalkableHallways = (rooms) => {
			const neighborhood = PointConnector().getRectNeighborhood(rooms)
			const hallways = neighborhood.map((rects) => {
				return PointConnector().getRectConnection(rects[0], rects[1])
			})
			const hallwayRects = []
			const hallWidth = 3
			let start, mid, end, rectA, rectB
			hallways.forEach((points) => {
				start = points.start
				mid = points.mid
				end = points.end
				if (mid) {
					rectA = Rect({
						left: Math.min(start.x, mid.x) - Math.floor(hallWidth / 2),
						top: Math.min(start.y, mid.y) - Math.floor(hallWidth / 2),
						right: Math.max(start.x, mid.x) + Math.ceil(hallWidth / 2),
						bottom: Math.max(start.y, mid.y) + Math.ceil(hallWidth / 2)
					})
					rectB = Rect({
						left: Math.min(mid.x, end.x) - Math.floor(hallWidth / 2),
						top: Math.min(mid.y, end.y) - Math.floor(hallWidth / 2),
						right: Math.max(mid.x, end.x) + Math.ceil(hallWidth / 2),
						bottom: Math.max(mid.y, end.y) + Math.ceil(hallWidth / 2)
					})
					hallwayRects.push(rectA)
					hallwayRects.push(rectB)
				} else {
					rectA = Rect({
						left: Math.min(start.x, end.x) - Math.floor(hallWidth / 2),
						top: Math.min(start.y, end.y) - Math.floor(hallWidth / 2),
						right: Math.max(start.x, end.x) + Math.ceil(hallWidth / 2),
						bottom: Math.max(start.y, end.y) + Math.ceil(hallWidth / 2)
					})
					hallwayRects.push(rectA)
				}
			})
			return WalkableMap.fromRects(hallwayRects)
		}

		const getHallwaysAndSideRooms = (allRooms) => {
			const walkable = getWalkableHallways(getMainRooms(allRooms))
			let filled, empty
			getNormalRooms(allRooms).forEach((rect) => {
				filled = WalkableMap.fromRect(rect)
				if (walkable.doesMapOverlap(filled)) {
					walkable.updateFromMap(filled)
				} else {
					empty = WalkableMap.emptyFromRect(rect)
					walkable.updateFromMap(empty)
				}
			})

			return walkable
		}

		const drawEntrances = (allRooms) => {
			const mainRooms = getMainRooms(allRooms)
			const renderer = WalkableRenderer()

			const roomWalkable = WalkableMap.fromRects(mainRooms)
			const hallwayWalkable = getHallwaysAndSideRooms(allRooms)

			const borderWalkable = WalkableMap.BorderMapFromRects(mainRooms)
			const overlapWalkable = WalkableMap.MapFromOverlaps(borderWalkable, hallwayWalkable)
			const doorWalkable = WalkableMap.DoorwayMap(roomWalkable, hallwayWalkable, overlapWalkable)

			roomWalkable.removeFromMap(borderWalkable)
			hallwayWalkable.removeFromMap(borderWalkable)

			mainRooms.forEach((rect) => {
				hallwayWalkable.updateFromMap(WalkableMap.emptyFromRect(rect))
			})

			// const overlaps = WalkableMap.overlapMapFromMaps(hallwayWalkable, roomWalkable)

			// ctx.fillStyle = 'dodgerblue'
			// renderer.fill(roomWalkable, ctx, gridSize, { x: ox, y: oy })

			// ctx.fillStyle = 'white'
			// renderer.fill(hallwayWalkable, ctx, gridSize, { x: ox, y: oy })

			// ctx.fillStyle = 'limegreen'
			// renderer.fill(doorWalkable, ctx, gridSize, { x: ox, y: oy })

			const totalWalkable = WalkableMap.FromMaps([roomWalkable, hallwayWalkable, doorWalkable])
			totalWalkable.normalize()
			ctx.strokeStyle = 'white'
			renderer.draw(totalWalkable, ctx, gridSize, { x: ox, y: oy })
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

		// drawMainRooms()
		// drawMainBorders()

		ctx.strokeStyle = 'white'

		drawEntrances(allRooms)
	}

	return {
		draw
	}
}

export default DungeonGrid
