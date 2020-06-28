const {Router} = require('express')
const Services = require('../models/services')
const Field = require('../models/field')
const Validate = require('../models/validation')
const axios = require('axios')
const router = Router()


router.get('/', async (req, res) => {
  try{
    
   const service = {
   	name: 'Tmcell',
   	logo: 'tmmm',
   	fields: [{
	   		label: 'Сумма платежа',
		    name: 'amount',
		    validation: [{
    			isRequired: true,
    			max: true,
    		}]
	   	},
	   	{
	   		label: 'Номер телефона',
	      name: 'phone',
	      validation: [{
    			isRequired: true,
    		}]
	   	}],
  }
    const servise = await Services.find({}).select('-__v')
    	for (let key in servise) {
    		let item = servise[key];
    		let itemFields = await Field.find({services: item._id}).select('-services -__v')
    		item.fields = itemFields
    		for (let field in itemFields) {
    			itemField = itemFields[field]
    			let validations = await Validate.findOne({field: itemField._id}).select('-_id -field -__v')
    			itemField.validation = validations
    			console.log(validations)

    		}
    	}

    res.send(servise)

  } catch (e) {
    res.status(500).json({ message: 'Что то не так'})
  }
})


module.exports = router