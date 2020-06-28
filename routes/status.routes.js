const {Router} = require('express')
const {check, checkSchema, validationResult} = require('express-validator')
const Methods = require('../models/methods')
const Order = require('../models/order')
const SubOrder = require('../models/subOrder')
const router = Router()

router.get('/', async (req, res) => {

res.json(req.body)


})

module.exports = router