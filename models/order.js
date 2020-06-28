const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
	date: {type: Date, default: Date.now},
  phone: {type: Number, required: true},
  amount: {type: Number, required: true},
  amountCurrency: {type: String, required: true},  
  method: { type: Types.ObjectId, ref: 'Method' },
  description: {type: String, required: true},
  paymentTime: {type: Date},
  paymentId: {type: String},
  paymentTypeName: {type: String, required: true},
  paymentType: {type: String, required: true},
  totalAmount: {type: Number, required: true},
  paymentCurrency: {type: String, required: true},
  status: {type: Number, default: 0},  
})

module.exports = model('Order', schema)