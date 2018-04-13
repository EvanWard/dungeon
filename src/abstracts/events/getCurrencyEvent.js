import EVENT_TYPE from '../../data/eventType.js'

const GetCurrencyEvent = partOptions => {
	if (!partOptions.currencyType) throw new Error('GetCurrencyEvent.options.currencyType not defined')
	if (isNaN(partOptions.amount)) throw new Error('GetCurrencyEvent.options.amount not defined')

	return {
		type: EVENT_TYPE.GET_CURRENCY,
		options: {
			currencyType: partOptions.currencyType,
			amount: partOptions.amount
		}
	}
}

export default GetCurrencyEvent
