import React, { Component } from 'react';
import './canvas.css';

export default class Canvas extends Component {
	
	render() {
		return (
			<div className='canvas-container'>
				<canvas width={this.props.width} height={this.props.height} />
			</div>
		)
	}
}
