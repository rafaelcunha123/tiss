const joi = require('joi')
const r = require('ramda')
const moment = require('moment')
const isStr = r.is(String)

exports.customJoi = joi.extend({
	name: 'string',
	base: joi.string(),
	language: {
		isDateStr: 'must be a valid date in the format AAAA-MM-DD',
		isHourStr: 'must be a valid hour in the format HH:mm:ss',
		isCPF: 'must be a valid CPF',
		isCNPJ: 'must be a valid CNPJ'
	},
	rules: [{
		name: 'isCPF',
		validate(params, value, state, options) {
			if (isCPF(value)) {
				return value
			} else {
				return this.createError('string.isCPF', {
					v: value
				}, state, options)
			}
		}
	}, {
		name: 'isCNPJ',
		validate(params, value, state, options) {
			if (isCNPJ(value)) {
				return value
			} else {
				return this.createError('string.isCNPJ', {
					v: value
				}, state, options)
			}
		}
	}, {
		name: 'isDateStr',
		validate(params, value, state, options) {
			if (isDateStr(value)) {
				return value
			} else {
				return this.createError('string.isDateStr', {
					v: value
				}, state, options)
			}
		}
	}, {
		name: 'isHourStr',
		validate(params, value, state, options) {
			if (isHourStr(value)) {
				return value
			} else {
				return this.createError('string.isHourStr', {
					v: value
				}, state, options)
			}
		}
	}]
})



function isCPF(cpf) {
	if (cpf.length !== 11) return false
	if (!/^[0-9]+$/.test(cpf)) return false
		// Start cpf validation following 'receita federal' rules

	// CPF constituted of 11 equal digits will pass the folowing validation,
	// but are not valid.
	const allCharsAreEqual = r.all(r.equals(cpf[0]))
	if (allCharsAreEqual(cpf.split(''))) return false

	const toNumbers = r.map(n => parseInt(n, 10))
	const validationDigits = toNumbers(r.takeLast(2, cpf).split(''))

	// First step of validation
	// we will take the first 9 digits (body), multiply every
	// digit from a value from 10 to 2 and sum the result.
	// in the cpf abc.def.ghk-nm, we will do:
	// a*10 + b*9 + c*8 + d*7 + e*6 + f*5 + g*4 + h*3 + k*2
	// Then we will multiply this number by 10 and divise by 11
	// If the result is 10 it becomes 0
	// the rest should be equal n
	const cpfRest = num => ((num * 10) % 11) % 10
	const cpfSum = r.curry((mult, arr) =>
		arr.reduce((acc, current, idx) => acc + (current * (mult - idx)), 0)
	)
	const toNumbersArray = r.pipe(
		r.split(''), //transform string to array
		r.map(n => parseInt(n, 10)) //transform to numbers
	)

	const rest1 = r.pipe(
		toNumbersArray,
		r.dropLast(2),
		cpfSum(10),
		cpfRest
	)(cpf)

	if (rest1 !== validationDigits[0]) return false

	// The second verification step is very similar to the first,
	// but we will add the first verification digit to the body
	// and start the multiplying number at 11 not 10.
	const rest2 = r.pipe(
		toNumbersArray,
		r.dropLast(1),
		cpfSum(11),
		cpfRest
	)(cpf)

	if (rest2 !== validationDigits[1]) return false

	return true
}



function isCNPJ(cnpj) {
	if (cnpj.length !== 14) return false
	if (!/^[0-9]+$/.test(cnpj)) return false

	const toNumbers = r.map(n => parseInt(n, 10))

	const toNumbersArray = r.pipe(
		r.split(''), //transform string to array
		r.map(n => parseInt(n, 10)) //transform to numbers
	)
	const validationDigits = toNumbers(r.takeLast(2, cnpj).split(''))

	const cnpjSum = digit => cnpjArray => {
		const validationArray = {
			"1": [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
			"2": [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
		}
		let result = 0
		validationArray[digit].forEach((element, index) => {
			result = result + element * cnpjArray[index]
		})
		return result
	}

	const cnpjRest = num => {
		return num % 11 < 2 ? 0 : 11 - (num % 11)
	}

	const rest1 = r.pipe(
		toNumbersArray,
		r.dropLast(2),
		cnpjSum(1),
		cnpjRest
	)(cnpj)
	if (rest1 !== validationDigits[0]) return false

	const rest2 = r.pipe(
		toNumbersArray,
		r.dropLast(1),
		cnpjSum(2),
		cnpjRest
	)(cnpj)

	if (rest2 !== validationDigits[1]) return false
	return true
}


function isDateStr(date) {
	return /^\d{4}\-\d{2}\-\d{2}$/.test(date) && moment(date, 'YYYY-MM-DD').isValid()
}


function isHourStr(hour){
	return /^\d{2}\:\d{2}\:\d{2}$/.test(hour) && moment(hour, 'HH:mm:ss').isValid()
}