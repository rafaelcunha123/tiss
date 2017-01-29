//PERMISSIVE VALIDATION. WILL ONLY CLEAN UNDESIREABLE DATA, BUT WILL ALLOW IMPRESSION OF INCOMPLETE FORMS

const joi = require('joi')
const customJoi = require('../../../validators/validators.js').customJoi
const schemas = require ('./schemas.js')
const lists = require('./dataLists.js')



//-- COMPLEX TYPES --


const identificacaoTransacaoSchema = joi.object().keys({
	tipoTransacao: joi.string().valid(["ENVIO_LOTE_GUIAS"]),
	sequencialTransacao: joi.string().alphanum().min(1).max(12),
	dataRegistroTransacao: customJoi.string().isDateStr(),
	horaRegistroTransacao: customJoi.string().isHourStr(),
})

const identificacaoPrestadorSchema = joi.object().keys({
	CNPJ: customJoi.string().regex(/[0-9]{14}/).isCNPJ(),
	CPF: customJoi.string().regex(/[0-9]{11}/).isCPF(),
	codigoPrestadorNaOperadora: joi.string().alphanum().min(1).max(14),
}).xor('CNPJ', 'CPF', 'codigoPrestadorNaOperadora')

const loginSenhaPrestadorSchema = joi.object().keys({
	loginPrestador: joi.string().alphanum().min(1).max(20),
	senhaPrestador: joi.string().alphanum().min(1).max(32),
})

const cabecalhoSPSADTSchema = joi.object().keys({
	registroANS: joi.string().regex(/[0-9]{6}/),
	numeroGuiaPrestador: joi.string().min(1).max(20),
	guiaPrincipal: joi.string().min(1).max(20),
})

const autorizacaoSPSADTSchema = joi.object().keys({
	numeroGuiaOperadora: joi.string().min(1).max(20),
	dataAutorizacao: customJoi.string().isDateStr(),
	senha: joi.string().min(1).max(20),
	dataValidadeSenha: customJoi.string().isDateStr()
})

const dadosSolicitanteSchema = joi.object().keys({
	contratadoSolicitante: schemas.dadosContratadoSchema,
	profissionalSolicitante: schemas.profissionalSolicitanteSchema
})

const dadosSolicitacaoSchema = joi.object().keys({
	dataSolicitacao: customJoi.string().isDateStr(),
	caraterAtendimento: joi.string().regex(/[1-2]{1}/),
	indicacaoClinica: joi.string().min(1).max(500)
})

const dadosExecutanteSchema = joi.object().keys({
	contratadoExecutante: schemas.dadosContratadoSchema,
	CNES: joi.string().min(1).max(7)
})

const dadosAtendimentoSchema = joi.object().keys({
	tipoAtendimento: joi.string().valid([lists.tipoAtendimento]),
	indicacaoAcidente: joi.string().valid(["0", "1", "2", "9"]),
	tipoConsulta: joi.string().valid(["1", "2", "3", "4"]),
	motivoEncerramento: joi.string().valid(["41", "42", "43"])
})

const procedimentosExecutadosSchema = joi.object().keys({
	procedimentoExecutado: joi.object().keys({
		dataExecucao: customJoi.string().isDateStr(),
		horaInicial: customJoi.string().isHourStr(),
		horaFinal: customJoi.string().isHourStr(),
		procedimento: schemas.procedimentoSchema,
		unidadeMedida: joi.string().valid(lists.unidadeMedida),
		quantidadeExecutada: joi.string().regex(/^\d{1,8}(\.\d{0,4})?$/),
		viaAcesso: joi.string().valid(["1", "2", "3"]),
		tecnicaUtilizada:joi.string().valid(["1", "2", "3"]),
		valorUnitario: joi.string().regex(/^\d{1,8}(\.\d{0,2})?$/),
		valorTotal: joi.string().regex(/^\d{1,8}(\.\d{0,4})?$/),
		codigoDespesa:joi.string().valid(["1","2","3","5","7","8"]),
		fatorReducaoAcrescimo: joi.string().regex(/^\d{1,3}(\.\d{0,2})?$/)
	})
})

const outrasDespesasSchemas = joi.object().keys({
	despesa: joi.object().keys({
		codigoDespesa:joi.string().valid(["1","2","3","5","7","8"]),
		servicosExecutados: joi.object().keys({
			dataExecucao: customJoi.string().isDateStr(),
			horaInicial: customJoi.string().isHourStr(),
			horaFinal: customJoi.string().isHourStr(),
			procedimento: schemas.procedimentoSchema,
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
	valorTotalGeral: joi.string().regex(/^\d{1,10}(\.\d{0,2})?$/),
})

const guiaSPSADTSchema = joi.object().keys({
	cabecalhoGuia: cabecalhoSPSADTSchema,
	dadosAutorizacao: autorizacaoSPSADTSchema,
	dadosBeneficiario: schemas.dadosBeneficiarioSchema,
	dadosSolicitante: dadosSolicitanteSchema,
	dadosSolicitacao: dadosSolicitacaoSchema,
	dadosExecutante: dadosExecutanteSchema,
	dadosAtendimento: dadosAtendimentoSchema,
	procedimentosExecutados: procedimentosExecutadosSchema,
	outrasDespesas: outrasDespesasSchemas,
	observacao: joi.string().min(1).max(500),
	valorTotal: valorTotalSchema
})

const cabecalhoGuiaSchema = joi.object().keys({
	registroANS: joi.string().regex(/[0-9]{6}/),
	numeroGuiaPrestador: joi.string().min(1).max(20),
})

const autorizacaoResumoInternacaoSchema = joi.object().keys({
	numeroGuiaOperadora: joi.string().min(1).max(20),
	dataAutorizacao: customJoi.string().isDateStr(),
	senha: joi.string().min(1).max(20),
	dataValidadeSenha: customJoi.string().isDateStr()
})

const declaracoesSchema = joi.object().keys({
	declaracaoNascido: joi.string().min(1).max(11),
	diagnosticoObito: joi.string().min(1).max(4),
	declaracaoObito: joi.string().min(1).max(11),
	indicadorDORN: joi.string().valid(["S", "N"])
})

const dadosInternacaoSchema = joi.object().keys({
	caraterAtendimento: joi.string().valid(["1", '2']),
	tipoFaturamento: joi.string().valid(["1","2","3","4"]),
	dataInicioFaturamento: customJoi.string().isDateStr(),
	horaInicioFaturamento: customJoi.string().isHourStr(),
	dataFinalFaturamento: customJoi.string().isDateStr(),
	horaFinalFaturamento: customJoi.string().isHourStr(),
	tipoInternacao: joi.string().valid(["1","2","3","4","5"]),
	regimeInternacao: joi.string().valid(["1","2","3"]),
	declaracoes: declaracoesSchema
})

const dadosSaidaInternacaoSchema = joi.object().keys({
	diagnostico: joi.string().min(1).max(4),
	indicadorAcidente: joi.string().valid(["0", "1", "2", "9"]),
	motivoEncerramento:joi.string().valid(["41", "42", "43"])
})

const identEquipeSchema = joi.object().keys({
	identificacaoEquipe: joi.object().keys({
		grauPart: joi.string().valid(["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13"]),
		codProfissional: joi.object().keys({
			codigoPrestadorNaOperadora: joi.string().min(1).max(14),
			cpfContratado: customJoi.string().isCPF()
		}).xor('codigoPrestadorNaOperadora', 'cpfContratado')
	})
})

const procedimentosExecutadosIntSchema = joi.object().keys({
	procedimentoExecutado: joi.object().keys({
		dataExecucao: customJoi.string().isDateStr(),
		horaInicial: customJoi.string().isHourStr(),
		horaFinal: customJoi.string().isHourStr(),
		procedimento: schemas.procedimentoSchema,
		quantidadeExecutada: joi.string().regex(/^\d{1,8}(\.\d{0,4})?$/),
		viaAcesso: joi.string().valid(["1", "2", "3"]),
		tecnicaUtilizada:joi.string().valid(["1", "2", "3"]),
		reducaoAcrescimo: joi.string().regex(/^\d{1,3}(\.\d{0,2})?$/),
		valorUnitario: joi.string().regex(/^\d{1,8}(\.\d{0,2})?$/),
		valorTotal: joi.string().regex(/^\d{1,8}(\.\d{0,2})?$/),
		identEquipe: identEquipeSchema
	})
})

const guiaResumoInternacaoSchema = joi.object().keys({
	cabecalhoGuia: cabecalhoGuiaSchema,
	numeroGuiaSolicitacaoInterna: joi.string().min(1).max(20),
	dadosAutorizacao: autorizacaoResumoInternacaoSchema,
	dadosBeneficiario: schemas.dadosBeneficiarioSchema,
	dadosExecutante: dadosExecutanteSchema,
	dadosInternacao: dadosInternacaoSchema,
	dadosSaidaInternacao: dadosSaidaInternacaoSchema,
	procedimentosExecutados: procedimentosExecutadosIntSchema,
	valorTotal: valorTotalSchema,
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
	}).xor('codigoNaOperadora','cnpjLocalExecutante'),
	nomeContratado: joi.string().min(1).max(70),
	cnes: joi.string().min(1).max(7)
})

const dadosContratadoExecutanteSchema = joi.object().keys({
	codigonaOperadora: joi.string().min(1).max(14),
	nomeContratadoExecutante: joi.string().min(1).max(70),
	cnesContratadoExecutante: joi.string().min(1).max(7)
})

const dadosInternacaoHonorariosSchema = joi.object().keys({
	dataInicioFaturamento: customJoi.string().isDateStr(),
	dataFimFaturamento: customJoi.string().isDateStr()
})

const profissionaisSchema = joi.object().keys({
	grauParticipacao: joi.string().valid(["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13"]),
	codProfissional: joi.object().keys({
		codigoPrestadorNaOperadora: joi.string().min(1).max(14),
		cpfContratado: customJoi.string().isCPF(),
	}).xor('codigoPrestadorNaOperadora', 'cpfContratado'),
	nomeProfissional: joi.string().min(1).max(70),
	conselhoProfissional: joi.string().valid(lists.conselhoProfissional),
	numeroConselhoProfissional: joi.string().min(1).max(15),
	UF: joi.string().valid(lists.UF),
	CBOS: joi.string().valid(lists.CBOS)
})

const procedimentosRealizadosSchema = joi.object().keys({
	procedimentoRealizado: joi.object().keys({
		dataExecucao: customJoi.string().isDateStr(),
		horaInicial: customJoi.string().isHourStr(),
		horaFinal: customJoi.string().isHourStr(),
		procedimento: schemas.procedimentoSchema,
		quantidadeExecutada: joi.string().regex(/^\d{1,8}(\.\d{0,4})?$/),
		viaAcesso: joi.string().valid(["1", "2", "3"]),
		tecnicaUtilizada:joi.string().valid(["1", "2", "3"]),
		reducaoAcrescimo: joi.string().regex(/^\d{1,3}(\.\d{0,2})?$/),
		valorUnitario: joi.string().regex(/^\d{1,8}(\.\d{0,2})?$/),
		valorTotal: joi.string().regex(/^\d{1,8}(\.\d{0,4})?$/),
		profissionais: profissionaisSchema
	})
})

const guiaHonorariosSchema = joi.object().keys({
	cabecalhoGuia: cabecalhoGuiaSchema,
	guiaSolicInternacao: joi.string().min(1).max(20),
	senha: joi.string().min(1).max(20),
	numeroGuiaOperadora: joi.string().min(1).max(20),
	beneficiario: beneficiarioHonorariosSchema,
	localContratado: localContratadoSchema,
	dadosContratadoExecutante: dadosContratadoExecutanteSchema,
	dadosInternacao: dadosInternacaoHonorariosSchema,
	procedimentosRealizados: procedimentosRealizadosSchema,
	observacao: joi.string().min(1).max(500),
	valorTotalHonorarios: joi.string().regex(/^\d{1,10}(\.\d{0,2})?$/),
	dataEmissaoGuia: customJoi.string().isDateStr()
	// assinaturaDigitalGuia:
})

const contratadoExecutanteSchema = schemas.dadosContratadoSchema.keys({
		CNES: joi.string().min(1).max(7)
})

const consultaAtendimentoSchema = joi.object().keys({
	dataAtendimento: customJoi.string().isDateStr(),
	tipoConsulta: joi.string().valid(["1","2","3","4"]),
	procedimento: joi.object().keys({
		codigoTabela: joi.string().valid(lists.dm_tabela),
		codigoProcedimento: joi.string().min(1).max(10),
		valorProcedimento: joi.string().regex(/^\d{1,8}(\.\d{0,2})?$/)
	})
})

const guiaConsultaSchema = joi.object().keys({
	cabecalhoConsulta: cabecalhoGuiaSchema,
	numeroGuiaOperadora: joi.string().min(1).max(20),
	dadosBeneficiario: schemas.dadosBeneficiarioSchema,
	contratadoExecutante: contratadoExecutanteSchema,
	profissionalExecutante: schemas.profissionalSolicitanteSchema,
	indicacaoAcidente: joi.string().valid(["0","1","2","9"]),
	dadosAtendimento: consultaAtendimentoSchema,
	observacao: joi.string().min(1).max(500)
	// assinaturaDigitalGuia:
})

const loteGuiasSchema = joi.object().keys({
	numeroLote: joi.string().min(1).max(12),
	guiaTISS: joi.object().keys({
		guiaSPSADT: guiaSPSADTSchema,
		guiaResumoInternacao: guiaResumoInternacaoSchema,
		guiaHonorarios: guiaHonorariosSchema,
		guiaConsulta: guiaConsultaSchema,
	}).xor('guiaSPSADT', 'guiaResumoInternacao', 'guiaHonorarios', 'guiaConsulta', 'guiaOdonto')
})


//-- ROUTES SCHEMAS --

const loteGuiasFullSchema = joi.object().keys({
	cabecalho: joi.object().keys({
		identificacaoTransacao: identificacaoTransacaoSchema,
		origem: joi.object().keys({
			identificacaoPrestador: identificacaoPrestadorSchema
		}),
		destino: joi.object().keys({
			registroANS: joi.string().regex(/[0-9]{6}/)
		}),
		padrao: joi.string(),
		loginSenhaPrestador: loginSenhaPrestadorSchema
	}),
	prestadorParaOperadora: joi.object().keys({
		loteGuias: loteGuiasSchema
	})
})



//-- EXPORTS --

module.exports = {
	weakLoteGuias: loteGuiasFullSchema, //KEY MUST BE THE SAME NAME AS ROUTE NAME CALLED
}
