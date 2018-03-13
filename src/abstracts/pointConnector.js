
const distanceSquared = (a, b) => {
	const dx = a.x - b.x
	const dy = a.y - b.y
	return dx * dx + dy * dy
}

const PointConnector = _ => {
	const getNeighborhood = (points) => {
		const connections = []
		let pointA, pointB, pointC,
			abDist, acDist, bcDist,
			skip

		for (let i = 0; i < points.length; i++) {
			pointA = points[i]
			for (let j = i + 1; j < points.length; j++) {
				skip = false
				pointB = points[j]
				abDist = distanceSquared(pointA, pointB)
				for (let k = 0; k < points.length; k++) {
					if (k === i || k === j) {
						continue
					}
					pointC = points[k]
					acDist = distanceSquared(pointA, pointC)
					bcDist = distanceSquared(pointB, pointC)

					if (acDist < abDist && bcDist < abDist) {
						skip = true
					}
					if (skip) {
						break
					}
				}
				if (!skip) {
					connections.push({ p1: pointA, p2: pointB })
				}
			}
		}
		return connections
	}

	const getRectNeighborhood = (rects) => {
		const connections = []
		let rectA, rectB, rectC,
			pointA, pointB, pointC,
			abDist, acDist, bcDist,
			skip

		for (let i = 0; i < rects.length; i++) {
			rectA = rects[i]
			pointA = rectA.midPoint
			for (let j = i + 1; j < rects.length; j++) {
				skip = false
				rectB = rects[j]
				pointB = rectB.midPoint
				abDist = distanceSquared(pointA, pointB)
				for (let k = 0; k < rects.length; k++) {
					if (k === i || k === j) {
						continue
					}
					rectC = rects[k]
					pointC = rectC.midPoint
					acDist = distanceSquared(pointA, pointC)
					bcDist = distanceSquared(pointB, pointC)

					if (acDist < abDist && bcDist < abDist) {
						skip = true
					}
					if (skip) {
						break
					}
				}
				if (!skip) {
					connections.push([rectA, rectB])
				}
			}
		}
		return connections
	}

	const getRectConnection = (rectA, rectB) => {
		const heightOverlap = (rectA.bottom < rectB.bottom) ? rectA.bottom - rectB.top : rectB.bottom - rectA.top
		const widthOverlap = (rectA.right < rectB.right) ? rectA.right - rectB.left : rectB.right - rectA.left
		let overlapMiddle
		let halfOverlap
		if (heightOverlap > 3) {
			// horizontal
			halfOverlap = Math.floor(heightOverlap / 2)
			overlapMiddle = (rectA.bottom < rectB.bottom) ? rectB.top + halfOverlap : rectA.top + halfOverlap
			return { start: { x: rectA.midPoint.x, y: overlapMiddle }, end: { x: rectB.midPoint.x, y: overlapMiddle } }
		} else if (widthOverlap > 3) {
			//vertical
			halfOverlap = Math.floor(widthOverlap / 2)
			overlapMiddle = (rectA.right < rectB.right) ? rectB.left + halfOverlap : rectA.left + halfOverlap
			return { start: { x: overlapMiddle, y: rectA.midPoint.y }, end: { x: overlapMiddle, y: rectB.midPoint.y } }
		} else {
			const bendUp = Math.random() > 0.5 ? true : false
			const startPoint = rectA.midPoint
			const endPoint = rectB.midPoint
			const midPoint = { x: (bendUp ? endPoint.x : startPoint.x), y: (bendUp ? startPoint.y : endPoint.y) }
			return { start: startPoint, mid: midPoint, end: endPoint }
		}
	}

	return {
		getNeighborhood,
		getRectNeighborhood,
		getRectConnection
	}
}

export default PointConnector
