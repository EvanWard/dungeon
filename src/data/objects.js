
import PART from './part.js'

const OBJECT = {
	HAT: {
		key: 'HAT',
		name: 'A Cool Hat',
		parts: [
			PART.ARMOR.SLASHING(1),
			PART.COMMERCE(10)
		]
	},
	APPLE: {
		key: 'APPLE',
		name: 'Apple',
		parts: [
			PART.CONSUMABLE.HEALTH(5),
			PART.COMMERCE(1)
		]
	},
	PROSPECTORS_CHARM: {
		key: 'PROSPECTORS_CHARM',
		name: 'Prospector\'s Charm',
		parts: [
			PART.ACCESSORY,
			PART.INCREASE_DROP.CURRENCY_BY_PERCENT(10)
		]
	}
}

export default OBJECT
