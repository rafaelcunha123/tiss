r = require('ramda')
_ = require('lodash')

const obj = {
	a:1,
	b:{
		c:1
	}
}

console.log(r.has(['b','c'], obj ))
console.log(_.has(obj ,'b.c'))