let router = require('express').Router()
let AuthController = require('../controllers/Auth')
router.post('/login', AuthController.loginUser)
router.post('/logout', AuthController.logoutUser)
router.get('/me', AuthController.getCurrentUser)
router.post('/signup', AuthController.signInUser)

module.exports = router
