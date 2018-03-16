
import Rect from './rect.js'

const WalkableMap = (options) => {
	const { map, coordinates } = options

	const updateFromMap = (mapUpdates) => {
		const dx = mapUpdates.coordinates.x - coordinates.x
		const dy = mapUpdates.coordinates.y - coordinates.y

		mapUpdates.map.forEach((column, y) => {
			column.forEach((row, x) => {
				if (map[y + dy] && map[y + dy][x + dx] !== undefined) {
					setTile(x + dx, y + dy, mapUpdates.map[y][x])
				}
			})
		})
	}

	const addFromMap = (mapUpdates) => {
		const dx = mapUpdates.coordinates.x - coordinates.x
		const dy = mapUpdates.coordinates.y - coordinates.y

		mapUpdates.map.forEach((column, y) => {
			column.forEach((row, x) => {
				if (map[y + dy] && map[y + dy][x + dx] !== undefined && row) {
					setTile(x + dx, y + dy, true)
				}
			})
		})
	}

	const removeFromMap = (mapUpdates) => {
		const dx = mapUpdates.coordinates.x - coordinates.x
		const dy = mapUpdates.coordinates.y - coordinates.y

		mapUpdates.map.forEach((column, y) => {
			column.forEach((row, x) => {
				if (map[y + dy] && map[y + dy][x + dx] && row) {
					setTile(x + dx, y + dy, false)
				}
			})
		})
	}

	const invert = _ => {
		const invertedMap = map.map((column, y) => {
			return column.map((row, x) => {
				return !map[y][x]
			})
		})

		return WalkableMap({ coordinates, map: invertedMap })
	}

	const doesMapOverlap = (checkMap) => {
		const dx = checkMap.coordinates.x - coordinates.x
		const dy = checkMap.coordinates.y - coordinates.y

		let x, y
		for (y = 0; y < checkMap.map.length; y++) {
			for (x = 0; x < checkMap.map[y].length; x++) {
				if (map[y + dy] && map[y + dy][x + dx] && checkMap.map[y][x]) {
					return true
				}
			}
		}
		return false
	}

	const toString = _ => {
		return map.reduce((string, column) => {
			return string + column.reduce((columnString, row, i) => {
				return columnString + row + (i !== column.length - 1 ? ',' : '')
			}, '[') + ']\n'
		}, '')
	}

	const isEmpty = _ => {
		let y, x
		for (y = 0; y < map.length; y++) {
			for (x = 0; x < map[y].length; x++) {
				if (map[y][x]) {
					return false
				}
			}
		}
		return true
	}

	const setTile = (x, y, bool) => {
		map[y][x] = bool
	}

	const setAll = (bool) => {
		let y, x
		for (y = 0; y < map.length; y++) {
			for (x = 0; x < map[y].length; x++) {
				setTile(x, y, bool)
			}
		}
	}

	const clear = _ => { setAll(false) }
	const fill = _ => { setAll(true) }

	const clone = _ => {
		const cloneMap = map.map((column, y) => {
			return column.map((row, x) => {
				return map[y][x]
			})
		})
		return WalkableMap({
			map: cloneMap,
			coordinates: {...coordinates}
		})
	}

	const normalize = _ => {
		coordinates.x = 0
		coordinates.y = 0
	}

	return Object.assign(
		options,
		{
			clone,
			setTile,
			clear,
			fill,
			normalize,
			invert,
			updateFromMap,
			addFromMap,
			removeFromMap,
			toString,
			isEmpty,
			doesMapOverlap,
			map
		}
	)
}

WalkableMap.Empty = _ => {
	return WalkableMap({ coordinates: { x: 0, y: 0}, map: [[]] })
}

WalkableMap.emptyFromRect = (rect) => {
	const map = Array.from({ length: rect.height }, (nothing, y) => {
		return Array.from({ length: rect.width }, (nothing, x) => {
			return false
		})
	})
	return WalkableMap({
		coordinates: { x: rect.left, y: rect.top },
		map
	})
}

WalkableMap.RectFromWalkable = (walkable) => {
	const coordinates = walkable.coordinates
	const map = walkable.map

	const left = coordinates.x
	const top = coordinates.y
	const right = coordinates.x + map[0].length
	const bottom = coordinates.y + map.length

	return Rect({ left, right, top, bottom })
}

WalkableMap.fromRect = (rect) => {
	const map = Array.from({ length: rect.height }, (nothing, y) => {
		return Array.from({ length: rect.width }, (nothing, x) => {
			return true
		})
	})
	return WalkableMap({
		coordinates: { x: rect.left, y: rect.top },
		map
	})
}

WalkableMap.FromCircle = (circle) => {
	const radius = circle.radius
	const cx = radius
	const cy = radius
	let dx, dy
	const map = Array.from({ length: radius * 2 }, (nothing, y) => {
		return Array.from({ length: radius * 2 }, (nothing, x) => {
			dx = x - cx
			dy = y - cy
			if (dx * dx + dy * dy <= radius * radius) {
				return true
			}
			return false
		})
	})
	return WalkableMap({
		coordinates: { x: circle.coordinates.x - radius, y: circle.coordinates.y - radius },
		map
	})
}

WalkableMap.fromRects = (rects) => {
	const containerRect = Rect.fromRects(rects)
	const map = WalkableMap.emptyFromRect(containerRect)
	let updates
	rects.forEach((rect) => {
		updates = WalkableMap.fromRect(rect)
		map.updateFromMap(updates)
	})
	return map
}

WalkableMap.borderFromRect = (rect) => {
	const map = WalkableMap.fromRect(rect)
	map.updateFromMap(WalkableMap.emptyFromRect(rect.smallerRect(1)))
	return map
}

WalkableMap.BorderMapFromRects = (rects) => {
	const containerRect = Rect.fromRects(rects)
	const walkable = WalkableMap.emptyFromRect(containerRect)
	rects.forEach((rect) => {
		walkable.updateFromMap(WalkableMap.borderFromRect(rect))
	})
	return walkable
}

WalkableMap.MapContainingMaps = (mapA, mapB) => {

	const coordinatesA = mapA.coordinates
	const coordinatesB = mapB.coordinates

	const left = Math.min(coordinatesA.x, coordinatesB.x)
	const top = Math.min(coordinatesA.y, coordinatesB.y)
	const right = Math.max(coordinatesA.x + mapA.map[0].length, coordinatesB.x + mapB.map[0].length)
	const bottom = Math.max(coordinatesA.y + mapA.map.length, coordinatesB.y + mapB.map.length)

	const rect = Rect({ left, right, top, bottom })

	return WalkableMap.emptyFromRect(rect)
}

WalkableMap.FromMaps = (maps) => {
	const walkable = maps.reduce((result, map) => {
		return WalkableMap.MapContainingMaps(result, map)
	}, WalkableMap.Empty())
	maps.forEach((map) => {
		walkable.addFromMap(map)
	})
	return walkable

}

WalkableMap.MapFromOverlaps = (mapA, mapB) => {
	// container map will have the leftmost/topmost coordinates
	// find coordinate differences and loop through the other maps
	// if both mapA and mapB have walkable tiles, set container map tile to true

	const containerMap = WalkableMap.MapContainingMaps(mapA, mapB)

	const dxA = mapA.coordinates.x - containerMap.coordinates.x
	const dyA = mapA.coordinates.y - containerMap.coordinates.y

	const dxB = mapB.coordinates.x - containerMap.coordinates.x
	const dyB = mapB.coordinates.y - containerMap.coordinates.y

	let x, y, overlap
	for (y = 0; y < containerMap.map.length; y++) {
		for (x = 0; x < containerMap.map[y].length; x++) {
			overlap = mapA.map[y - dyA] && mapA.map[y - dyA][x - dxA] && mapB.map[y - dyB] && mapB.map[y - dyB][x - dxB]
			containerMap.setTile(x, y, overlap)
		}
	}

	return containerMap
}

WalkableMap.DoorwayMap = (roomMap, hallwayMap, overlapMap) => {
	const doorMap = overlapMap.clone()
	doorMap.clear()

	const rx = roomMap.coordinates.x - overlapMap.coordinates.x
	const ry = roomMap.coordinates.y - overlapMap.coordinates.y

	const hx = hallwayMap.coordinates.x - overlapMap.coordinates.x
	const hy = hallwayMap.coordinates.y - overlapMap.coordinates.y

	let x, y
	let hallTiles, roomTiles, doorTiles

	for (y = 0; y < overlapMap.map.length; y++) {
		for (x = 0; x < overlapMap.map[y].length; x++) {
			hallTiles = 0
			roomTiles = 0
			doorTiles = 0
			if (overlapMap.map[y][x]) {
				// top
				if (overlapMap.map[y - 1] && overlapMap.map[y - 1][x]) {
					doorTiles++
				} else if (roomMap.map[y - 1 - ry] && roomMap.map[y - 1 - ry][x - rx]) {
					roomTiles++
				} else if (hallwayMap.map[y - 1 - hy] && hallwayMap.map[y - 1 - hy][x - hx]) {
					hallTiles++
				}

				// bottom
				if (overlapMap.map[y + 1] && overlapMap.map[y + 1][x]) {
					doorTiles++
				} else if (roomMap.map[y + 1 - ry] && roomMap.map[y + 1 - ry][x - rx]) {
					roomTiles++
				} else if (hallwayMap.map[y + 1 - hy] && hallwayMap.map[y + 1 - hy][x - hx]) {
					hallTiles++
				}

				// left
				if (overlapMap.map[y][x - 1]) {
					doorTiles++
				} else if (roomMap.map[y - ry] && roomMap.map[y - ry][x - 1 - rx]) {
					roomTiles++
				} else if (hallwayMap.map[y - hy] && hallwayMap.map[y - hy][x - 1 - hx]) {
					hallTiles++
				}

				// left
				if (overlapMap.map[y][x + 1]) {
					doorTiles++
				} else if (roomMap.map[y - ry] && roomMap.map[y - ry][x + 1 - rx]) {
					roomTiles++
				} else if (hallwayMap.map[y - hy] && hallwayMap.map[y - hy][x + 1 - hx]) {
					hallTiles++
				}

				if (hallTiles > 0 && doorTiles > 1 && roomTiles > 0) {
					doorMap.setTile(x, y, true)
				}
			}
		}
	}

	const getHorizontalDoors = (map, sx, y) => {
		const doors = []
		let x = sx
		do {
			doors.push({ y, x: x++ })
		} while (map[y] && map[y][x])
		return doors
	}

	const getVerticalDoors = (map, x, sy) => {
		const doors = []
		let y = sy
		do {
			doors.push({ y: y++, x })
		} while (map[y] && map[y][x])
		return doors
	}

	const pickOneDoor = (walkable, x, y) => {
		let doors
		const map = walkable.map
		if (map[y + 1] && map[y + 1][x]) {
			doors = getVerticalDoors(map, x, y)
		} else if (map[y] && map[y][x + 1]) {
			doors = getHorizontalDoors(map, x, y)
		}
		if (doors && doors.length > 1) {
			//never want the door to be the closest to either end, might be against a wall, plus it looks better
			const keepIndex = Math.floor(Math.random() * doors.length - 2) + 1
			doors.forEach((doorPoint, i) => {
				if (i !== keepIndex) {
					walkable.setTile(doorPoint.x, doorPoint.y, false)
				}
			})
		}
	}

	for (y = 0; y < doorMap.map.length; y++) {
		for (x = 0; x < doorMap.map[y].length; x++) {
			if (doorMap.map[y][x]) {
				pickOneDoor(doorMap, x, y)
			}
		}
	}

	return doorMap
}

export default WalkableMap
