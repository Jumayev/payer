const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  orderId: {type: Types.ObjectId, required: true},
	date: {type: Date, default: Date.now},
  amount: {type: Number, required: true},
  number: {type: Number, required: true},
  deviceId: {type: Types.ObjectId},
  smsId: {type: Number},
  delivered: {type: Number, default: 0},
  status: {type: Number, default: 0},  
})

module.exports = model('SubOrder', schema)