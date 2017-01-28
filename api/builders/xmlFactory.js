const builder = require('xmlbuilder');
const md5 = require('js-md5')
const fs = require('fs')
const schemas = require('../schemas')

function sortByOrder(obj1, obj2) {
  if (obj1.order < obj2.order) return -1
  if (obj1.order > obj2.order) return 1
  return 0
}

function tagToString(hashString, value) {
  if (!Array.isArray(value)) return hashString + value

  return value.reduce(
    (strAcc, tag) => tagToString(strAcc, tag.value),
    hashString
  )
}

function addTag(xml, name, value) {
  if (!Array.isArray(value)) {
    if (value !== 'ignore') return xml.ele(`${name}`, value).up()
    else return xml
  }


  // Otherwise we have an array
  // TODO: validate array (ducktype is needed)
  // open the current tag
  xml = xml.ele(`${name}`)

  // recursivly append all its children
  const sortedValues = value.sort(sortByOrder)
  xml = sortedValues.reduce(
    (xml, nextTag) => {
      return addTag(xml, nextTag.ansName, nextTag.value)
    },
    xml
  )

  // close tag
  xml = xml.up()
  return xml
}


module.exports = function xmlFactory() {
  let xml

  return {
    init(padrao) {

      if (!xml) {
        xml = builder.create("ans:mensagemTISS")
          .att('xmlns:ans', 'http://www.ans.gov.br/padroes/tiss/schemas')
          .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
          .att('xsi:schemaLocation', schemas[padrao]['schemaLocation'])
      }

      return this
    },

    unwrap() {
      return xml
    },

    appendArray(tagsToAppend) {
      const sortedTags = tagsToAppend.sort(sortByOrder)
      
      xml = sortedTags.reduce(
        (xmlAcc, tag) => {
          return addTag(xmlAcc, tag.ansName, tag.value)
        },
        xml
      )
      return this
    },

    hash(allTags) {
      const sortedTags = allTags.sort(sortByOrder)
      const tagsString = sortedTags.reduce(
        (strAcc, tag) => tagToString(strAcc, tag.value),
        ''
      )
      const hash = md5(tagsString)
      xml = xml.ele('ans:epilogo')
        .ele('ans:hash', hash).up()
        .up()

      return this
    },

    finish() {
      xml = xml.end();
      return this
    },

    writeToFile(name) {
      fs.writeFile(`${name}.xml`, xml)
      return this
    },
  }
}