const joi = require('joi')
const customJoi = require('../../../validators/validators.js').customJoi
const lists = require('./dataLists.js')
const schemas = require('./schemas.js')

const identificacaoTransacaoSchema = joi.object().keys({
	tipoTransacao: joi.string().valid(["ENVIO_LOTE_GUIAS"]).required(),
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

const cabecalhoConsultaSchema = joi.object().keys({
	registroANS: joi.string().regex(/[0-9]{6}/).required(),
	numeroGuiaPrestador: joi.string().min(1).max(20).required(),
})

const contratadoExecutanteSchema = joi.object().keys({
	codigoPrestadorNaOperadora: joi.string().alphanum().min(1).max(14),
	cpfContratado: customJoi.string().isCPF(),
	cnpjContratado: customJoi.string().isCNPJ(),
	nomeContratado: joi.string().min(1).max(70).required(),
	CNES: joi.string().min(1).max(7).required(),
}).xor('codigoPrestadorNaOperadora', 'cpfContratado', 'cnpjContratado')

const procedimentoSchema = joi.object().keys({
	codigoTabela: joi.string().valid(lists.dm_tabela),
	codigoProcedimento: joi.string().min(1).max(10).required(),
	valorProcedimento: joi.number().precision(2),
	descricaoProcedimento: joi.string(),
})

const dadosAtendimentoSchema = joi.object().keys({
	dataAtendimento: customJoi.string().isDateStr().required(),
	tipoConsulta: joi.string().valid(lists.tipoConsulta).required(),
	procedimento: procedimentoSchema.required()

})

const guiaConsultaSchema = joi.object().keys({
		cabecalhoConsulta: cabecalhoConsultaSchema.required(),
		numeroGuiaOperadora: joi.string().min(1).max(20),
		dadosBeneficiario: schemas.dadosBeneficiarioSchema.required(),
		contratadoExecutante: contratadoExecutanteSchema.required(),
		profissionalExecutante: schemas.profissionalSolicitanteSchema.required(),
		indicacaoAcidente: joi.string().valid(lists.indicadorAcidente).required(),
		dadosAtendimento: dadosAtendimentoSchema.required(),
		observacao: joi.string().min(1).max(500)
	})


const guiaSchema = joi.object().keys({
	guiaConsulta: guiaConsultaSchema
})//.xor('guiaConsulta', 'guiaSP-SADT', 'guiaResumoInternacao', 'guiaHonorarios', 'guiaOdonto')



const guiasSchema = joi.object().keys({
	numeroLote: joi.string().min(1).max(12).required(),
	guiasTISS: joi.array().items(guiaSchema)
})


//-- ROUTES SCHEMAS --

const loteGuiasSchema = joi.object().keys({
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
		loteGuias: guiasSchema.required()
	}).required(),
})



//-- EXPORTS --

module.exports = {
	loteGuias: loteGuiasSchema, //KEY MUST BE THE SAME NAME AS ROUTE NAME CALLED
}