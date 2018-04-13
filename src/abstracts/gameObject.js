
import Part from './part.js'

const GameObject = (options) => {
	const parts = []
	let state = {
		name: options.name,
		handleEvent(event) {
			parts.forEach(part => part.handleEvent(event))
		}
	}
	let part
	options.parts.forEach(partJSON => {
		part = Part(partJSON)
		part.parentObject = state
		parts.push(part)
	})
	return state
}

export default GameObject
