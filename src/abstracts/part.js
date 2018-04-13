import PART_TYPE from '../data/partType.js'
import EVENT_TYPE from '../data/eventType.js'
import INCREASE_TYPE from '../data/increaseType.js'

const Part = options => {
	const handleFn = (_ => {
		switch (options.type) {
			default:
				throw new Error('Part type <' + options.type + '> not defined.')
			case PART_TYPE.COMMERCE:
				return (part, partOptions, eventType, eventOptions) => {
					if (~eventType & EVENT_TYPE.SELL_ITEM) {
						return
					}
					eventOptions.value += options.value
				}
			case PART_TYPE.ARMOR:
				return (part, partOptions, eventType, eventOptions) => {
					if (~eventType & EVENT_TYPE.TAKE_DAMAGE) {
						return
					}
					eventOptions.damage[options.defenseType] = eventOptions.damage[options.defenseType] || 0
					eventOptions.damage[options.defenseType] = Math.max(eventOptions.damage[options.defenseType] - options.defenseRating, 0)
				}
			// consumables
			case PART_TYPE.CONSUMABLE.HEALTH:
				return (part, partOptions, eventType, eventOptions) => {
					if (~eventType & EVENT_TYPE.USE_ITEM) {
						return
					}
					eventOptions.health = (eventOptions.health || 0) + options.health
				}
			case PART_TYPE.INCREASE_DROP:
				return (part, partOptions, eventType, eventOptions) => {
					if (~eventType & EVENT_TYPE.GET_CURRENCY || partOptions.currencyType !== eventOptions.currencyType) {
						return
					}
					switch (partOptions.increaseType) {
						case INCREASE_TYPE.PERCENT:
							eventOptions.amount += eventOptions.amount * (partOptions.amount / 100)
							break
					}
				}
			case PART_TYPE.ACCESSORY:
				return _ => {}
		}
	})()
	return {
		handleEvent(event) {
			handleFn(this, options, event.type, event.options)
		}
	}
}

export default Part
