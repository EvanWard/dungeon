
const util = {
	pointInEllipse: (width, height) => {
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
	},
	random: (min, max) => {
		return min + Math.random() * (max - min)
	},
	randomInt: (min, max) => {
		return Math.round(min + Math.random() * (max - min))
	},
	doLinesIntersect: (lineA, lineB) => {
		const a = lineA.points[0].x
		const b = lineA.points[0].y
		const c = lineA.points[1].x
		const d = lineA.points[1].y

		const p = lineB.points[0].x
		const q = lineB.points[0].y
		const r = lineB.points[1].x
		const s = lineB.points[1].y

		let det, gamma, lambda
		det = (c - a) * (s - q) - (r - p) * (d - b)
		if (det === 0) {
			return false
		} else {
			lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det
			gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det
			return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1)
		}
	},
	arrayDifference: (a, b) => {
		const difference = []
		a.forEach((item) => {
			if (b.indexOf(a) < 0) {
				difference.push(a)
			}
		})
		b.forEach((item) => {
			if (a.indexOf(b) < 0 && difference.indexOf(b) < 0) {
				difference.push(b)
			}
		})
		return difference
	}
}

export default util
