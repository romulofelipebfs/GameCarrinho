const express = require('express')
const router = express.Router()

const GameController = require('../controllers/GameController')

//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/', GameController.home)
router.get('/create', checkAuth, GameController.create)
router.get('/edit/:id', checkAuth, GameController.update)
router.get('/verCarrinho', checkAuth, GameController.verCarrinho)
router.post('/update', checkAuth, GameController.updateSave)
router.post('/remove', checkAuth,GameController.delete)
router.post('/add', checkAuth,GameController.addGame)

module.exports = router