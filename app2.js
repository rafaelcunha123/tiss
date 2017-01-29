const r = require('ramda')
const _ = require('lodash')
const moment = require('moment')

const obj = {
	a:1,
	b:{
		c:1
	}
}

let x = moment('1989-10-12', 'YYYY-MM-DD')

console.log(x.year())

console.log(r.has(['b','c'], obj ))
console.log(_.has(obj ,'b.c'))