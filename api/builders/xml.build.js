const schemas = require('../schemas')
const xmlFactory = require('./helpers/xml.helper.js')

const isFunction = val => (typeof val === 'function')


function sortByOrder(obj1, obj2) {
	if (obj1.order < obj2.order) return -1
	if (obj1.order > obj2.order) return 1
	return 0
}


function valueToSchemaItem(item, validData) {
	const valuesObj = {}
	if(!Array.isArray(item)){
		Object.keys(item).forEach(key => {
			if (isFunction(item[key])) {
				valuesObj[key] = item[key](validData)
			}
		})
	} 
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



exports.buildGuiasArray = function(padrao, guiaJson) {
	const tipoTransacao = 'GUIAS'
	const tipoGuia = findTipoGuia(guiaJson)

	const ansRouteSchema = schemas[padrao]['ansSchema'][tipoTransacao][tipoGuia]

	//console.log(ansRouteSchema)

	return Promise.resolve(ansRouteSchema.map(item => populateSchema(item, guiaJson)).filter(x => x))
}

function findTipoGuia(guiaJson){
	if('guiaConsulta' in guiaJson) return 'guiaConsulta'
	if('guiaSP-SADT' in guiaJson) return 'guiaSP-SADT'
}



exports.buildANSSchema= function({validData, guias}){
	const padrao = validData.cabecalho.padrao
	const tipoTransacao = validData.cabecalho.identificacaoTransacao.tipoTransacao

	const ansRouteSchema = schemas[padrao]['ansSchema'][tipoTransacao](guias.map(x=>x[0]))
	//console.log(JSON.stringify( ansRouteSchema, null, 2))
	return Promise.resolve(ansRouteSchema)
}

exports.buildLoteGuiasArray = function({validData, schema}) {
	return Promise.resolve(schema.map(item => populateSchema(item, validData)).filter(x => x))
}

// -- ELEGIBILIDADE BUILDER --

exports.generateXml = function(populatedSchemaArray) {
	//console.log(JSON.stringify(populatedSchemaArray,null, 1))

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