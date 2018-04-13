import EVENT_TYPE from '../../data/eventType.js'

const SellItemEvent = partOptions => ({
	type: EVENT_TYPE.SELL_ITEM,
	options: {
		value: partOptions ? partOptions.value : 0
	}
})

export default SellItemEvent
