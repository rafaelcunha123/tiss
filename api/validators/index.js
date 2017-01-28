const joi = require('joi')
const Promise = require('bluebird')
const validate = Promise.promisify(joi.validate)
const schemas = require('../schemas')

exports.validateSchema = function(dataObject) {
	console.log('schema', schemas[dataObject.body.cabecalho.padrao]['edocSchema'])
	console.log('url',dataObject.url)
	console.log(schemas[dataObject.body.cabecalho.padrao]['edocSchema'][dataObject.url])
	if (!dataObject.body.cabecalho) {
		return Promise.reject({
			message: "Missing 'cabecalho' key in body"
		})
	} else if (!dataObject.body.cabecalho.padrao) {
		return Promise.reject({
			message: "Missing 'padrao' key in cabecalho"
		})
	} else if (!schemas[dataObject.body.cabecalho.padrao]) {
		return Promise.reject({
			message: "Unhandled 'padrao'. API accepts only [" + Object.keys(schemas) + "]"
		})
	}
	
	
	return validate(dataObject.body, schemas[dataObject.body.cabecalho.padrao]['edocSchema'][dataObject.url], {
		//allowUnknown: true
	})

}