const {Router} = require('express')
const Methods = require('../models/methods')
const router = Router()

router.get('/', async (req, res) => {
  try{
    
    const methods = await Methods.find({methodType: 'online'}).select('_id name logo currency exchangeRate')
		const method = {}
    res.json(methods)
    
  } catch (e) {
    res.status(500).json({ message: 'Что то не так'})
  }
})


module.exports = router