const {Router} = require('express')
const {check, checkSchema, validationResult} = require('express-validator')
const axios = require('axios')
const router = Router()

const orders = {
  receiver: '4100115179362567',
  formcomment: 'Tmpayer.com: Пополнение номера',
  'short-dest': 'fff',
  label: 'phone',
  'quickpay-form': 'shop',
  targets: 'targets',
  sum: 400,
  comment: 'comment',
  successURL: 'https://tmpayer.com',
  paymentType: 'AC'
}

router.post('/', checkSchema({
  phone: {
    matches: {
      options: [/^993(6[12345])[\d]{6}/]
    }
  },
  amount: {
  	isNumeric: {
  		errorMessage: 'Not a number'
  	},
    custom: {
      options: (value => {
            if (value < 20) {
             return Promise.reject("less than 20")
            } else if (value > 350) {
             return Promise.reject("more than 350")
            }
            return Promise.resolve()
        })
      }
  }
  
}), async (req, res) => {
 try{
		const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректный данные'
      })
    }

		const { phone, amount } = req.body

    const results = await axios({
            method: 'post',
            url: 'https://money.yandex.ru/quickpay/confirm.xml',
            data: orders,

          })
      await console.log(results.request.res.responseUrl)


    res.send({
      success: true,
      url: results.request.res.responseUrl
    })

	} catch (e) {
    console.log(e)
		res.status(500).json({ message: 'Что то не так'})
	}




})

module.exports = router