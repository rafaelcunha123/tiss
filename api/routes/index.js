const express = require('express')
const router = express.Router()

const ctrXml = require('../controllers/xml.controllers.js')

router
	.route('/elegibilidadeVerifica')
	.post(ctrXml.controller)

router
	.route('/solicitacaoProcedimento')
	.post(ctrXml.controller)

router
	.route('/loteGuias')
	.post(ctrXml.controller)

module.exports = router