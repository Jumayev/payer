const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
	services: {type: Types.ObjectId, ref: 'Services'},
  name: {type: String, required: true},
  label: {type: String, required: true},
  mask: {type: String, },
  placeholder: {type: String},
  validation: { 
  	isRequired: {type: Boolean},
  	min: {type: Boolean},
  	max: {type: Boolean},
  	phone: {type: Boolean},
   }
})

module.exports = model('Field', schema)