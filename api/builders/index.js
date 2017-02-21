const schemas = require('../schemas')
const xmlBuild = require('./xml.build.js')

exports.buildXml = function(validData) {
	const padrao = validData.cabecalho.padrao
	const tipoTransacao = validData.cabecalho.identificacaoTransacao.tipoTransacao
	const versionBuilder = schemas[padrao]['ansSchema']

	if (!versionBuilder[tipoTransacao]) {
		return Promise.reject({
			message: 'Unhandled "tipoTransacao for version ' + padrao + '. Supported types are [' + Object.keys(versionBuilder) + ']'
		})
	} else {
		return xmlBuild.buildArray(validData)
			.then(xmlBuild.generateXml)
			.then((xml) => {
				return xml
			})
	}
}
