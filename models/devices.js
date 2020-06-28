const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  deviceId: {type: Number, required: true},
  balance: {type: Number, default: 0},
  countPaySend: {type: Number, default: 7}
})

module.exports = model('Devices', schema)