import EVENT_TYPE from '../../data/eventType.js'

const TakeDamageEvent = partOptions => ({
	type: EVENT_TYPE.TAKE_DAMAGE,
	options: {
		damage: partOptions.damage
	}
})

export default TakeDamageEvent
