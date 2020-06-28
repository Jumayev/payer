const config = require('config')
const axios = require('axios')
const Devices = require('../models/devices')


module.exports = (req, res, next) => {
		const {	id } = req.body

		

		async function getSms(id) {
			if (id) {

				let sms

				const devices = await Devices.find().select('deviceId')
				for (device of devices) {
					const response = await axios.get(`https://semysms.net/api/3/inbox_sms.php?token=dd0540fcff3b1910779d7eefbbd41576&device=${device.deviceId}&start_id=${id}`, {json: true}).then((res) => res.data )
					if (response.count) {
						for (const message of response.data) {
	
							if(message.id == id) sms = message
						}
					}
				}
				

				if(sms && sms.phone == '0801') {
					req.sms = sms
					next()
				}
			}
		}

		getSms(id)
}