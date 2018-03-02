// import Room from './room.js'
import Point from './point.js'
import PointConnector from './pointConnector.js'


const Cave = (options) => {
	const { numberOfPoints, spawnWidth, spawnHeight, minCaveSize = 10, maxCaveSize = 10 } = options

	const pointInEllipse = (width, height) => {
		const randomRadian = 2 * Math.PI * Math.random()
		const seed = Math.random()// * Math.random()
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

	const points = Array.from({length: numberOfPoints}, _ => {
		const p = pointInEllipse(spawnWidth, spawnHeight)
		return Point({ x: p.x, y: p.y })
	})

	const dig = _ => {
		PointConnector().getNeighborhood(points).forEach((connection) => {

		})
	}

	const getCaveCenter = _ => {
		let left, right, top, bottom
		points.forEach((point) => {
			if (!left || point.x < left) {
				left = point.x
			}
			if (!right || point.x > right) {
				right = point.x
			}
			if (!top || point.y < top) {
				top = point.y
			}
			if (!bottom || point.y > bottom) {
				bottom = point.y
			}
		})
		return { x: left + (right - left) / 2, y: top + (bottom - top) / 2 }
	}

	const centerCave = _ => {
		let left, right, top, bottom
		points.forEach((point) => {
			if (!left || point.x < left) {
				left = point.x
			}
			if (!right || point.x > right) {
				right = point.x
			}
			if (!top || point.y < top) {
				top = point.y
			}
			if (!bottom || point.y > bottom) {
				bottom = point.y
			}
		})

		const width = right - left
		const height = bottom - top

		const deltaX = width / 2 - right
		const deltaY = height / 2 - bottom

		points.forEach((point) => {
			point.shift(deltaX, deltaY)
		})
	}

	const draw = (ctx, gridSize, offset) => {
		points.forEach((point) => {
			ctx.fillStyle = 'white'
			ctx.beginPath()
			ctx.arc(point.x * gridSize + offset.x, point.y * gridSize + offset.y, gridSize, 0, Math.PI * 2)
			ctx.fill()
			ctx.closePath()
		})
	}

	const drawNeighborhood = (ctx, gridSize, offset) => {
		const lines = PointConnector().getNeighborhood(points)

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
			centerCave,
			points,

			draw,
			drawNeighborhood
		},
		options
	)
}

export default Cave
