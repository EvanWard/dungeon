
const util = {
	MultiArray(height, width, fill = undefined) {
		let row
		return new Array(height).fill(0).map(_ => {
			row = new Array(width)
			if (fill) {
				row.fill(fill)
			}
			return row
		})
	}
}

export default util
