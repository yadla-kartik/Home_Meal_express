const express = require('express')
const { addAdmin, getAllAdmins, removeAdmin } = require('../controllers/superAdmin')

const router = express.Router()

router.post('/admins', addAdmin)
router.get('/admins', getAllAdmins)
router.delete('/admins/:id', removeAdmin)

module.exports = router
