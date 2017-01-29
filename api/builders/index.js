const _ = require('lodash')
const schemas = require('../schemas')
const xmlBuild = require('./xml.build.js')
const pdfBuild = require('./pdf.build.js')

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

exports.buildPdf = function(validData) {
	const padrao = validData.cabecalho.padrao
	const form = Object.keys(validData.prestadorParaOperadora.loteGuias.guiaTISS).filter(data =>{
		return data.slice(0,4) === 'guia'
	})[0]
	console.log(form)

	if (!pdfBuild[padrao]) {
		return Promise.reject({
			message: 'Unhandled "padrao" ' + padrao + ' to print SP/SADT pdf form. Supported are [' + Object.keys(pdfBuild) + ']' 
		})
	} else if (!pdfBuild[padrao][form]) {
		return Promise.reject({
			message: 'Unhandled pdf print of ' + validData.formName + ' form for version ' + padrao + '. Supported forms are [' + Object.keys(pdfBuild[padrao]) + ']'
		})
	} else {
		return pdfBuild[padrao][form](validData)
	}


}