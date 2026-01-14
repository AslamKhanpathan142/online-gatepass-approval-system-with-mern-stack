const express = require('express');
const {applyGatePass, myGatePass, gatePassRequest, updateGatepassStatus} = require('../controllers/gatepassController')
const {protect, protectRector} = require("../Middleware/protectMiddleware")

const router = express.Router();

router.post('/applyGatePass',protect, applyGatePass);
router.get('/myGatePass', protect, myGatePass)
router.get('/gatepassRequest', protectRector, gatePassRequest)
router.patch('/updateGatepassStatus/:id',protectRector, updateGatepassStatus)

module.exports = router;