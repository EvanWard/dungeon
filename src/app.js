// https://en.wikipedia.org/wiki/Relative_neighborhood_graph
// http://fisherevans.com/blog/post/dungeon-generation
// https://www.gamasutra.com/blogs/AAdonaac/20150903/252889/Procedural_Dungeon_Generation_Algorithm.php
// https://gamedev.stackexchange.com/questions/75360/connecting-two-arbitrary-points-with-2-lines/75372#75372

import React, { Component } from 'react';
import './app.css';

import Floor from './abstracts/floor.js'
import Cave from './abstracts/cave.js'
import Canvas from './abstracts/canvas.js'

import CanvasNode from './components/canvas/canvas.js'

export default class App extends Component {
	constructor(props) {
		super(props)
		const floor = Floor({
			numberOfRooms: 100,
			roomsToDrop: 0.5,
			minRoomSize: 3,
			maxRoomSize: 20,
			spawnWidth: window.innerWidth/10,
			spawnHeight: window.innerHeight/10
		})
		const cave = Cave({
			numberOfPoints: 20,
			minCaveSize: 10,
			maxCaveSize: 20,
			spawnWidth: 300,
			spawnHeight: 300
		})
		this.state = {
			floor,
			cave
		}
	}

	componentDidMount() {
		const canvas = Canvas({})
		const floor = this.state.floor
		const cave = this.state.cave

		const onFloorIteration = _ => {
			canvas.clear()
			floor.centerRooms()
			floor.draw(canvas.ctx, 4, canvas.offset())
		}
		const onFloorCompletion = _ => {
			canvas.clear()
			floor.centerRooms()
			floor.draw(canvas.ctx, 4, canvas.offset())
			// floor.drawNeighborhood(canvas.ctx, 4, canvas.offset())
			floor.drawHallways(canvas.ctx, 4, canvas.offset())
		}

		const updateCanvas = _ => {
			canvas.setDimensions(window.innerWidth, window.innerHeight)
			floor.separateRoomsEntirely(1, {
				onIteration: onFloorIteration,
				onCompletion: onFloorCompletion
			})
			// canvas.clear()
			// cave.centerCave()
			// cave.draw(canvas.ctx, 4, canvas.offset())
			// cave.drawNeighborhood(canvas.ctx, 4, canvas.offset())
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
