const {Router} = require('express')
const {check, checkSchema, validationResult} = require('express-validator')
const Methods = require('../models/methods')
const Order = require('../models/order')
const SubOrder = require('../models/subOrder')
const sms = require('../middleware/sms.middleware')
const axios = require('axios')
const router = Router()


router.post('/', sms, async (req, res) => {
	const {
    id,
    phone,
    msg
  } = req.sms

  const message = msg.split(' ')

  try {

    if(message.length === 9) {

      const [date, time, number, send, amount, currency, withheld, ,   ] = msg.split(' ')

      const subOrder = await SubOrder.findOne({
        amount, 
        number, 
        status: 1  })

      if (subOrder) {
        await SubOrder.updateOne(
          { _id: subOrder._id}, 
          { $set: {status: 2, }}
        )

        const subOrders = await SubOrder.find(
          {orderId: subOrder.orderId, number, status: 1 }
        )

        if (!subOrders.length) {
          await Order.updateOne(
            {_id: subOrder.orderId}, 
            {$set: {status: 2}}
          )
          const order = await Order.findOne({_id: subOrder.orderId})
          await axios({
            method: 'post',
            url: 'https://api.telegram.org/bot1157207605:AAGa_ypxrxR9sItpcw9LqEAV0OnZtNZ4PyI/sendMessage',
            data: {
              chat_id: '-1001120791987',
              text: `Заявка успешно завершен! ID заявки: ${order._id}, Сумма: ${order.amount} манат, На номер: ${order.phone}`
            }

          })
        }
      }
    }

  }catch (e) {

  }


})


module.exports = router