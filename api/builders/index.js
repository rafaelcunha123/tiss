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
			.then(xml => xml)
	}
}

exports.buildLoteGuiasXml = function(validData) {
	const padrao = validData.cabecalho.padrao
	const tipoTransacao = 'GUIAS'
	const versionBuilder = schemas[padrao]['ansSchema']

	if (!versionBuilder[tipoTransacao]) {
		return Promise.reject({
			message: 'Unhandled "tipoTransacao" for version ' + padrao + '. Supported types are [' + Object.keys(versionBuilder) + ']'
		})
	} else {
		let guias = validData.prestadorParaOperadora.loteGuias.guiasTISS

		return Promise.all(guias.map((guiaJson) => xmlBuild.buildGuiasArray(padrao, guiaJson)))
		// .then(x=>{return x.map(x=> x[0])})
		// .then(x=>{console.log(JSON.stringify(x, null, 2)); return x})
					.then(guias => xmlBuild.buildANSSchema({validData, guias}))
					.then(schema => xmlBuild.buildLoteGuiasArray({validData, schema}))
					.then(xmlBuild.generateXml)
					.then(xml => xml)
	}
}