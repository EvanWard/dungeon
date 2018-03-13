
const WalkableRenderer = (options) => {
	const draw = (walkable, ctx, gridSize, offset) => {
		const wx = walkable.coordinates.x
		const wy = walkable.coordinates.y
		walkable.map.forEach((column, y) => {
			column.forEach((row, x) => {
				if (row) {
					ctx.beginPath()
					ctx.rect((x + wx) * gridSize + offset.x, (y + wy) * gridSize + offset.y, gridSize, gridSize)
					ctx.stroke()
					ctx.closePath()
				}
			})
		})
	}

	const fill = (walkable, ctx, gridSize, offset) => {
		const wx = walkable.coordinates.x
		const wy = walkable.coordinates.y

		walkable.map.forEach((column, y) => {
			column.forEach((row, x) => {
				if (row) {
					ctx.beginPath()
					ctx.rect((x + wx) * gridSize + offset.x, (y + wy) * gridSize + offset.y, gridSize, gridSize)
					ctx.fill()
					ctx.closePath()
				}
			})
		})
	}
	return {
		draw,
		fill
	}
}

export default WalkableRenderer
