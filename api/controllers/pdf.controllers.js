const path = require('path')
const validator = require('../validators')
const builder = require('../builders')

exports.controller = function(req, res) {
	let dataObject = {
		body: req.body,
		url: 'weakloteguias',
	}


	validator.validateSchema(dataObject)
		.then(builder.buildPdf)
		.then((pdf) => {
			const filePath = path.join(__dirname, '../builders/tissForms/savedPdfs/', pdf.uuid)
			res.download(filePath, pdf.uuid, (err)=>{
			if (err) {
				console.log(err)
				res
					.status(500)
					.json(err)
			}
					else console.log('hooray!', pdf.uuid)
			})
		})
		.catch(err => {
			res
				.status(400)
				.json(err.message ? err.message : err)
		})
}