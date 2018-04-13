
import React, { Component } from 'react';
import './canvas.css';

export default class Canvas extends Component {

	constructor() {
		super()
		this.state = {
			width: 0,
			height: 0,
			scale: 1
		}
	}

	componentDidMount() {
		this.updateDimensions()
		window.onresize = this.updateDimensions
	}

	updateDimensions() {
		this.setState({
			scale: window.devicePixelRatio,
			width: window.innerWidth,
			height: window.innerHeight
		})
	}

	get width() {
		return this.state && this.state.width
	}

	get height() {
		return this.state && this.state.height
	}

	get scaledWidth() {
		return this.state && this.state.width * this.state.scale
	}

	get scaledHeight() {
		return this.state && this.state.height * this.state.scale
	}

	render() {
		return <canvas width={this.scaledWidth} height={this.scaledHeight} style={{ width: this.width, height: this.height }}></canvas>
	}
}
