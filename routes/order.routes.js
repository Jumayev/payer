const {Router} = require('express')
const {check, checkSchema, validationResult} = require('express-validator')
const Methods = require('../models/methods')
const Order = require('../models/order')
const SubOrder = require('../models/subOrder')
const axios = require('axios')
const router = Router()


router.post('/', checkSchema({
  phone: {
    matches: {
      options: [/^993(6[12345])[\d]{6}/]
    }
  },
  amount: {
  	isNumeric: {
  		errorMessage: 'not a number'
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
  },
  
}),  async (req, res) => {
	try{
		const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректный данные'
      })
    }

		const { phone, amount, method } = req.body

    const methodInfo = await Methods.findById('5eb9c8100fbbf80710ce343c');
    if (!methodInfo) {
      return res.status(400).json({
        message: 'Некорректный данные'
      })
    }
    const description = 'Оплата за услуги мобильной связи'
    const totalAmount = (amount / methodInfo.exchangeRate).toFixed(2)
    const order = {
      phone,
      amount, 
      amountCurrency: 'TMT',
      method,
      description,
      paymentTypeName: methodInfo.name,
      paymentType: methodInfo.paymentType,
      totalAmount,
      paymentCurrency: methodInfo.currency,
    }
    
    const newOrder = await new Order(order);

    await newOrder.save()

    if (newOrder.amount <= 50) {
      const subOrder = await new SubOrder({
        orderId: newOrder._id,
        amount: newOrder.amount,
        number: newOrder.phone
      })
      await subOrder.save()

    } else {

      const count = Math.floor(newOrder.amount/50)
      const countPlus = newOrder.amount - (50 * count)

      let amounts = Array(count).fill(50)
      amounts.push(countPlus)
      
      for(const value of amounts) {
        const subOrder = await new SubOrder({
          orderId: newOrder._id,
          amount: value,
          number: newOrder.phone
        })
        await subOrder.save()
      }

    }

	  const orders = {
		  receiver: '4100115179362567',
		  formcomment: `Tmpayer.com: Пополнение номера ${newOrder.phone} на ${newOrder.amount} манат `,
		  'short-dest': `Tmpayer.com: Пополнение номера ${newOrder.phone} на ${newOrder.amount} манат `,
		  label: `${newOrder._id}#${newOrder.phone}`,
		  'quickpay-form': 'shop',
		  targets: `Tmpayer.com: Пополнение номера ${newOrder.phone} на ${newOrder.amount} манат `,
		  sum: newOrder.totalAmount,
		  comment: `Хочу пополнить номер ${newOrder.phone} на ${newOrder.amount} манат.`,
		  successURL: `https://tmpayer.com/${newOrder._id}`,
		  paymentType: newOrder.paymentType
		}
		const results = await axios({
            method: 'post',
            url: 'https://money.yandex.ru/quickpay/confirm.xml',
            data: orders,

          })


    res.send({
      success: true,
      url: results.request.res.responseUrl
    })

	} catch (e) {
    console.log(e)
		res.status(500).json({ message: 'Что то не так'})
	}
})

router.get('/:id', async (req, res) => {


})



module.exports = router