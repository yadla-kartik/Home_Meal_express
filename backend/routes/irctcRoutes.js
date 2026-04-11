const express = require('express')
const { getTrainSummary } = require('../controllers/irctcController')

const router = express.Router()

router.get('/train/:trainNo', getTrainSummary)

module.exports = router
