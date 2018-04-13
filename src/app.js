
import React, { Component } from 'react';
import './app.css';

import EVENT_TYPE from './data/eventType.js'
import OBJECT from './data/objects.js'
import CURRENCY from './data/currency.js'

import GameObject from './abstracts/gameObject.js'

import SellItemEvent from './abstracts/events/sellItemEvent.js'
import UseItemEvent from './abstracts/events/useItemEvent.js'
import TakeDamageEvent from './abstracts/events/takeDamageEvent.js'
import GetCurrencyEvent from './abstracts/events/getCurrencyEvent.js'

import CanvasNode from './components/canvas/canvas.js'
import Canvas from './abstracts/canvas.js'

import PerlinChunker from './abstracts/perlinChunker.js'

export default class App extends Component {

	constructor() {
		super()
		this.state = {
			canvas: Canvas(),
			perlinChunker: PerlinChunker({
				width: 128,
				height: 128,
				chunkSize: 16,
				scale: 8,
				bias: 2
			})
		}
	}



	loop() {
		const normalElevations = {
			deepWater: .2,
			shallowWater: .33,
			sand: .45,
			ground: .7,
			highGround: .85
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

		const canvas = this.state.canvas
		canvas.setElement(document.querySelector('canvas'))
		const ctx = canvas.ctx
		ctx.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height)
		const chunker = this.state.perlinChunker
		const size = 128/16
		for (let x = 0; x < size; x++) {
			for (let y = 0; y < size; y++) {
				chunker.getChunk(x, y)
			}
		}
		const gridSize = 8
		Object.values(chunker.chunks).forEach(chunk => {
			for (let y = 0; y < chunk.chunk.length; y++) {
				for (let x = 0; x < chunk.chunk[y].length; x++) {
					ctx.beginPath()
					ctx.fillStyle = getFillStyle(chunk.chunk[y][x], normalElevations)//'rgba(0,0,0, ' + (1 - chunk[y][x]) + ')'
					ctx.fillRect((x + chunk.coordinates.x) * gridSize, (y + chunk.coordinates.y) * gridSize, gridSize, gridSize)
					ctx.closePath()
				}
			}

			for (let y = 0; y < chunk.chunk.length; y++) {
				for (let x = 0; x < chunk.chunk[y].length; x++) {
					ctx.beginPath()
					ctx.fillStyle = 'rgba(0,0,0, ' + (1 - chunk.chunk[y][x]) + ')'
					ctx.fillRect((x + chunk.coordinates.x + 129) * gridSize, (y + chunk.coordinates.y) * gridSize, gridSize, gridSize)
					ctx.closePath()
				}
			}
		})

		// for (let y = 0; y < height; y += chunkSize) {
		// 	for (let x = 0; x < width; x += chunkSize) {
		//   	chunk = getChunk(seed, chunkSize, chunkSize, 8, 2, x, y, width, height)
		// 		//drawChunk(ctx, {x: x, y: y}, chunk, 4, getAlpha)
		// 		drawChunk(ctx, {x: x, y: y}, chunk, 4, getSwampFillStyle, normalElevations)
		// 		//drawChunk(ctx, {x: x, y: y + height * 2 + 2}, chunk, 4, getFillStyle, oceanousElevations)
		// 	}
		// }

		// const gridSize = 10
		// for (let tile of this.state.map.tiles) {
		// 	ctx.beginPath()
		// 	ctx.moveTo(tile.points[0].x * gridSize, tile.points[0].y * gridSize)
		// 	ctx.lineTo(tile.points[1].x * gridSize, tile.points[1].y * gridSize)
		// 	ctx.lineTo(tile.points[2].x * gridSize, tile.points[2].y * gridSize)
		// 	ctx.lineTo(tile.points[3].x * gridSize, tile.points[3].y * gridSize)
		// 	ctx.fillStyle = tile.isWater ? 'rgba(30, 144, 255, 1)' : 'rgba(85, 107, 47, ' + (1 - tile.elevation) +')'
		// 	ctx.fill()
		// 	if (tile.isWater && !tile.isOcean) {
		// 		ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
		// 		ctx.fill()
		// 	}
		// 	ctx.closePath()
		// }

		setTimeout(this.loop.bind(this), 50)
	}

	componentDidMount() {
		this.loop()
	}

	render() {
		const apple = GameObject(OBJECT.APPLE)
		const hat = GameObject(OBJECT.HAT)
		const prospectorsCharm = GameObject(OBJECT.PROSPECTORS_CHARM)
		const event = TakeDamageEvent({ damage: { slashing: 1 } })
		// apple.handleEvent(event)
		// hat.handleEvent(event)


		const getMoney = GetCurrencyEvent({ currencyType: CURRENCY.CREDITS, amount: 100 })

		const character = {
			key: 'player',
			name: 'Blimby',
			health: 10,
			inventory: {
				head: hat,
				necklace: prospectorsCharm
			},
			currency: {

			},
			handleEvent(event) {
				Object.values(this.inventory).forEach(equippedItem => {
					equippedItem.handleEvent(event)
				})
				if (event.type & EVENT_TYPE.TAKE_DAMAGE) {
					this.health -= Object.values(event.options.damage).reduce((total, val) => {
						return total + val
					}, 0)
				}
				if (event.type & EVENT_TYPE.GET_CURRENCY) {
					this.currency[event.options.currencyType] = this.currency[event.options.currencyType] || 0
					this.currency[event.options.currencyType] += event.options.amount
				}
			}
		}

		character.handleEvent(getMoney)
		character.handleEvent(event)

		console.log(character)

		return (
			<div className='app'>
				<CanvasNode />
			</div>
		)
	}
}
