// https://en.wikipedia.org/wiki/Relative_neighborhood_graph
// http://fisherevans.com/blog/post/dungeon-generation
// https://www.gamasutra.com/blogs/AAdonaac/20150903/252889/Procedural_Dungeon_Generation_Algorithm.php
// https://gamedev.stackexchange.com/questions/75360/connecting-two-arbitrary-points-with-2-lines/75372#75372

import React, { Component } from 'react';
import './app.css';

import DungeonGrid from './abstracts/dungeonGrid.js'
import CaveGrid from './abstracts/caveGrid.js'
import Canvas from './abstracts/canvas.js'
import CanvasNode from './components/canvas/canvas.js'

export default class App extends Component {
	constructor(props) {
		super(props)

		// const condensor = 10

		// const floor = Floor({
		// 	numberOfRooms: 5,
		// 	minRoomSize: 5,
		// 	maxRoomSize: 15,
		// 	hallWidth: 3,
		// 	roomSpacing: 1,
		// 	spawnWidth: window.innerWidth/condensor,
		// 	spawnHeight: window.innerHeight/condensor
		// })
		// const cave = Cave({
		// 	numberOfPoints: 20,
		// 	minCaveSize: 10,
		// 	maxCaveSize: 20,
		// 	spawnWidth: 300,
		// 	spawnHeight: 300
		// })
		const dungeon = DungeonGrid({ width: 200, height: 200, numberOfRooms: 50, minRoomSize: 5, maxRoomSize: 15, roomSpacing: 1 })
		const cave = CaveGrid({ width: 200, height: 200, numberOfRooms: 15, minRoomSize: 8, maxRoomSize: 20, roomSpacing: 5})
		this.state = {
			dungeon,
			cave
		}
	}

	componentDidMount() {
		const canvas = Canvas({})
		// const floor = this.state.floor
		const cave = this.state.cave
		const dungeon = this.state.dungeon

		const updateCanvas = _ => {
			canvas.setDimensions(window.innerWidth, window.innerHeight)
			canvas.clear()

			cave.draw(canvas.ctx, 8, canvas.offset())
			// dungeon.draw(canvas.ctx, 8, canvas.offset())
		}

		window.update = updateCanvas

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
