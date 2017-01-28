const validator = require('../validators')
const builder = require('../builders')

exports.controller = function(req, res) {
	let dataObject = {
		body: req.body,
		url: req.url.slice(1, req.url.length)
	}


	validator.validateSchema(dataObject)
		
		.then(builder.buildXml)
		.then((xml) => {
			res.json(xml)
		})
		.catch(err => {
			res
				.status(400)
				.json(err.message ? err.message : err)
		})
}