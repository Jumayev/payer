const {Router} = require('express')
const {check, checkSchema, validationResult} = require('express-validator')
const Methods = require('../models/methods')
const Order = require('../models/order')
const Devices = require('../models/devices')
const SubOrder = require('../models/subOrder')
const ya = require('../middleware/ya.middleware')
const axios = require('axios')
const config = require('config')
const router = Router()


router.post('/', ya, async (req, res) => {
	const {	
			operation_id,
			amount,
			datetime,
			label } = req.body

	try {

		if (label.includes('#')) {
			const [id, phone] = label.split('#')

			const order = await Order.findOne({_id: id, phone, totalAmount: amount, status: 0})

			if(!order) {
				return res.status(400).json({
        	message: 'Некорректный данные'
      	})
			}

			const subOrders = await SubOrder.find({orderId: id, number: phone, status: 0})
			
			const devices = await Devices.find()
			for(const item of subOrders) {
				let isSubmit = false
				for (const device of devices) {
					if (device.countPaySend) {
						await device.countPaySend --
						const data = await axios.get(`https://semysms.net/api/3/sms.php?token=${config.get('semySecret')}&device=${device.deviceId}&phone=0804&msg=${item.number} ${item.amount}`, {json: true})
						.then((res) => res.data)

						if (data.id) {
							await Devices.updateOne({ _id: device._id }, { $set: {countPaySend: device.countPaySend} })
							await SubOrder.updateOne({ _id: item._id }, { $set: {status: 1, deviceId: device._id, smsId: data.id} })
						
							isSubmit = true
							}	else {
								isSubmit = false
							}
						break

					}
				}

				if (!isSubmit) {

					await axios({
						method: 'post',
						url: 'https://api.telegram.org/bot1157207605:AAGa_ypxrxR9sItpcw9LqEAV0OnZtNZ4PyI/sendMessage',
						data: {
							chat_id: '-1001120791987',
							text: `Лимит отправки исчерпан. ID заявки: ${item._id}, Сумма: ${item.amount} манат, На номер: ${item.number}.`
						}

					})
				}
			}

			await Order.updateOne({ _id: order._id }, { $set: {status: 1, paymentId: operation_id, paymentTime: datetime} })

			res.status(200)

		}
	} catch (e) {
		console.log(e)
		res.status(500).json({ message: 'Что то не так'})
	}
})

module.exports = router