import React, { Component } from 'react';
import './app.css';

import Floor from './abstracts/floor.js'
import Canvas from './abstracts/canvas.js'

import CanvasNode from './components/canvas/canvas.js'

export default class App extends Component {
	constructor(props) {
		super(props)
		const floor = Floor({
			numberOfRooms: 100,
			minRoomSize: 4,
			maxRoomSize: 30,
			spawnWidth: 100,
			spawnHeight: 100,
			roomSpacing: 1
		})
		this.state = {
			floor
		}
	}

	componentDidMount() {
		const canvas = Canvas({})
		const updateCanvas = _ => {
			const width = window.innerWidth
			const height = window.innerHeight
			const floor = this.state.floor
			canvas.setDimensions(width, height)
			floor.separateRoomsEntirely(1, {
				onIteration: _ => {
					canvas.clear()
					floor.centerRooms()
					floor.draw(canvas.ctx, 4, canvas.offset())
				},
				onCompletion: _ => {
					floor.drawNeighborhood(canvas.ctx, 4, canvas.offset())
				}
			})
		}
		this.setState({
			canvas
		})
		window.onresize = updateCanvas
		updateCanvas()
	}

	render() {
		return (
			<div className='app'>
				<CanvasNode />
			</div>
		)
	}
}
