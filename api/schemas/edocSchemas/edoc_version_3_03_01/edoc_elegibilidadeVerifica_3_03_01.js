const joi = require('joi')
const customJoi = require('../../../validators/validators.js').customJoi



//-- COMPLEX TYPES --


const identificacaoTransacaoSchema = joi.object().keys({
	tipoTransacao: joi.string().valid(["SITUACAO_ELEGIBILIDADE"]).required(),
	sequencialTransacao: joi.string().alphanum().min(1).max(12).required(),
	dataRegistroTransacao: customJoi.string().isDateStr().required(),
	horaRegistroTransacao: customJoi.string().isHourStr().required(),
})

const identificacaoPrestadorSchema = joi.object().keys({
	CNPJ: customJoi.string().regex(/[0-9]{14}/).isCNPJ(),
	CPF: customJoi.string().regex(/[0-9]{11}/).isCPF(),
	codigoPrestadorNaOperadora: joi.string().alphanum().min(1).max(14),
}).xor('CNPJ', 'CPF', 'codigoPrestadorNaOperadora')

const loginSenhaPrestadorSchema = joi.object().keys({
	loginPrestador: joi.string().alphanum().min(1).max(20).required(),
	senhaPrestador: joi.string().alphanum().min(1).max(32).required(),
})

const dadosContratadoSchema = joi.object().keys({
	codigoPrestadorNaOperadora: joi.string().alphanum().min(1).max(14),
	cpfContratado: joi.string().regex(/[0-9]{11}/),
	cnpjContratado: joi.string().regex(/[0-9]{14}/),
	nomeContratado: joi.string().min(1).max(70).required(),
}).xor('codigoPrestadorNaOperadora', 'cpfContratado', 'cnpjContratado')


const verificaElegibilidadeSchema = joi.object().keys({
	dadosPrestador: dadosContratadoSchema.required(),
	numeroCarteira: joi.string().alphanum().min(1).max(20).required(),
	nomeBeneficiario: joi.string().min(1).max(70).required(),
	numeroCNS: joi.string().alphanum().min(1).max(70),
	validadeCarteira: customJoi.string().isDateStr(),
})


//-- ROUTES SCHEMAS --

const elegibilidadeVerificaSchema = joi.object().keys({
	cabecalho: joi.object().keys({
		identificacaoTransacao: identificacaoTransacaoSchema.required(),
		origem: joi.object().keys({
			identificacaoPrestador: identificacaoPrestadorSchema.required()
		}).required(),
		destino: joi.object().keys({
			registroANS: joi.string().regex(/[0-9]{6}/).required()
		}).required(),
		padrao: joi.string(),
		loginSenhaPrestador: loginSenhaPrestadorSchema.required()
	}).required(),
	prestadorParaOperadora: joi.object().keys({
		verificaElegibilidade: verificaElegibilidadeSchema.required()
	}).required(),
})



//-- EXPORTS --

module.exports = {
	elegibilidadeVerifica: elegibilidadeVerificaSchema, //KEY MUST BE THE SAME NAME AS ROUTE NAME CALLED
}