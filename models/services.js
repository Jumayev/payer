const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  name: {type: String, required: true},
  logo: {type: String},
  fields: [{ type: Types.ObjectId, ref: 'Field' }]
})

module.exports = model('Services', schema)