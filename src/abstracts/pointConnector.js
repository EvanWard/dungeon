
const PointConnector = _ => {
	const getNeighborhood = (points) => {

		const distanceSquared = (a, b) => {
			const dx = a.x - b.x
			const dy = a.y - b.y
			return dx * dx + dy * dy
		}

		let pointA, pointB, pointC,
			abDist, acDist, bcDist,
			skip

		let connections = []

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

	return {
		getNeighborhood
	}

}

export default PointConnector
