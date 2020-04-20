const router = require('express').Router()

const GemsController = require('../controllers/gemas')
const VerifyToken = require('../middleware/VerifyToken')
const multipart = require('connect-multiparty')

router.get('/getGems', GemsController.getGems)
router.post('/getGems', GemsController.getGems)
router.post('/addGem', GemsController.createGem)
router.post('/getGem', GemsController.getGem)
router.post('/updateGem', GemsController.updateGem)
router.post('/deleteGem', GemsController.deleteGem)
router.use(multipart({
    uploadDir: 'tmp'
}))
router.post('/uploadphoto', GemsController.uploadPhotos)

module.exports = router
