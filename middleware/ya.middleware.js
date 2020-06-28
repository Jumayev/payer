const config = require('config')
var sha1 = require('sha1')

module.exports = (req, res, next) => {
		const {	
			notification_type,
			operation_id,
			amount,
			currency,
			datetime,
			sender,
			codepro,
			label,
			sha1_hash } = req.body

		try {
			const hash = sha1(notification_type+'&'+operation_id+'&'+amount+'&'+currency+'&'+datetime+'&'+sender+'&'+codepro+'&'+config.get("yaSecret")+'&'+label)
			
			if( hash === sha1_hash) {
				next()
			}

				
			} catch (error) {

				res.status(400)
			}


}