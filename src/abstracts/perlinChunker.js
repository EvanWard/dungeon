import util from './util.js'

const getSquareSeed = (width, height, padding = 1) => {
	let x, y
	return new Array(width * height).fill(0).map((val, i) => {
	  	x = i % width
	    y = Math.floor(i / width)
	  	return x < padding || y < padding || y > (height - padding) || x > (width - padding) ? 0 : Math.random()
	})
}

const getSeed = (length) => {
	return new Array(length).fill(0).map(_ => {
  	return Math.random()
  })
}

const getArrayMin = (array) => {
	return array.reduce((result, val) => {
		return Math.min(result, Array.isArray(val) ? getArrayMin(val) : val)
	}, Number.MAX_SAFE_INTEGER)
}

const getArrayMax = (array) => {
	return array.reduce((result, val) => {
		return Math.max(result, Array.isArray(val) ? getArrayMax(val) : val)
	}, 0)
}

const Normalized2DArray = (array) => {
	const min = getArrayMin(array)
	const max = getArrayMax(array)
	return array.map(r => {
		return r.map(val => {
			return (val - min) / (max - min)
		})
	})
}

const collapseArray = (array) => {
	return array.reduce((result, val) => {
		if (Array.isArray(val)) {
			result.push.apply(result, collapseArray(val))
		} else {
			result.push(val)
		}
		return result
	}, []);
}

const getArrayAverage = (array) => {
	const collapsedArray = collapseArray(array)
	return collapsedArray.reduce((result, val) => {
		return result + val
	}, 0) / collapsedArray.length
}

const getChunk = (seed, chunkWidth, chunkHeight, octaves, bias, mapWidth, mapHeight, sx = 0, sy = 0, transform = undefined) => {
	const map = util.MultiArray(chunkHeight, chunkWidth)
	let noise, scale, scaleAccumulate, pitch, output
	let o, x, y
	for (y = sy; y < sy + chunkHeight; y++) {
		for (x = sx; x < sx + chunkWidth; x++) {
			noise = 0.0
			scale = 1.0
			scaleAccumulate = 0
			for (o = 0; o < octaves; o++) {
				pitch = chunkWidth >> o

				let sampleX1 = Math.floor(x / pitch) * pitch || 0
				let sampleX2 = (sampleX1 + pitch) % (mapWidth || chunkWidth)

				let sampleY1 = Math.floor(y / pitch) * pitch || 0
				let sampleY2 = (sampleY1 + pitch) % (mapHeight || chunkHeight)

				let blendX = pitch ? (x - sampleX1) / pitch : 0
				let blendY = pitch ? (y - sampleY1) / pitch : 0

				let sampleT = (1.0 - blendX) * seed[sampleY1 * chunkWidth + sampleX1] + blendX * seed[sampleY1 * chunkWidth + sampleX2]
				let sampleB = (1.0 - blendX) * seed[sampleY2 * chunkWidth + sampleX1] + blendX * seed[sampleY2 * chunkWidth + sampleX2]

				noise += (blendY * (sampleB - sampleT) + sampleT) * scale
				scaleAccumulate += scale
				scale /= bias
			}
			output = noise / scaleAccumulate
			map[y - sy][x - sx] = transform ? output * transform[y][x] : output
		}
	}
	return map
}

const getAlpha = (n) => {
  return 'rgba(0,0,0,' + (1 - n) + ')'
}

const getSwampFillStyle = (n, elevationPoints) => {
	if (n < elevationPoints.deepWater) {
		return '#473A52'
	}
	if (n < elevationPoints.shallowWater) {
		return '#554A6D'
	}
	if (n < elevationPoints.sand) {
		return '#463831'
	}
	if (n < elevationPoints.ground) {
		return '#243515'
	}
	return '#60722C'
}

const getFillStyle = (n, elevationPoints) => {
	if (n < elevationPoints.deepWater) {
		return 'dodgerblue'
	}
	if (n < elevationPoints.shallowWater) {
		return 'deepskyblue'
	}
	if (n < elevationPoints.sand) {
		return 'palegoldenrod'
	}
	if (n < elevationPoints.ground) {
		return 'darkolivegreen'
	}
	if (n < elevationPoints.highGround) {
		return 'darkseagreen'
	}
	return 'lightgray'
}



const dryElevations = {
	deepWater: .15,
	shallowWater: .25,
	sand: .65,
	ground: .75,
	highGround: .9
}

const normalElevations = {
	deepWater: .2,
	shallowWater: .3,
	sand: .45,
	ground: .6,
	highGround: .8
}

const oceanousElevations = {
	deepWater: .5,
	shallowWater: .6,
	sand: .7,
	ground: .8,
	highGround: .95
}

const PerlinChunker = (options) => {
	const { width, height, chunkSize, scale, bias, transform } = options
	const seed = getSeed(width * height)
	const chunks = {}
	return {
		chunks,
		getChunk(x, y) {
			if (!chunks[x + ',' + y]) {
				chunks[x + ',' + y] = {
					chunk: getChunk(seed, chunkSize, chunkSize, scale, bias, width, height, x * chunkSize, y * chunkSize, transform),
					coordinates: {
						x: x * chunkSize,
						y: y * chunkSize
					}
				}
			}
			return chunks[x + ',' + y]
		}
	}
}

// const chunks = []
// let chunk
// for (let y = 0; y < height; y += chunkSize) {
// 	for (let x = 0; x < width; x += chunkSize) {
//   	chunk = getChunk(seed, chunkSize, chunkSize, 8, 2, x, y, width, height)
// 		//drawChunk(ctx, {x: x, y: y}, chunk, 4, getAlpha)
// 		drawChunk(ctx, {x: x, y: y}, chunk, 4, getSwampFillStyle, normalElevations)
// 		//drawChunk(ctx, {x: x, y: y + height * 2 + 2}, chunk, 4, getFillStyle, oceanousElevations)
//   }
// }

export default PerlinChunker
