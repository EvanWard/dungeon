
const Canvas = _ => {
	return {
		canvas: undefined,
		ctx: undefined,
		setElement(canvas) {
			this.canvas = canvas
			this.ctx = canvas.getContext('2d')
		}
	}
}

export default Canvas
