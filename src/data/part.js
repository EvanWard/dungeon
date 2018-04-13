
import PART_TYPE from './partType.js'
import CURRENCY from './currency.js'
import INCREASE_TYPE from './increaseType.js'

const PART = {
	CONSUMABLE: {
		HEALTH: value => ({
			type: PART_TYPE.CONSUMABLE.HEALTH,
			health: value
		})
	},
	COMMERCE: (value) => ({
		type: PART_TYPE.COMMERCE,
		value
	}),
	ARMOR: {
		SLASHING: defenseRating => ({
			type: PART_TYPE.ARMOR,
			defenseType: 'slashing',
			defenseRating
		})
	},
	WEAPON: {
		SLASHING: attackRating => ({
			type: PART_TYPE.WEAPON,
			attackType: 'slashing',
			attackRating
		})
	},
	ACCESSORY: {
		type: PART_TYPE.ACCESSORY
	},
	INCREASE_DROP: {
		CURRENCY_BY_PERCENT: percent => ({
			type: PART_TYPE.INCREASE_DROP,
			currencyType: CURRENCY.CREDITS,
			increaseType: INCREASE_TYPE.PERCENT,
			amount: percent

		})
	}
}

export default PART
