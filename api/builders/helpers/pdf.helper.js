const r = require('ramda')
const path = require('path')
const uuidV1 = require('uuid/v1')


//-- Text functions --
function text(doc, options) {
	return normalizeTextInput({
			doc,
			options
		})
		.then(textFormat)
		.then(normalizeTextInput)
		.then(textAlign)
		.then(borderFormat)
		.then(print)
}


function normalizeTextInput(input) {

	input.options = input.options || {}
	if (input.options.txtArray) input.options.txtArray = Array.isArray(input.options.txtArray) ? input.options.txtArray : [input.options.txtArray]
	input.options.x = input.options.x || 0
	input.options.y = input.options.y || 0
	input.options.lineSpacing = input.options.lineSpacing || 0.2

	input.pageWidth = input.doc.internal.pageSize.width
	input.fontSize = input.doc.internal.getFontSize()
	input.textWidth = input.options.txtArray.map(txt => input.doc.getStringUnitWidth(txt) * input.fontSize / input.doc.internal.scaleFactor)
	input.textHeigth = input.options.txtArray.map(txt => input.fontSize * 0.328) // 0.3528 = mm/pt
	input.xCoord = input.textWidth.map(w => input.options.x)
	input.yCoord = input.textHeigth.map((h, index) => {
			if (index > 0) {
				return input.options.y + input.textHeigth[0] + input.textHeigth.slice(0, index).reduce((a, b) => a + b)
			} else {
				return input.options.y + input.textHeigth[0]
			}
		})
		//console.log(input)
	return Promise.resolve(input)

}

function textFormat(input) {
	let xCoord = clone(input.xCoord),
		yCoord = clone(input.yCoord)
	if (input.options.lineSpacing) yCoord = input.yCoord.map((y, i) => i > 0 ? y + i * input.options.lineSpacing * input.textHeigth[i] : y)
	if (input.options.fontSize) input.doc.setFontSize(input.options.fontSize)
	if (input.options.fontFamily && input.options.fontStyle) input.doc.setFont(input.options.fontFamily, input.options.fontStyle)
	if (input.options.fontFamily) input.doc.setFont(input.options.fontFamily)

	let resultParams = {
		xCoord,
		yCoord
	}
	return Promise.resolve(r.merge(input, {
		textParams: resultParams,
	}))
}

function textAlign(input) {
	if (input.options.align === 'center') input.textParams.xCoord = input.textWidth.map(w => (input.pageWidth - w) / 2)
	return Promise.resolve(input)
}


function borderFormat(input) {
	let xCoord = clone(input.textParams.xCoord),
		yCoord = clone(input.textParams.yCoord)
	if (input.options.border) {
		let xBorder = xCoord.map(x => x),
			yBorder = yCoord.map((y, i) => y - input.textHeigth[i]),
			borderWidth = input.textWidth.map(w => w),
			borderHeight = input.textHeigth.map(h => h)

		if (input.options.title) {

		}
		if (input.options.padding) {
			xBorder = xBorder.map(x => x - (input.options.padding / 2))
			yBorder = yBorder.map(y => y - (input.options.padding / 2))
			borderWidth = borderWidth.map(w => w + input.options.padding)
			borderHeight = borderHeight.map(h => h + input.options.padding)

		}
		return Promise.resolve(r.merge(input, {
			borderParams: {
				xBorder,
				yBorder,
				borderWidth,
				borderHeight
			}
		}))
	} else return Promise.resolve(input)
}


function print(input) {
	if (input.textParams) input.options.txtArray.forEach((txt, i) => input.doc.text(input.textParams.xCoord[i], input.textParams.yCoord[i], txt))
	if (input.borderParams) input.options.txtArray.forEach((txt, i) => input.doc.rect(input.borderParams.xBorder[i], input.borderParams.yBorder[i], input.borderParams.borderWidth[i], input.borderParams.borderHeight[i]))
	return Promise.resolve(input)
}


//-- Box functions

function formBox(doc, options) {
	return normalizeBoxInput({
			doc,
			options
		})
		.then(printBox)
		.then(formatHeader)
		.then(printHeader)
		.then(formatContent)
		.then(printContent)
}

function normalizeBoxInput(input) {
	input.options = input.options || {}
	input.options.x = input.options.x || 0
	input.options.y = input.options.y || 0
	input.options.w = input.options.w || 10
	input.options.h = input.options.h || 10

	input.options.style = input.options.style || {}

	input.options.style.fill = input.options.style.fill || {}
	input.options.style.fill.R = input.options.style.fill.R || 255
	input.options.style.fill.G = input.options.style.fill.G || 255
	input.options.style.fill.B = input.options.style.fill.B || 255

	input.options.style.borderColor = input.options.style.borderColor || {}
	input.options.style.borderColor.R = input.options.style.borderColor.R || 0
	input.options.style.borderColor.G = input.options.style.borderColor.G || 0
	input.options.style.borderColor.B = input.options.style.borderColor.B || 0

	return Promise.resolve(input)

}

function formatHeader(input) {
	if (input.options.header) {
		input.options.header.fontSize = input.options.header.fontSize || 8
		input.options.header.textHeigth = input.options.header.fontSize * 0.328
		input.options.header.fontFamily = input.options.header.fontFamily || 'times'
		input.options.header.fontStyle = input.options.header.fontStyle || 'normal'
		input.options.header.padding = input.options.header.padding || 0.5

		input.doc.setFontSize(input.options.header.fontSize)
		input.doc.setFont(input.options.header.fontFamily, input.options.header.fontStyle)
		return Promise.resolve(input)
	} else {
		return Promise.resolve(input)
	}
}

function formatContent(input) {
	if (input.options.content) {
		input.options.content.fontSize = input.options.content.fontSize || 12
		input.options.content.textHeigth = input.options.content.fontSize * 0.328
		input.options.content.fontFamily = input.options.content.fontFamily || 'times'
		input.options.content.fontStyle = input.options.content.fontStyle || 'normal'
		input.options.content.padding = input.options.content.padding || 0.8

		input.doc.setFontSize(input.options.content.fontSize)
		input.doc.setFont(input.options.content.fontFamily, input.options.content.fontStyle)
		return Promise.resolve(input)
	} else {
		return Promise.resolve(input)
	}
}


function printBox(input) {
	input.doc.setDrawColor(input.options.style.borderColor.R, input.options.style.borderColor.G, input.options.style.borderColor.B)
	input.doc.setFillColor(input.options.style.fill.R, input.options.style.fill.G, input.options.style.fill.B)
	input.doc.rect(input.options.x, input.options.y, input.options.w, input.options.h, 'FD')
	return Promise.resolve(input)
}

function printHeader(input) {
	if (input.options.header && input.options.header.text) {
		input.doc.text(input.options.x + input.options.header.padding, input.options.y + input.options.header.textHeigth + input.options.header.padding, input.options.header.text)
		return Promise.resolve(input)
	} else return Promise.resolve(input)
}

function printContent(input) {
	if (input.options.content && input.options.content.text) {
		input.doc.text(input.options.x + input.options.content.padding, input.options.y + input.options.h - input.options.content.padding, input.options.content.text)
		return Promise.resolve(input)
	} else return Promise.resolve(input)
}


//--General functions

function saveDoc(input) {
	const key = uuidV1() + '.pdf'
	//console.log(path.join(__dirname, '../savedPdfs/', key))
	input.uuid = key

	return new Promise((resolve, reject) => {
		input.doc.save(path.join(__dirname, '../tissForms/savedPdfs/', key), (err) => {
			if (err) reject(err)
			console.log('saved')
			resolve(input)
		})
	})
}



function clone(array) {
	if (Array.isArray(array)) return array.slice(0)
	else return undefined
}

module.exports = {
	text,
	print,
	saveDoc,
	formBox,
}