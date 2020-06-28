const {Router} = require('express')
const SubOrder = require('../models/subOrder')
const router = Router()


router.post('/', async (req, res) => {
	
	const {id, id_device, phone, is_delivered} = req.body

	if(is_delivered) {
		const order = await SubOrder.findOne({smsId: id, deviceId: id_device })
		if (order) {
			SubOrder.updateOne({smsId: id, deviceId: id_device}, { $set: {delivered: 1} })
		}
	}
})

module.exports = router