const express = require('express')
const router = express.Router()

const ctrXml = require('../controllers/xml.controllers.js')
const ctrlPdf = require('../controllers/pdf.controllers.js')

router
	.route('/elegibilidadeVerifica')
	.post(ctrXml.controller)

router
	.route('/solicitacaoProcedimento')
	.post(ctrXml.controller)

router
	.route('/loteGuias')
	.post(ctrXml.controller)

router
	.route('/pdf')
	.post(ctrlPdf.controller)

module.exports = router