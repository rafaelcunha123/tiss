const validator = require('../validators')
const builder = require('../builders')

exports.controller = function(req, res) {
	let dataObject = {
		body: req.body,
		url: req.url.slice(1, req.url.length).toLowerCase()
	}

	validator.validateSchema(dataObject)
		//.then(validObject => res.send('OK!'))

	.then(builder.buildXml)
		.then((xml) => {
			res.json(xml)
		})
		.catch(err => {
			console.log(err)
			res
				.status(400)
				.json(err.message ? err.message : err)
		})
}

exports.loteGuiasController = function(req, res) {
	let dataObject = {
		body: req.body,
		url: req.url.slice(1, req.url.length).toLowerCase()
	}
	validator.validateSchema(dataObject)
		.then(builder.buildLoteGuiasXml)
		.then(guias => {
			// let lote = dataObject.body
			// lote.prestadorParaOperadora.loteGuias.guiasTISS = guias
			// return lote
				res.send(guias)
		})
		// .then(builder.buildXml)
		// .then((xml) => {
		// 	res.json(xml)
		// })
		.catch(err => {
			console.log(err)
			res
				.status(400)
				.json(err.message ? err.message : err)
		})
}