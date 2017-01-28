const joi = require('joi')
const customJoi = require('../../../validators/validators.js').customJoi
const schemas = require ('./schemas.js')
const lists = require('./dataLists.js')



//-- COMPLEX TYPES --


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

const cabecalhoSPSADTSchema = joi.object().keys({
	registroANS: joi.string().regex(/[0-9]{6}/).required(),
	numeroGuiaPrestador: joi.string().min(1).max(20).required(),
	guiaPrincipal: joi.string().min(1).max(20),
})

const autorizacaoSPSADTSchema = joi.object().keys({
	numeroGuiaOperadora: joi.string().min(1).max(20).required(),
	dataAutorizacao: customJoi.string().isDateStr().required(),
	senha: joi.string().min(1).max(20).required(),
	dataValidadeSenha: customJoi.string().isDateStr().required()
})

const dadosSolicitanteSchema = joi.object().keys({
	contratadoSolicitante: schemas.dadosContratadoSchema.required(),
	profissionalSolicitante: schemas.profissionalSolicitanteSchema.required()
})

const dadosSolicitacaoSchema = joi.object().keys({
	dataSolicitacao: customJoi.string().isDateStr(),
	caraterAtendimento: joi.string().regex(/[1-2]{1}/).required(),
	indicacaoClinica: joi.string().min(1).max(500)
})

const dadosExecutanteSchema = joi.object().keys({
	contratadoExecutante: schemas.dadosContratadoSchema.required(),
	CNES: joi.string().min(1).max(7)
})

const dadosAtendimentoSchema = joi.object().keys({
	tipoAtendimento: joi.string().valid([lists.tipoAtendimento]).required(),
	indicacaoAcidente: joi.string().valid(["0", "1", "2", "9"]).required(),
	tipoConsulta: joi.string().valid(["1", "2", "3", "4"]),
	motivoEncerramento: joi.string().valid(["41", "42", "43"])
})

const procedimentosExecutadosSchema = joi.object().keys({
	procedimentoExecutado: joi.object().keys({
		dataExecucao: customJoi.string().isDateStr().required(),
		horaInicial: customJoi.string().isHourStr(),
		horaFinal: customJoi.string().isHourStr(),
		procedimento: schemas.procedimentoSchema.required(),
		unidadeMedida: joi.string().valid(lists.unidadeMedida),
		quantidadeExecutada: joi.string().regex(/^\d{1,8}(\.\d{0,4})?$/),
		viaAcesso: joi.string().valid(["1", "2", "3"]),
		tecnicaUtilizada:joi.string().valid(["1", "2", "3"]),
		valorUnitario: joi.string().regex(/^\d{1,8}(\.\d{0,2})?$/),
		valorTotal: joi.string().regex(/^\d{1,8}(\.\d{0,4})?$/),
		codigoDespesa:joi.string().valid(["1","2","3","5","7","8"]),
		fatorReducaoAcrescimo: joi.string().regex(/^\d{1,3}(\.\d{0,2})?$/)
	}).required()
})

const outrasDespesasSchemas = joi.object().keys({
	despesa: joi.object().keys({
		codigoDespesa:joi.string().valid(["1","2","3","5","7","8"]),
		servicosExecutados: joi.object().keys({
			dataExecucao: customJoi.string().isDateStr().required(),
			horaInicial: customJoi.string().isHourStr(),
			horaFinal: customJoi.string().isHourStr(),
			procedimento: schemas.procedimentoSchema.required(),
			unidadeMedida: joi.string().valid(lists.unidadeMedida),
			quantidadeExecutada: joi.string().regex(/^\d{1,8}(\.\d{0,4})?$/),
			viaAcesso: joi.string().valid(["1", "2", "3"]),
			tecnicaUtilizada:joi.string().valid(["1", "2", "3"]),
			valorUnitario: joi.string().regex(/^\d{1,8}(\.\d{0,2})?$/),
			valorTotal: joi.string().regex(/^\d{1,8}(\.\d{0,2})?$/),
			codigoDespesa:joi.string().valid(["1","2","3","5","7","8"]),
			fatorReducaoAcrescimo: joi.string().regex(/^\d{1,3}(\.\d{0,2})?$/)
		})
	})
})

const valorTotalSchema = joi.object().keys({
	valorProcedimentos: joi.string().regex(/^\d{1,10}(\.\d{0,2})?$/),
	valorDiarias: joi.string().regex(/^\d{1,10}(\.\d{0,2})?$/),
	valorTaxasAlugueis: joi.string().regex(/^\d{1,10}(\.\d{0,2})?$/),
	valorMateriais: joi.string().regex(/^\d{1,10}(\.\d{0,2})?$/),
	valorMedicamentos: joi.string().regex(/^\d{1,10}(\.\d{0,2})?$/),
	valorOPME: joi.string().regex(/^\d{1,10}(\.\d{0,2})?$/),
	valorGasesMedicinais: joi.string().regex(/^\d{1,10}(\.\d{0,2})?$/),
	valorTotalGeral: joi.string().regex(/^\d{1,10}(\.\d{0,2})?$/).required(),
})

const guiaSPSADTSchema = joi.object().keys({
	cabecalhoGuia: cabecalhoSPSADTSchema.required(),
	dadosAutorizacao: autorizacaoSPSADTSchema,
	dadosBeneficiario: schemas.dadosBeneficiarioSchema.required(),
	dadosSolicitante: dadosSolicitanteSchema.required(),
	dadosSolicitacao: dadosSolicitacaoSchema.required(),
	dadosExecutante: dadosExecutanteSchema.required(),
	dadosAtendimento: dadosAtendimentoSchema.required(),
	procedimentosExecutados: procedimentosExecutadosSchema,
	outrasDespesas: outrasDespesasSchemas,
	observacao: joi.string().min(1).max(500),
	valorTotal: valorTotalSchema.required()
})

const cabecalhoGuiaSchema = joi.object().keys({
	registroANS: joi.string().regex(/[0-9]{6}/).required(),
	numeroGuiaPrestador: joi.string().min(1).max(20).required(),
})

const autorizacaoResumoInternacaoSchema = joi.object().keys({
	numeroGuiaOperadora: joi.string().min(1).max(20),
	dataAutorizacao: customJoi.string().isDateStr().required(),
	senha: joi.string().min(1).max(20).required(),
	dataValidadeSenha: customJoi.string().isDateStr()
})

const declaracoesSchema = joi.object().keys({
	declaracaoNascido: joi.string().min(1).max(11),
	diagnosticoObito: joi.string().min(1).max(4),
	declaracaoObito: joi.string().min(1).max(11),
	indicadorDORN: joi.string().valid(["S", "N"])
})

const dadosInternacaoSchema = joi.object().keys({
	caraterAtendimento: joi.string().valid(["1", '2']).required(),
	tipoFaturamento: joi.string().valid(["1","2","3","4"]).required(),
	dataInicioFaturamento: customJoi.string().isDateStr().required(),
	horaInicioFaturamento: customJoi.string().isHourStr().required(),
	dataFinalFaturamento: customJoi.string().isDateStr().required(),
	horaFinalFaturamento: customJoi.string().isHourStr().required(),
	tipoInternacao: joi.string().valid(["1","2","3","4","5"]).required(),
	regimeInternacao: joi.string().valid(["1","2","3"]).required(),
	declaracoes: declaracoesSchema
})

const dadosSaidaInternacaoSchema = joi.object().keys({
	diagnostico: joi.string().min(1).max(4),
	indicadorAcidente: joi.string().valid(["0", "1", "2", "9"]).required(),
	motivoEncerramento:joi.string().valid(["41", "42", "43"]).required()
})

const identEquipeSchema = joi.object().keys({
	identificacaoEquipe: joi.object().keys({
		grauPart: joi.string().valid(["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13"]).required(),
		codProfissional: joi.object().keys({
			codigoPrestadorNaOperadora: joi.string().min(1).max(14),
			cpfContratado: customJoi.string().isCPF()
		}).xor('codigoPrestadorNaOperadora', 'cpfContratado')
	})
})

const procedimentosExecutadosIntSchema = joi.object().keys({
	procedimentoExecutado: joi.object().keys({
		dataExecucao: customJoi.string().isDateStr().required(),
		horaInicial: customJoi.string().isHourStr(),
		horaFinal: customJoi.string().isHourStr(),
		procedimento: schemas.procedimentoSchema.required(),
		quantidadeExecutada: joi.string().regex(/^\d{1,8}(\.\d{0,4})?$/).required(),
		viaAcesso: joi.string().valid(["1", "2", "3"]),
		tecnicaUtilizada:joi.string().valid(["1", "2", "3"]),
		reducaoAcrescimo: joi.string().regex(/^\d{1,3}(\.\d{0,2})?$/).required(),
		valorUnitario: joi.string().regex(/^\d{1,8}(\.\d{0,2})?$/).required(),
		valorTotal: joi.string().regex(/^\d{1,8}(\.\d{0,2})?$/).required(),
		identEquipe: identEquipeSchema
	}).required()
})

const guiaResumoInternacaoSchema = joi.object().keys({
	cabecalhoGuia: cabecalhoGuiaSchema.required(),
	numeroGuiaSolicitacaoInterna: joi.string().min(1).max(20).required(),
	dadosAutorizacao: autorizacaoResumoInternacaoSchema.required(),
	dadosBeneficiario: schemas.dadosBeneficiarioSchema.required(),
	dadosExecutante: dadosExecutanteSchema.required(),
	dadosInternacao: dadosInternacaoSchema.required(),
	dadosSaidaInternacao: dadosSaidaInternacaoSchema.required(),
	procedimentosExecutados: procedimentosExecutadosIntSchema,
	valorTotal: valorTotalSchema.required(),
	outrasDespesas: outrasDespesasSchemas,
	observacao: joi.string().min(1).max(500)
	// assinaturaDigitalGuia:
})

const beneficiarioHonorariosSchema = joi.object().keys({
	numeroCarteira: joi.string().min(1).max(20),
	nomeBeneficiario: joi.string().min(1).max(70),
	atendimentoRN: joi.string().valid(["S","N"])
})

const localContratadoSchema = joi.object().keys({
	codigoContratado: joi.object().keys({
		codigoNaOperadora: joi.string().min(1).max(14),
		cnpjLocalExecutante: customJoi.string().isCNPJ()
	}).xor('codigoNaOperadora','cnpjLocalExecutante').required(),
	nomeContratado: joi.string().min(1).max(70).required(),
	cnes: joi.string().min(1).max(7).required()
})

const dadosContratadoExecutanteSchema = joi.object().keys({
	codigonaOperadora: joi.string().min(1).max(14).required(),
	nomeContratadoExecutante: joi.string().min(1).max(70).required(),
	cnesContratadoExecutante: joi.string().min(1).max(7).required()
})

const dadosInternacaoHonorariosSchema = joi.object().keys({
	dataInicioFaturamento: customJoi.string().isDateStr().required(),
	dataFimFaturamento: customJoi.string().isDateStr().required()
})

const profissionaisSchema = joi.object().keys({
	grauParticipacao: joi.string().valid(["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13"]).required(),
	codProfissional: joi.object().keys({
		codigoPrestadorNaOperadora: joi.string().min(1).max(14),
		cpfContratado: customJoi.string().isCPF(),
	}).xor('codigoPrestadorNaOperadora', 'cpfContratado').required(),
	nomeProfissional: joi.string().min(1).max(70).required(),
	conselhoProfissional: joi.string().valid(lists.conselhoProfissional).required(),
	numeroConselhoProfissional: joi.string().min(1).max(15).required(),
	UF: joi.string().valid(lists.UF).required(),
	CBOS: joi.string().valid(lists.CBOS).required()
})

const procedimentosRealizadosSchema = joi.object().keys({
	procedimentoRealizado: joi.object().keys({
		dataExecucao: customJoi.string().isDateStr().required(),
		horaInicial: customJoi.string().isHourStr(),
		horaFinal: customJoi.string().isHourStr(),
		procedimento: schemas.procedimentoSchema.required(),
		quantidadeExecutada: joi.string().regex(/^\d{1,8}(\.\d{0,4})?$/).required(),
		viaAcesso: joi.string().valid(["1", "2", "3"]),
		tecnicaUtilizada:joi.string().valid(["1", "2", "3"]),
		reducaoAcrescimo: joi.string().regex(/^\d{1,3}(\.\d{0,2})?$/).required(),
		valorUnitario: joi.string().regex(/^\d{1,8}(\.\d{0,2})?$/).required(),
		valorTotal: joi.string().regex(/^\d{1,8}(\.\d{0,4})?$/).required(),
		profissionais: profissionaisSchema.required()
	})
})

const guiaHonorariosSchema = joi.object().keys({
	cabecalhoGuia: cabecalhoGuiaSchema.required(),
	guiaSolicInternacao: joi.string().min(1).max(20).required(),
	senha: joi.string().min(1).max(20),
	numeroGuiaOperadora: joi.string().min(1).max(20),
	beneficiario: beneficiarioHonorariosSchema.required(),
	localContratado: localContratadoSchema.required(),
	dadosContratadoExecutante: dadosContratadoExecutanteSchema.required(),
	dadosInternacao: dadosInternacaoHonorariosSchema.required(),
	procedimentosRealizados: procedimentosRealizadosSchema.required(),
	observacao: joi.string().min(1).max(500),
	valorTotalHonorarios: joi.string().regex(/^\d{1,10}(\.\d{0,2})?$/).required(),
	dataEmissaoGuia: customJoi.string().isDateStr().required()
	// assinaturaDigitalGuia:
})

const contratadoExecutanteSchema = schemas.dadosContratadoSchema.keys({
		CNES: joi.string().min(1).max(7)
})

const consultaAtendimentoSchema = joi.object().keys({
	dataAtendimento: customJoi.string().isDateStr().required(),
	tipoConsulta: joi.string().valid(["1","2","3","4"]).required(),
	procedimento: joi.object().keys({
		codigoTabela: joi.string().valid(lists.dm_tabela).required(),
		codigoProcedimento: joi.string().min(1).max(10).required(),
		valorProcedimento: joi.string().regex(/^\d{1,8}(\.\d{0,2})?$/).required()
	})
})

const guiaConsultaSchema = joi.object().keys({
	cabecalhoConsulta: cabecalhoGuiaSchema.required(),
	numeroGuiaOperadora: joi.string().min(1).max(20).required(),
	dadosBeneficiario: schemas.dadosBeneficiarioSchema.required(),
	contratadoExecutante: contratadoExecutanteSchema.required(),
	profissionalExecutante: schemas.profissionalSolicitanteSchema.required(),
	indicacaoAcidente: joi.string().valid(["0","1","2","9"]).required(),
	dadosAtendimento: consultaAtendimentoSchema.required(),
	observacao: joi.string().min(1).max(500)
	// assinaturaDigitalGuia:
})

const loteGuiasSchema = joi.object().keys({
	numeroLote: joi.string().min(1).max(12).required(),
	guiaTISS: joi.object().keys({
		guiaSPSADT: guiaSPSADTSchema,
		guiaResumoInternacao: guiaResumoInternacaoSchema,
		guiaHonorarios: guiaHonorariosSchema,
		guiaConsulta: guiaConsultaSchema,
	}).xor('guiaSPSADT', 'guiaResumoInternacao', 'guiaHonorarios', 'guiaConsulta', 'guiaOdonto').required()
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
		loteGuias: loteGuiasSchema.required()
	}).required()
})



//-- EXPORTS --

module.exports = {
	loteGuias: elegibilidadeVerificaSchema, //KEY MUST BE THE SAME NAME AS ROUTE NAME CALLED
}
