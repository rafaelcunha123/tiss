const joi = require('joi')
const customJoi = require('../../../validators/validators.js').customJoi
const lists = require('./dataLists.js')
const schemas = require('./schemas.js')


const identificacaoTransacaoSchema = joi.object().keys({
	tipoTransacao: joi.string().valid(["SOLICITACAO_PROCEDIMENTOS"]).required(),
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

const cabecalhoSolicitacaoSchema = joi.object().keys({
	registroANS: joi.string().regex(/[0-9]{6}/).required(),
	numeroGuiaPrestador: joi.string().alphanum().min(1).max(20).required(),
})

const dadosSolicitanteSchema = joi.object().keys({
	contratadoSolicitante: schemas.dadosContratadoSchema.required(),
	profissionalSolicitante: schemas.profissionalSolicitanteSchema.required(),

})

const procedimentosSolicitados = joi.object().keys({
	procedimento:schemas.procedimentoSchema.required(),
	quantidadeSolicitada: joi.number().integer().min(1).max(999).required()
})

const solicitacaoSPSADTSchema = joi.object().keys({
	cabecalhoSolicitacao: cabecalhoSolicitacaoSchema.required(),
	dadosBeneficiario: schemas.dadosBeneficiarioSchema.required(),
	dadosSolicitante: dadosSolicitanteSchema.required(),
	caraterAtendimento: joi.string().valid(["1", "2"]).required(), //1- Eletiva, 2- Urgência
	dataSolicitacao: customJoi.string().isDateStr().required(),
	indicacaoClinica: joi.string().min(1).max(500),
	procedimentosSolicitados: joi.array().items(procedimentosSolicitados).required(),
	dadosExecutante: schemas.dadosExecutanteSchema.required()
})

const solicitacaoProcedimentoBodySchema = joi.object().keys({
	solicitacaoSPSADT: solicitacaoSPSADTSchema.required(),
	//TODO: accept other routes
	/*'solicitacaoInternacao': joi.string().regex(/[0-9]{11}/).required(),
	'solicitacaoProrrogacao': joi.string().regex(/[0-9]{14}/).required(),
	'solicitacaoOdontologia': joi.string().min(1).max(70).required(),*/
}).xor('solicitacaoSPSADT', 'solicitacaoInternacao', 'solicitacaoProrrogacao', 'solicitacaoOdontologia')






//-- ROUTES SCHEMAS --

const solicitacaoProcedimentoSchema = joi.object().keys({
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
		solicitacaoProcedimento: solicitacaoProcedimentoBodySchema.required()
	}).required(),
})



//-- EXPORTS --

module.exports = {
	solicitacaoProcedimento: solicitacaoProcedimentoSchema, //KEY MUST BE THE SAME NAME AS ROUTE NAME CALLED
}
