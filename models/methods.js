const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  name: {type: String, required: true},
  logo: {type: String, required: true},
  currency: {type: String, required: true},
  exchangeRate: {type: Number, required: true},
  methodType: {type: String, required: true},
  paymentType: {type: String, required: true},
  status: {type: Number}
})

module.exports = model('Methods', schema)