const joi = require('joi')
const lists = require('./dataLists.js')
const customJoi = require('../../../validators/validators.js').customJoi

exports.dadosBeneficiarioSchema = joi.object().keys({
	numeroCarteira: joi.string().alphanum().min(1).max(20).required(),
	atendimentoRN: joi.string().valid(["S", "N"]).required(),
	nomeBeneficiario: joi.string().min(1).max(70).required(),
	numeroCNS: joi.string().alphanum().min(1).max(15),
	identificadorBeneficiario: joi.string().regex(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/)
})

exports.dadosContratadoSchema = joi.object().keys({
	codigoPrestadorNaOperadora: joi.string().alphanum().min(1).max(14),
	cpfContratado: customJoi.string().isCPF(),
	cnpjContratado: customJoi.string().isCNPJ(),
	nomeContratado: joi.string().min(1).max(70).required(),
}).xor('codigoPrestadorNaOperadora', 'cpfContratado', 'cnpjContratado')

exports.profissionalSolicitanteSchema = joi.object().keys({
	nomeProfissional: joi.string().min(1).max(70).required(),
	conselhoProfissional: joi.string().valid(lists.conselhoProfissional).required(),
	numeroConselhoProfissional: joi.string().regex(/[0-9]{1,15}/).required(),
	UF: joi.string().valid(lists.UF).required(),
	CBOS: joi.string().valid(lists.CBOS).required(),
})

exports.dadosExecutanteSchema = joi.object().keys({
	codigonaOperadora: joi.string().min(1).max(14).required(),
	nomeContratado: joi.string().min(1).max(70).required(),
	CNES: joi.string().min(1).max(7).required()
})

exports.procedimentoSchema = joi.object().keys({
	codigoTabela: joi.string().valid(lists.dm_tabela).required(),
	codigoProcedimento: joi.string().min(1).max(10).required(),
	descricaoProcedimento: joi.string().min(1).max(150).required()
})
