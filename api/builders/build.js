const schemas = require('../schemas')
const xmlFactory = require('./xmlFactory.js')

const isFunction = val => (typeof val === 'function')


function sortByOrder(obj1, obj2) {
	if (obj1.order < obj2.order) return -1
	if (obj1.order > obj2.order) return 1
	return 0
}


function valueToSchemaItem(item, validData) {
	const valuesObj = {}
	Object.keys(item).forEach(key => {
		if (isFunction(item[key])) valuesObj[key] = item[key](validData)
	})
	return valuesObj
}

function populateSchema(item, validData) {
	const newItem = Object.assign({}, item, valueToSchemaItem(item, validData))
	if (newItem.include && newItem.include === 'exclude') return undefined
	if (!Array.isArray(newItem.value)) return newItem
	const value = newItem.value.map(i => populateSchema(i, validData)).filter(x => x)
	return Object.assign({}, newItem, {
		value
	})
}


function findPadrao(populatedSchemaArray) {
	populatedSchemaArray.forEach((item) => {
		if (item.edocName === 'padrao') {
			return item.value
		} else {
			if (Array.isArray(item.value)) findPadrao(item.value)
		}
	})
}


exports.buildArray = function(validData) {
	const padrao = validData.cabecalho.padrao
	const tipoTransacao = validData.cabecalho.identificacaoTransacao.tipoTransacao

	const ansRouteSchema = schemas[padrao]['ansSchema'][tipoTransacao]

	return Promise.resolve(ansRouteSchema.map(item => populateSchema(item, validData)).filter(x => x))

}


// -- ELEGIBILIDADE BUILDER --

exports.generateXml = function(populatedSchemaArray) {

	const cabecalhoObj = populatedSchemaArray.filter((item) => {
		return item.edocName === 'cabecalho'
	})[0]
	const padraoObj = cabecalhoObj.value.filter((item) => {
		return item.edocName === 'padrao'
	})
	const padrao = padraoObj[0].value


	const xml = xmlFactory()
		.init(padrao)
		.appendArray(populatedSchemaArray)
		.hash(populatedSchemaArray)
		.finish()
		.writeToFile('elegibilidade')
		.unwrap()
	return Promise.resolve(xml)
}