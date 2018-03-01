
const Canvas = (options) => {

	const html = document.querySelector('canvas')
	const ctx = html.getContext('2d')
	const scale = 2

	const setDimensions = (width, height) => {
		html.width = width * scale
		html.height = height * scale
		html.style.width = width + 'px'
		html.style.height = height + 'px'
	}

	const clear = _ => {
		ctx.fillStyle = '#202020'
		ctx.fillRect(0, 0, html.width, html.height)
	}

	const offset = _ => {
		return { x: (html.width / scale / 2) * scale, y: (html.height / scale / 2) * scale }
	}

	return Object.assign(
		{
			html,
			ctx,
			clear,
			setDimensions,
			offset
			
		},
		options
	)
}

export default Canvas
