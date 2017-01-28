const schemas = require('../schemas')
const build = require('./build.js')

exports.buildXml = function(validData) {
	const padrao = validData.cabecalho.padrao
	const tipoTransacao = validData.cabecalho.identificacaoTransacao.tipoTransacao
	const versionBuilder = schemas[padrao]['ansSchema']



	if (!versionBuilder[tipoTransacao]) {
		return Promise.reject({
			message: 'Unhandled "tipoTransacao for version ' + padrao + '. Supported types are [' + Object.keys(versionBuilder) + ']'
		})
	} else {
		return build.buildArray(validData)
			.then(build.generateXml)
			.then((xml) => {
				return xml
			})
	}
}