const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
	field: {type: Types.ObjectId, ref: 'Field'},
  isRequired: {type: Boolean, required: true},
  max: {type: Boolean},
})

module.exports = model('Validation', schema)